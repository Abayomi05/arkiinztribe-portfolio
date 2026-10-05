import { Resend } from "resend";
import type { ProjectBrief } from "@/lib/ark-engine";
import {
  buildBriefEmailHtml,
  buildBriefEmailText,
} from "@/lib/brief-email";

const DEFAULT_SOURCE = "the ARKIINZTRIBE project system";

type DeliverResult = { delivered: boolean; error?: string };

/**
 * Deliver a project brief to the ARKIINZTRIBE inbox.
 *
 * Returns delivered=false (rather than throwing) when Resend is not
 * configured, so callers can decide whether that is fatal.
 */
export async function deliverProjectBrief(
  brief: ProjectBrief,
  source = DEFAULT_SOURCE,
): Promise<DeliverResult> {
  const key = process.env.RESEND_API_KEY;
  const destination = process.env.PROJECT_BRIEF_TO_EMAIL;

  if (!key || !destination) {
    console.error(
      "PROJECT_BRIEF_CONFIG_MISSING: RESEND_API_KEY / PROJECT_BRIEF_TO_EMAIL",
    );

    return { delivered: false };
  }

  const resend = new Resend(key);
  const subjectProject = brief.project?.trim() || "Untitled project";

  const { error } = await resend.emails.send({
    from:
      process.env.PROJECT_BRIEF_FROM_EMAIL ||
      "ARKIINZTRIBE <onboarding@resend.dev>",
    to: [destination],
    replyTo: brief.email?.trim() || undefined,
    subject: `NEW ARKIINZTRIBE PROJECT BRIEF — ${subjectProject}`.slice(0, 200),
    html: buildBriefEmailHtml(brief, source),
    text: buildBriefEmailText(brief, source),
  });

  if (error) {
    console.error("PROJECT_BRIEF_RESEND_ERROR", JSON.stringify(error, null, 2));

    return { delivered: false, error: "email delivery failed" };
  }

  return { delivered: true };
}