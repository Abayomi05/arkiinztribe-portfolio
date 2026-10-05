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
  /** Set once the inbox email for this lead has been accepted by the provider. */
  emailed_at: string | null;
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

  /**
   * Record that the inbox email for a lead was accepted.
   *
   * This lives in the store rather than in memory because both the
   * messages and leads routes need to see it, and on serverless each
   * function instance has its own memory.
   */
  markLeadEmailed(conversationId: string): Promise<void>;
}