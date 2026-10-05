import type { ProjectBrief } from "@/lib/ark-engine";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escape untrusted values before embedding them in an HTML email body.
 * Without this, a brief containing markup is injected into the inbox HTML.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/**
 * Escape a value, then convert newlines to <br /> so multi-line briefs
 * stay readable inside the HTML email.
 */
export function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

/**
 * Build the HTML body shared by every project brief delivery channel.
 */
export function buildBriefEmailHtml(brief: ProjectBrief, source: string): string {
  const field = (label: string, value?: string) => {
    const cleaned = value?.trim();
    return `<tr>
  <td style="padding:8px 16px 8px 0;color:#6b7280;font-size:14px;white-space:nowrap;vertical-align:top;">${label}</td>
  <td style="padding:8px 0;color:#111827;font-size:14px;">${
    cleaned ? escapeHtmlMultiline(cleaned) : "Not provided"
  }</td>
</tr>`;
  };

  return `<div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#ffffff;padding:24px;">
  <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;max-width:640px;">
    <div style="background:#0a0a0a;padding:20px 24px;">
      <h1 style="margin:0;color:#ffffff;font-size:16px;letter-spacing:0.08em;text-transform:uppercase;">New ARKIINZTRIBE project brief</h1>
    </div>
    <table style="border-collapse:collapse;padding:8px 24px 16px;width:100%;">
      ${field("Project", brief.project)}
      ${field("Problem", brief.problem)}
      ${field("Goals", brief.goals)}
      ${field("Timeline", brief.timeline)}
      ${field("Budget", brief.budget)}
      ${field("Name", brief.name)}
      ${field("Email", brief.email)}
    </table>
    <div style="border-top:1px solid #e5e7eb;padding:14px 24px;color:#6b7280;font-size:12px;">
      Submitted through ${escapeHtml(source)}
    </div>
  </div>
</div>`;
}

/**
 * Build the plain-text body used as the email fallback.
 */
export function buildBriefEmailText(brief: ProjectBrief, source: string): string {
  const line = (label: string, value?: string) =>
    `${label}: ${value?.trim() || "Not provided"}`;

  return [
    "NEW ARKIINZTRIBE PROJECT BRIEF",
    "",
    line("Project", brief.project),
    "",
    line("Problem", brief.problem),
    "",
    line("Goals", brief.goals),
    "",
    line("Timeline", brief.timeline),
    "",
    line("Budget", brief.budget),
    "",
    line("Name", brief.name),
    line("Email", brief.email),
    "",
    `Submitted through ${source}`,
  ].join("\n");
}