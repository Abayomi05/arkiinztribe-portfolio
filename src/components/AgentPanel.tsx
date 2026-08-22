"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "visitor" | "ark";
  content: string;
};

type ConversationResponse = {
  conversation: {
    id: string;
    sessionId: string;
    brief: Record<string, unknown>;
    ready: boolean;
    messages: Message[];
  };
  storage: string;
};

type MessageResponse = {
  message: Message;
  brief: Record<string, unknown>;
  ready: boolean;
};

const actions = [
  { label: "Show our work", href: "#work" },
  { label: "What we build", href: "#services" },
  { label: "Enter the lab", href: "#lab" },
  { label: "Start a project", href: "#ark-agent" },
];

const initialMessage: Message = {
  role: "ark",
  content:
    "I’m ARK. Tell me what you’re building, what problem you’re solving, or ask me about our systems.",
};

export default function AgentPanel() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [storage, setStorage] = useState("LOCAL SESSION");
  const [ready, setReady] = useState(false);
  const openAgentRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (window.location.hash !== "#ark-agent" || !openAgentRef.current) return;
    void openAgentRef.current();
  }, []);

  async function openAgent() {
    setOpen(true);

    if (conversationId) return;

    try {
      const response = await fetch("/api/ark/conversations", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to initialize ARK.");
      }

      const data = (await response.json()) as ConversationResponse;

      setConversationId(data.conversation.id);
      setMessages(
        data.conversation.messages?.length
          ? data.conversation.messages
          : [initialMessage],
      );
      setStorage(data.storage);
    } catch {
      setMessages([
        {
          role: "ark",
          content:
            "ARK could not initialize the session. You can still use the project links below.",
        },
      ]);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

    if (!content || loading || !conversationId) return;

    setInput("");
    setLoading(true);

    setMessages((current) => [...current, { role: "visitor", content }]);

    try {
      const response = await fetch("/api/ark/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          content,
        }),
      });

      const data = (await response.json()) as
        MessageResponse | { error?: string };

      if (!response.ok || !("message" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Unable to process message.",
        );
      }

      setMessages((current) => [...current, data.message]);
      setReady(data.ready);

      if (data.ready) {
        const leadResponse = await fetch("/api/ark/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId,
            brief: data.brief,
          }),
        });

        const leadData = (await leadResponse.json()) as {
          message?: string;
          error?: string;
        };

        if (!leadResponse.ok) {
          throw new Error(
            leadData.error || "Unable to transmit the project brief.",
          );
        }

        setMessages((current) => [
          ...current,
          {
            role: "ark",
            content: "TRANSMISSION COMPLETE. Your project brief has been securely received.",
          },
        ]);
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "ark",
          content:
            error instanceof Error
              ? error.message
              : "Unable to process that message.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  openAgentRef.current = openAgent;

  return (
    <div className={`agent-shell ${open ? "is-open" : ""}`}>
      {open && (
        <div className="agent-panel">
          <div className="agent-header">
            <div>
              <span className="agent-kicker">ARKIINZTRIBE AGENT</span>
              <strong>ARK</strong>
            </div>

            <span className="agent-online">
              <i /> ONLINE
            </span>
          </div>

          <div className="agent-chat" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`agent-chat-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                <span className="terminal-prompt">
                  {message.role === "ark" ? ">" : "$"}
                </span>
                <p>{message.content}</p>
              </div>
            ))}

            {loading && (
              <div className="agent-chat-message ark">
                <span className="terminal-prompt">&gt;</span>
                <p>PROCESSING...</p>
              </div>
            )}
          </div>

          <form className="agent-input" onSubmit={sendMessage}>
            <span>&gt;</span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                conversationId ? "Talk to ARK..." : "Initializing..."
              }
              disabled={loading || !conversationId}
              maxLength={2000}
              aria-label="Message ARK"
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || !conversationId}
              aria-label="Send message"
            >
              ↗
            </button>
          </form>

          <div className="agent-actions">
            {actions.map((action) => (
              <a
                href={action.href}
                key={action.href}
                onClick={() => setOpen(false)}
              >
                <span>{action.label}</span>
                <span>↗</span>
              </a>
            ))}
          </div>

          <div className="agent-footer">
            <span>
              {storage === "NEON" ? "DATABASE CONNECTED" : "AGENT STATUS"}
            </span>
            <span>{ready ? "BRIEF READY" : storage}</span>
          </div>
        </div>
      )}

      <button
        id="ark-agent"
        type="button"
        className="agent-trigger"
        onClick={() => {
          if (!open) {
            void openAgent();
          } else {
            setOpen(false);
          }
        }}
        aria-expanded={open}
        aria-label={open ? "Close ARK agent" : "Open ARK agent"}
      >
        <span className="agent-trigger-icon">{open ? "×" : "A"}</span>
        <span>{open ? "CLOSE" : "ASK ARK"}</span>
      </button>
    </div>
  );
}
