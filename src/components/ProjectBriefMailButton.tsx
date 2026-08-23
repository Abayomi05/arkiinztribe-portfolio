"use client";

export default function ProjectBriefMailButton() {
  function transmitBrief() {
    window.dispatchEvent(new Event("ark:transmit-brief"));

    window.requestAnimationFrame(() => {
      document
        .getElementById("ark-agent")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <button
      type="button"
      onClick={transmitBrief}
      className="system-button primary"
      aria-label="Transmit project brief"
    >
      TRANSMIT PROJECT BRIEF ↗
    </button>
  );
}
