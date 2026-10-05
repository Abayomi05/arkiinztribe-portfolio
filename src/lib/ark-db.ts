import { Pool } from "@neondatabase/serverless";
import { memoryStore } from "@/lib/ark-memory";
import type { ArkStore } from "@/lib/ark-store";
import type { ProjectBrief } from "@/lib/ark-engine";

const databaseUrl = process.env.DATABASE_URL;

export const hasDatabase = Boolean(databaseUrl);

const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;

/*
 * When DATABASE_URL is absent the memory store is used, so ARK works on a
 * fresh clone instead of 404-ing on the first message. See
 * docs/spec-ark-local-fallback.md.
 */
const store: ArkStore = pool ? neonStore(pool) : memoryStore;

function neonStore(db: Pool): ArkStore {
  return {
    async ensureArkSchema() {
      await db.query(`
    CREATE TABLE IF NOT EXISTS ark_conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL,
      brief JSONB NOT NULL DEFAULT '{}'::jsonb,
      ready BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ark_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES ark_conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('visitor', 'ark')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ark_leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES ark_conversations(id) ON DELETE CASCADE,
      session_id TEXT NOT NULL,
      name TEXT,
      email TEXT NOT NULL,
      project TEXT NOT NULL,
      problem TEXT,
      goals TEXT,
      timeline TEXT,
      budget TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    /* Migration: CREATE TABLE IF NOT EXISTS never alters an existing table. */
    ALTER TABLE ark_leads
      ADD COLUMN IF NOT EXISTS emailed_at TIMESTAMPTZ;

    CREATE INDEX IF NOT EXISTS ark_conversations_session_idx
      ON ark_conversations(session_id);

    CREATE INDEX IF NOT EXISTS ark_messages_conversation_idx
      ON ark_messages(conversation_id, created_at);

    CREATE INDEX IF NOT EXISTS ark_leads_session_idx
      ON ark_leads(session_id);

    CREATE INDEX IF NOT EXISTS ark_leads_status_idx
      ON ark_leads(status);
  `);

      return true;
    },
    async createConversation(sessionId: string) {
      await store.ensureArkSchema();

      const result = await db.query(
        `INSERT INTO ark_conversations (session_id)
         VALUES ($1)
         RETURNING id, session_id, brief, ready, created_at, updated_at`,
        [sessionId],
      );

      return result.rows[0];
    },

    async getConversation(id: string, sessionId: string) {
      const result = await db.query(
        `SELECT id, session_id, brief, ready, created_at, updated_at
         FROM ark_conversations
         WHERE id = $1 AND session_id = $2`,
        [id, sessionId],
      );

      return result.rows[0]
        ? { ...result.rows[0], created: true as const }
        : null;
    },

    async updateConversation(
      id: string,
      sessionId: string,
      brief: unknown,
      ready: boolean,
    ) {
      const result = await db.query(
        `UPDATE ark_conversations
         SET brief = $1, ready = $2, updated_at = NOW()
         WHERE id = $3 AND session_id = $4
         RETURNING id, session_id, brief, ready, created_at, updated_at`,
        [JSON.stringify(brief), ready, id, sessionId],
      );

      return result.rows[0]
        ? { ...result.rows[0], created: true as const }
        : null;
    },

    async addMessage(
      conversationId: string,
      role: "visitor" | "ark",
      content: string,
    ) {
      const result = await db.query(
        `INSERT INTO ark_messages (conversation_id, role, content)
         SELECT $1, $2, $3
         WHERE EXISTS (
           SELECT 1 FROM ark_conversations WHERE id = $1
         )
         RETURNING id, conversation_id, role, content, created_at`,
        [conversationId, role, content],
      );

      return result.rows[0]
        ? { ...result.rows[0], created: true as const }
        : null;
    },

    async getMessages(conversationId: string) {
      const result = await db.query(
        `SELECT id, conversation_id, role, content, created_at
         FROM ark_messages
         WHERE conversation_id = $1
         ORDER BY created_at ASC`,
        [conversationId],
      );

      return result.rows;
    },

    async createArkLead(
      conversationId: string,
      sessionId: string,
      brief: ProjectBrief,
    ) {
      const existing = await db.query(
        `SELECT id, conversation_id, email, project, status, created_at,
                emailed_at
         FROM ark_leads
         WHERE conversation_id = $1
         LIMIT 1`,
        [conversationId],
      );

      if (existing.rows[0]) {
        return {
          ...existing.rows[0],
          emailed_at: existing.rows[0].emailed_at ?? null,
          created: false as const,
        };
      }

      const result = await db.query(
        `INSERT INTO ark_leads (
          conversation_id, session_id, name, email, project,
          problem, goals, timeline, budget
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, conversation_id, email, project, status, created_at,
                  emailed_at`,
        [
          conversationId,
          sessionId,
          brief.name ?? null,
          brief.email,
          brief.project,
          brief.problem ?? null,
          brief.goals ?? null,
          brief.timeline ?? null,
          brief.budget ?? null,
        ],
      );

      return result.rows[0]
        ? {
            ...result.rows[0],
            emailed_at: result.rows[0].emailed_at ?? null,
            created: true as const,
          }
        : null;
    },

    async markLeadEmailed(conversationId: string) {
      await db.query(
        `UPDATE ark_leads
         SET emailed_at = NOW()
         WHERE conversation_id = $1
           AND emailed_at IS NULL`,
        [conversationId],
      );
    },
  };
}

export const ensureArkSchema = () => store.ensureArkSchema();

export const createConversation = (sessionId: string) =>
  store.createConversation(sessionId);

export const getConversation = (id: string, sessionId: string) =>
  store.getConversation(id, sessionId);

export const updateConversation = (
  id: string,
  sessionId: string,
  brief: unknown,
  ready: boolean,
) => store.updateConversation(id, sessionId, brief, ready);

export const addMessage = (
  conversationId: string,
  role: "visitor" | "ark",
  content: string,
) => store.addMessage(conversationId, role, content);

export const getMessages = (conversationId: string) =>
  store.getMessages(conversationId);

export const createArkLead = (
  conversationId: string,
  sessionId: string,
  brief: ProjectBrief,
) => store.createArkLead(conversationId, sessionId, brief);

export const markLeadEmailed = (conversationId: string) =>
  store.markLeadEmailed(conversationId);