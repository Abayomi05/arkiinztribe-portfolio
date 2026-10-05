# ARKIINZTRIBE Portfolio

Marketing site and project-brief intake for ARKIINZTRIBE, built with
Next.js (App Router), React 19 and TypeScript.

## Features

- Single-page marketing site with animated section reveals
- Case study pages at `/work/[slug]`
- **ARK agent** - a rule-based chat assistant that walks a visitor
  through a structured project brief
- **Direct project brief form** with email delivery via Resend
- Optional Neon (Postgres) persistence for conversations and leads
- SEO metadata, `sitemap.xml` and `robots.txt`

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Environment variables

See `.env.example` for the full list. The app degrades gracefully:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for metadata, sitemap and robots |
| `RESEND_API_KEY` | For email | Resend API key |
| `PROJECT_BRIEF_TO_EMAIL` | For email | Inbox that receives briefs |
| `PROJECT_BRIEF_FROM_EMAIL` | No | Verified sender, defaults to `onboarding@resend.dev` |
| `DATABASE_URL` | No | Neon Postgres connection string. Without it ARK runs as a local session and no leads are persisted |
| `ALLOWED_DEV_ORIGINS` | No | Comma-separated origins for `next dev` on a LAN |

Brief submission returns a clear error if email delivery is not
configured, rather than silently failing.

## Architecture

```
src/
  app/
    page.tsx                    # home page
    work/[slug]/page.tsx        # case studies (generateStaticParams)
    api/project-brief/          # direct brief form endpoint
    api/ark/conversations/      # create / resume an ARK session
    api/ark/messages/           # ARK turn, persists messages
    api/ark/briefs/             # save a brief explicitly
    api/ark/leads/              # submit a completed brief
  components/                   # AgentPanel, modals, nav, reveals
  lib/
    ark-engine.ts               # ARK conversation state machine
    ark-db.ts                   # Neon persistence
    validation.ts               # shared brief sanitising + limits
    brief-email.ts              # escaped email templates
    brief-mailer.ts             # Resend delivery
    rate-limit.ts               # in-memory abuse guard
```

Brief input flows through `sanitizeBrief` in every channel, so the
length limits and email validation cannot drift between the ARK
conversation and the direct form. HTML email bodies are escaped in
`brief-email.ts`.

## Rate limiting

`src/lib/rate-limit.ts` is a per-instance in-memory limiter, enough to
blunt casual spam. For a global limit, back `rateLimit` with a shared
store (Upstash Redis or Vercel KV).

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```