"use client";

import { useState } from "react";

const actions = [
  { label: "Show our work", href: "#work" },
  { label: "What we build", href: "#services" },
  { label: "Enter the lab", href: "#lab" },
  { label: "Start a project", href: "#contact" },
];

export default function AgentPanel() {
  const [open, setOpen] = useState(false);

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

          <div className="agent-message">
            <span className="terminal-prompt">&gt;</span>
            <p>
              I&apos;m ARK. I can guide you through our systems, projects and
              capabilities.
            </p>
          </div>

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
            <span>AGENT STATUS</span>
            <span>READY</span>
          </div>
        </div>
      )}

      <button
        type="button"
        className="agent-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close ARK agent" : "Open ARK agent"}
      >
        <span className="agent-trigger-icon">{open ? "×" : "A"}</span>
        <span>
          {open ? "CLOSE" : "ASK ARK"}
        </span>
      </button>
    </div>
  );
}
