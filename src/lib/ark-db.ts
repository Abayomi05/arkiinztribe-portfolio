import { Pool } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export const hasDatabase = Boolean(databaseUrl);

const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;

export async function ensureArkSchema() {
  if (!pool) return false;

  await pool.query(`
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

    CREATE INDEX IF NOT EXISTS ark_conversations_session_idx
      ON ark_conversations(session_id);

    CREATE INDEX IF NOT EXISTS ark_messages_conversation_idx
      ON ark_messages(conversation_id, created_at);
  `);

  return true;
}

export async function createConversation(sessionId: string) {
  if (!pool) return null;

  await ensureArkSchema();

  const result = await pool.query(
    `INSERT INTO ark_conversations (session_id)
     VALUES ($1)
     RETURNING id, session_id, brief, ready, created_at, updated_at`,
    [sessionId],
  );

  return result.rows[0];
}

export async function getConversation(id: string, sessionId: string) {
  if (!pool) return null;

  await ensureArkSchema();

  const result = await pool.query(
    `SELECT id, session_id, brief, ready, created_at, updated_at
     FROM ark_conversations
     WHERE id = $1 AND session_id = $2`,
    [id, sessionId],
  );

  return result.rows[0] ?? null;
}

export async function updateConversation(
  id: string,
  sessionId: string,
  brief: unknown,
  ready: boolean,
) {
  if (!pool) return null;

  const result = await pool.query(
    `UPDATE ark_conversations
     SET brief = $1, ready = $2, updated_at = NOW()
     WHERE id = $3 AND session_id = $4
     RETURNING id, session_id, brief, ready, created_at, updated_at`,
    [JSON.stringify(brief), ready, id, sessionId],
  );

  return result.rows[0] ?? null;
}

export async function addMessage(
  conversationId: string,
  role: "visitor" | "ark",
  content: string,
) {
  if (!pool) return null;

  const result = await pool.query(
    `INSERT INTO ark_messages (conversation_id, role, content)
     SELECT $1, $2, $3
     WHERE EXISTS (
       SELECT 1 FROM ark_conversations WHERE id = $1
     )
     RETURNING id, conversation_id, role, content, created_at`,
    [conversationId, role, content],
  );

  return result.rows[0] ?? null;
}

export async function getMessages(conversationId: string) {
  if (!pool) return [];

  const result = await pool.query(
    `SELECT id, conversation_id, role, content, created_at
     FROM ark_messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId],
  );

  return result.rows;
}

export async function createArkLead(
  conversationId: string,
  sessionId: string,
  brief: {
    name?: string;
    email?: string;
    project?: string;
    problem?: string;
    goals?: string;
    timeline?: string;
    budget?: string;
  },
) {
  if (!pool) return null;

  await ensureArkSchema();

  await pool.query(`
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

    CREATE INDEX IF NOT EXISTS ark_leads_session_idx
      ON ark_leads(session_id);

    CREATE INDEX IF NOT EXISTS ark_leads_status_idx
      ON ark_leads(status);
  `);

  const existing = await pool.query(
    `SELECT id, conversation_id, email, project, status, created_at
     FROM ark_leads
     WHERE conversation_id = $1
     LIMIT 1`,
    [conversationId],
  );

  if (existing.rows[0]) {
    return existing.rows[0];
  }

  const result = await pool.query(
    `INSERT INTO ark_leads (
      conversation_id,
      session_id,
      name,
      email,
      project,
      problem,
      goals,
      timeline,
      budget
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, conversation_id, email, project, status, created_at`,
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

  return result.rows[0] ?? null;
}
