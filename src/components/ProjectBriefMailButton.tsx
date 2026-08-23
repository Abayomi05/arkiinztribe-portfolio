"use client";

const MAILTO =
  "mailto:johnsonarkiinz@gmail.com" +
  "?subject=ARKIINZTRIBE%20Project%20Brief" +
  "&body=Hello%20ARKIINZTRIBE%2C%0A%0A" +
  "I%27d%20like%20to%20discuss%20a%20project.%0A%0A" +
  "Project%3A%0AProblem%3A%0AGoals%3A%0A" +
  "Timeline%3A%0ABudget%3A%0A%0AThank%20you.";

export default function ProjectBriefMailButton() {
  function openMail() {
    window.location.href = MAILTO;
  }

  return (
    <button
      type="button"
      onClick={openMail}
      className="system-button primary"
      aria-label="Transmit project brief by email"
    >
      TRANSMIT PROJECT BRIEF ↗
    </button>
  );
}
