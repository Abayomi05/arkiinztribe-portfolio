import type { ProjectBrief } from "@/lib/ark-engine";

/*
 * Storage contract shared by the Neon and in-memory backends.
 *
 * Field names deliberately mirror the Postgres rows (snake_case
 * `session_id`) so the two backends are interchangeable and no route
 * needs to know which one answered.
 */

export type ArkConversationRow = {
  id: string;
  session_id: string;
  brief: ProjectBrief;
  ready: boolean;
  created_at: string;
  updated_at: string;
};

export type ArkMessageRow = {
  id: string;
  conversation_id: string;
  role: "visitor" | "ark";
  content: string;
  created_at: string;
};

export type ArkLeadRow = {
  id: string;
  conversation_id: string;
  email: string;
  project: string;
  status: string;
  created_at: string;
  created: boolean;
};

export interface ArkStore {
  ensureArkSchema(): Promise<boolean>;

  createConversation(
    sessionId: string,
  ): Promise<ArkConversationRow | null>;

  getConversation(
    id: string,
    sessionId: string,
  ): Promise<(ArkConversationRow & { created: true }) | null>;

  updateConversation(
    id: string,
    sessionId: string,
    brief: unknown,
    ready: boolean,
  ): Promise<(ArkConversationRow & { created: true }) | null>;

  addMessage(
    conversationId: string,
    role: "visitor" | "ark",
    content: string,
  ): Promise<(ArkMessageRow & { created: true }) | null>;

  getMessages(conversationId: string): Promise<ArkMessageRow[]>;

  createArkLead(
    conversationId: string,
    sessionId: string,
    brief: ProjectBrief,
  ): Promise<ArkLeadRow | null>;
}