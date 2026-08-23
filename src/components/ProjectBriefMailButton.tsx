"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  project: string;
  problem: string;
  goals: string;
  timeline: string;
  budget: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  project: "",
  problem: "",
  goals: "",
  timeline: "",
  budget: "",
};

export default function ProjectBriefMailButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    setSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/project-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Project brief transmission failed.");
      }

      setMessage(
        data.message || "PROJECT BRIEF TRANSMITTED. DELIVERY CONFIRMED.",
      );
      setForm(initialForm);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "PROJECT BRIEF TRANSMISSION FAILED.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMessage("");
          setOpen(true);
        }}
        className="system-button primary"
        aria-label="Transmit project brief"
      >
        TRANSMIT PROJECT BRIEF ↗
      </button>

      {open && (
        <div
          className="brief-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <section
            className="brief-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="brief-modal-title"
          >
            <div className="brief-modal-header">
              <div>
                <span className="brief-modal-kicker">
                  DIRECT PROJECT TRANSMISSION
                </span>
                <h3 id="brief-modal-title">PROJECT BRIEF</h3>
              </div>

              <button
                type="button"
                className="brief-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close project brief"
              >
                ×
              </button>
            </div>

            <p className="brief-modal-intro">
              Send the project details directly to ARKIINZTRIBE. This
              transmission is independent of ASK ARK.
            </p>

            <form className="brief-form" onSubmit={submit}>
              <div className="brief-form-grid">
                <label>
                  YOUR NAME
                  <input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>

                <label>
                  YOUR EMAIL *
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <label>
                PROJECT *
                <textarea
                  required
                  value={form.project}
                  onChange={(event) => update("project", event.target.value)}
                  placeholder="What do you want to build?"
                />
              </label>

              <label>
                PROBLEM / NEED
                <textarea
                  value={form.problem}
                  onChange={(event) => update("problem", event.target.value)}
                  placeholder="What problem should it solve?"
                />
              </label>

              <label>
                GOALS
                <textarea
                  value={form.goals}
                  onChange={(event) => update("goals", event.target.value)}
                  placeholder="What should the project achieve?"
                />
              </label>

              <div className="brief-form-grid">
                <label>
                  TIMELINE
                  <input
                    value={form.timeline}
                    onChange={(event) =>
                      update("timeline", event.target.value)
                    }
                    placeholder="e.g. 3 months"
                  />
                </label>

                <label>
                  BUDGET
                  <input
                    value={form.budget}
                    onChange={(event) => update("budget", event.target.value)}
                    placeholder="e.g. ₦500,000"
                  />
                </label>
              </div>

              <div className="brief-mail-destination">
                <span>DELIVERY</span>
                <strong>ARKIINZTRIBE PROJECT INBOX</strong>
              </div>

              <button
                type="submit"
                className="brief-submit"
                disabled={sending}
              >
                {sending
                  ? "TRANSMITTING..."
                  : "TRANSMIT PROJECT BRIEF ↗"}
              </button>

              {message && (
                <p className="brief-mail-note" role="status">
                  {message}
                </p>
              )}
            </form>
          </section>
        </div>
      )}
    </>
  );
}
