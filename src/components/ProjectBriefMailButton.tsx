"use client";

export default function ProjectBriefMailButton() {
  function transmitBrief() {
    const subject = "ARKIINZTRIBE PROJECT BRIEF";

    const body = [
      "Hello ARKIINZTRIBE,",
      "",
      "I would like to discuss a project.",
      "",
      "PROJECT:",
      "",
      "",
      "PROBLEM / NEED:",
      "",
      "",
      "GOALS:",
      "",
      "",
      "TIMELINE:",
      "",
      "",
      "BUDGET:",
      "",
      "",
      "MY NAME:",
      "",
      "",
      "MY EMAIL:",
      "",
      "",
      "Thank you.",
    ].join("\n");

    window.location.href =
      `mailto:johnsonarkiinz@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  }

  return (
    <button
      type="button"
      onClick={transmitBrief}
      className="system-button primary"
      aria-label="Transmit project brief by email"
    >
      TRANSMIT PROJECT BRIEF ↗
    </button>
  );
}
