"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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
  const [status, setStatus] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
      setStatus("");
    }

    window.addEventListener("project-brief:open", handleOpen);

    return () => {
      window.removeEventListener("project-brief:open", handleOpen);
    };
  }, []);

  /*
   * Move focus into the dialog when it opens, and support Escape to close.
   * Without this the modal is keyboard-trapping: tab order stays behind the
   * overlay and Escape does nothing.
   */
  useEffect(() => {
    if (!open) return;

    firstFieldRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !sending) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, sending]);

  /*
   * Keep Tab inside the dialog while it is open.
   */
  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function closeModal() {
    if (sending) return;
    setOpen(false);
  }

  async function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    setSending(true);
    setStatus("TRANSMITTING PROJECT BRIEF...");

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
        throw new Error(
          data.error || "Project brief delivery failed.",
        );
      }

      setStatus(
        data.message ||
          "PROJECT BRIEF TRANSMITTED. DELIVERY CONFIRMED.",
      );
      setForm(initialForm);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "PROJECT BRIEF DELIVERY FAILED.",
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
          setOpen(true);
          setStatus("");
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
              closeModal();
            }
          }}
        >
          <section
            ref={dialogRef}
            onKeyDown={handleDialogKeyDown}
            className="brief-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-brief-title"
          >
            <div className="brief-modal-header">
              <div>
                <span className="brief-modal-kicker">
                  DIRECT PROJECT CHANNEL
                </span>
                <h3 id="project-brief-title">
                  TRANSMIT PROJECT BRIEF
                </h3>
              </div>

              <button
                type="button"
                className="brief-modal-close"
                onClick={closeModal}
                disabled={sending}
                aria-label="Close project brief"
              >
                ×
              </button>
            </div>

            <p className="brief-modal-intro">
              Send your project details directly to ARKIINZTRIBE.
              This channel is independent from ASK ARK.
            </p>

            <form className="brief-form" onSubmit={submitBrief}>
              <label>
                NAME
                <input
                  ref={firstFieldRef}
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  maxLength={120}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <label>
                EMAIL
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  maxLength={254}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                PROJECT
                <textarea
                  required
                  value={form.project}
                  onChange={(event) =>
                    updateField("project", event.target.value)
                  }
                  maxLength={2000}
                  rows={3}
                  placeholder="What are you building?"
                />
              </label>

              <label>
                PROBLEM / NEED
                <textarea
                  value={form.problem}
                  onChange={(event) =>
                    updateField("problem", event.target.value)
                  }
                  maxLength={2000}
                  rows={3}
                  placeholder="What problem should it solve?"
                />
              </label>

              <label>
                GOALS
                <textarea
                  value={form.goals}
                  onChange={(event) =>
                    updateField("goals", event.target.value)
                  }
                  maxLength={2000}
                  rows={3}
                  placeholder="What should success look like?"
                />
              </label>

              <label>
                TIMELINE
                <input
                  value={form.timeline}
                  onChange={(event) =>
                    updateField("timeline", event.target.value)
                  }
                  maxLength={200}
                  placeholder="e.g. 8 weeks"
                />
              </label>

              <label>
                BUDGET
                <input
                  value={form.budget}
                  onChange={(event) =>
                    updateField("budget", event.target.value)
                  }
                  maxLength={200}
                  placeholder="Expected budget"
                />
              </label>

              <button
                type="submit"
                className="system-button primary"
                disabled={sending}
              >
                {sending
                  ? "TRANSMITTING..."
                  : "SEND PROJECT BRIEF ↗"}
              </button>
            </form>

            {status && (
              <p className="brief-modal-intro" role="status">
                {status}
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
