import type {
  ArkConversationRow,
  ArkLeadRow,
  ArkMessageRow,
  ArkStore,
} from "@/lib/ark-store";

/*
 * In-memory ARK store, used when DATABASE_URL is not configured.
 *
 * This keeps the whole ARK flow working on a fresh clone instead of
 * returning 404 on the first message.
 *
 * Limitations (deliberate, documented in docs/spec-ark-local-fallback.md):
 * this is per-process, so on serverless each instance holds its own copy
 * and data disappears on restart. It exists for local development and is
 * only selected when there is no DATABASE_URL.
 */

/*
 * State lives on globalThis rather than in module scope.
 *
 * In dev each route handler is bundled separately, so a plain module-level
 * Map would give every route its own copy and a conversation created by
 * POST /conversations would be invisible to /messages (404). globalThis is
 * shared per process, so this keeps one store across route bundles.
 *
 * The Symbol.for key also means duplicated copies of this module in
 * different bundles resolve to the same store.
 */

type MemoryState = {
  conversations: Map<string, ArkConversationRow>;
  messages: Map<string, ArkMessageRow[]>;
  leads: Map<string, ArkLeadRow>;
};

const STORE_KEY = Symbol.for("arkinztribe.memory-store");

function getState(): MemoryState {
  const globalScope = globalThis as unknown as Record<
    symbol,
    MemoryState | undefined
  >;

  if (!globalScope[STORE_KEY]) {
    globalScope[STORE_KEY] = {
      conversations: new Map(),
      messages: new Map(),
      leads: new Map(),
    };
  }

  return globalScope[STORE_KEY];
}

const state = getState();
const conversations = state.conversations;
const messages = state.messages;
const leads = state.leads;

/** Conversations idle for longer than this are evicted. */
const TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Drop conversations (and their messages/leads) that have been idle past
 * the TTL, so a long-running dev process cannot grow without bound.
 */
function sweep() {
  const cutoff = Date.now() - TTL_MS;

  for (const [id, conversation] of conversations) {
    if (new Date(conversation.updated_at).getTime() < cutoff) {
      conversations.delete(id);
      messages.delete(id);
      leads.delete(id);
    }
  }
}

/**
 * Drop expired entries before the store grows large, rather than on every
 * single call.
 */
function sweepIfNeeded() {
  if (conversations.size < 50) return;

  sweep();
}

/**
 * Owns the conversation only when the session matches.
 *
 * This check is what stops one visitor reading or writing another
 * visitor's conversation, so it is enforced on every access.
 */
function ownedConversation(
  id: string,
  sessionId: string,
): ArkConversationRow | null {
  const conversation = conversations.get(id);

  if (!conversation || conversation.session_id !== sessionId) return null;

  return conversation;
}

export const memoryStore: ArkStore = {
  async ensureArkSchema() {
    sweepIfNeeded();

    return true;
  },

  async createConversation(sessionId: string) {
    sweepIfNeeded();

    const now = new Date().toISOString();

    /*
     * Matches the id shape /api/ark/conversations already returned for
     * the no-database case, so the client sees one consistent format.
     */
    const conversation: ArkConversationRow = {
      id: `local-${sessionId}`,
      session_id: sessionId,
      brief: {},
      ready: false,
      created_at: now,
      updated_at: now,
    };

    conversations.set(conversation.id, conversation);

    return conversation;
  },

  async getConversation(id: string, sessionId: string) {
    const conversation = ownedConversation(id, sessionId);

    return conversation ? { ...conversation, created: true } : null;
  },

  async updateConversation(
    id: string,
    sessionId: string,
    brief: unknown,
    ready: boolean,
  ) {
    const conversation = ownedConversation(id, sessionId);

    if (!conversation) return null;

    const updated: ArkConversationRow = {
      ...conversation,
      brief: (brief ?? {}) as ArkConversationRow["brief"],
      ready,
      updated_at: new Date().toISOString(),
    };

    conversations.set(id, updated);

    return { ...updated, created: true };
  },

  async addMessage(
    conversationId: string,
    role: "visitor" | "ark",
    content: string,
  ) {
    /*
     * Mirrors the Postgres `WHERE EXISTS` guard: a message is never
     * stored against a conversation that does not exist.
     */
    if (!conversations.has(conversationId)) return null;

    const row: ArkMessageRow = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role,
      content,
      created_at: new Date().toISOString(),
    };

    const existing = messages.get(conversationId) ?? [];

    existing.push(row);
    messages.set(conversationId, existing);

    return { ...row, created: true };
  },

  async getMessages(conversationId: string) {
    // Oldest first, matching `ORDER BY created_at ASC`.
    return [...(messages.get(conversationId) ?? [])].sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    );
  },

  async createArkLead(
    conversationId: string,
    sessionId: string,
    brief,
  ): Promise<ArkLeadRow | null> {
    if (!ownedConversation(conversationId, sessionId)) return null;

    /*
     * Idempotent per conversation. Returning created=false on a repeat
     * call is what stops the same brief being emailed twice.
     */
    const existing = leads.get(conversationId);

    if (existing) return { ...existing, created: false };

    const lead: ArkLeadRow = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      email: brief.email ?? "",
      project: brief.project ?? "",
      status: "new",
      created_at: new Date().toISOString(),
      created: true,
    };

    leads.set(conversationId, lead);

    return lead;
  },
};

/**
 * Test helper: forget everything. Not used by the app.
 */
export function __resetMemoryStore() {
  conversations.clear();
  messages.clear();
  leads.clear();
}