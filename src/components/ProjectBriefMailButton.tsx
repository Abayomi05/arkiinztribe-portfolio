"use client";

import { useState } from "react";

export default function ProjectBriefMailButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "",
    problem: "",
    goals: "",
    timeline: "",
    budget: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function transmitBrief(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `NEW ARKIINZTRIBE PROJECT BRIEF — ${form.project.trim()}`;

    const body = [
      "ARKIINZTRIBE PROJECT BRIEF",
      "",
      `Name: ${form.name.trim() || "Not provided"}`,
      `Email: ${form.email.trim() || "Not provided"}`,
      "",
      "PROJECT",
      form.project.trim() || "Not provided",
      "",
      "PROBLEM",
      form.problem.trim() || "Not provided",
      "",
      "GOALS",
      form.goals.trim() || "Not provided",
      "",
      "TIMELINE",
      form.timeline.trim() || "Not provided",
      "",
      "BUDGET",
      form.budget.trim() || "Not provided",
      "",
      "Submitted through the ARKIINZTRIBE project brief system.",
    ].join("\n");

    const mailto = `mailto:johnsonarkiinz@gmail.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}${
      form.email.trim()
        ? `&cc=${encodeURIComponent(form.email.trim())}`
        : ""
    }`;

    window.location.href = mailto;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="system-button primary"
        aria-label="Transmit project brief by email"
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
                  ARKIINZTRIBE / DIRECT TRANSMISSION
                </span>
                <h3 id="brief-modal-title">SEND A PROJECT BRIEF</h3>
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
              Prefer not to use ARK? Fill this out and we&apos;ll prepare the
              brief in your preferred email app.
            </p>

            <form onSubmit={transmitBrief} className="brief-form">
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
                YOUR EMAIL
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                PROJECT
                <textarea
                  value={form.project}
                  onChange={(event) => update("project", event.target.value)}
                  placeholder="What do you want us to build?"
                  required
                />
              </label>

              <label>
                PROBLEM
                <textarea
                  value={form.problem}
                  onChange={(event) => update("problem", event.target.value)}
                  placeholder="What problem are you trying to solve?"
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
                    placeholder="e.g. 4 weeks"
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
                <span>DESTINATION</span>
                <strong>johnsonarkiinz@gmail.com</strong>
              </div>

              <button type="submit" className="brief-submit">
                OPEN PREFERRED MAIL APP ↗
              </button>

              <p className="brief-mail-note">
                Your device will let you choose the email app/account you want
                to send from. ARKIINZTRIBE does not control your sender
                account.
              </p>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
