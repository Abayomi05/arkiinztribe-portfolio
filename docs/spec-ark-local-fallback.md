# Spec: ARK local fallback (no `DATABASE_URL`)

## Problem

ARK is unusable without a database. In `src/lib/ark-db.ts` every function
starts with `if (!pool) return null`. When `DATABASE_URL` is unset the
pool is `null`, so:

| Call | Result |
| --- | --- |
| `createConversation` | `null` |
| `getConversation` | `null` → `/api/ark/messages` returns **404** |
| `addMessage` / `updateConversation` | `null`, silently drops writes |
| `createArkLead` | `null` → **500** "could not be saved" |

`/api/ark/conversations` has a `hasDatabase` branch that returns a
synthetic `local-<session>` conversation, so the UI appears to start up
and then every subsequent turn fails. This is pre-existing, not a
regression.

The practical effect: `npm run dev` on a fresh clone gives a broken ARK,
and the whole brief flow is untestable without provisioning Neon.

## Goal

Make the entire ARK flow work with no database, using an in-memory
store, without changing the public API of `ark-db.ts` or the shape of any
route response.

Explicitly **not** in scope: replacing Neon, changing lead semantics,
or making the in-memory store safe for multi-instance serverless.

## Design

Introduce a storage interface and two implementations, chosen once at
module load.

```
src/lib/ark-store.ts   interface + factory
src/lib/ark-memory.ts  in-memory implementation
src/lib/ark-db.ts      Neon implementation, unchanged public API
```

`ark-db.ts` keeps its exact exported function signatures and simply
delegates to the memory store when there is no pool:

```ts
const store = hasDatabase ? neonStore : memoryStore;
export const createConversation = (s: string) => store.createConversation(s);
```

### Why an interface rather than an `if (!pool)` in each function

The current shape spreads the null check across seven functions. Adding
a second backend inside each one doubles the branching and makes the
next backend harder still. One factory keeps the choice in one place and
leaves the route layer untouched.

## Behaviour to preserve

The memory store must match Neon so the UI cannot tell the difference:

- Same field names, including `session_id` (snake_case) and the
  `created: true|false` marker on rows.
- `createConversation(sessionId)` returns an id shaped `local-<sessionId>`,
  matching what `/api/ark/conversations` already hands the client.
- `getConversation(id, sessionId)` **requires a matching session** and
  returns `null` on mismatch. This is the ownership check that stops one
  visitor reading another's conversation; it must not be weakened.
- `getMessages` returns rows ordered oldest-first, matching `ORDER BY
  created_at ASC`.
- `addMessage` only inserts when the conversation exists, mirroring the
  `WHERE EXISTS` guard.
- `createArkLead` is idempotent per conversation: a second call returns
  the existing lead with `created: false`. This is what prevents
  duplicate inbox emails, so it is load-bearing, not cosmetic.
- `Date` values are returned as ISO strings, matching what the Postgres
  driver hands back over JSON.

## Constraints

- No new dependency. `crypto.randomUUID()` is already used in the routes.
- No changes to any route file.
- Session scoping is preserved exactly.

## Known limitation (documented, not solved)

The memory store is per-process and unbounded in lifetime. On Vercel each
instance has its own copy, so a conversation can appear to vanish between
requests, and a long-running process accumulates data.

Mitigations:
- Conversations and messages are evicted after 24h of inactivity.
- The store is only selected when `DATABASE_URL` is absent, which in
  production means a misconfiguration. `/api/ark/conversations` keeps
  reporting `LOCAL SESSION` so this is visible rather than silent.

## Acceptance criteria

1. With no `DATABASE_URL`, a full ARK conversation runs start to finish
   and the brief reaches the lead stage.
2. `/api/ark/messages` no longer returns 404 without a database.
3. `getConversation` with a mismatched session still returns `null`.
4. `createArkLead` twice for one conversation returns `created: true`
   then `created: false`.
5. Every existing `ark-db.ts` export keeps its signature.
6. No route file changes.
7. `tsc`, `eslint --max-warnings=0` and `next build` all pass.