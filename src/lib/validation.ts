import type { ProjectBrief } from "@/lib/ark-engine";

/**
 * Shared input validation for every project brief channel.
 *
 * These routes previously each re-implemented their own cleaning and length
 * rules, which let them drift apart (one enforced a 1000 char cap, another
 * 2000). Centralising the rules keeps the ARK conversation, the direct form
 * and the API consistent.
 */

export const BRIEF_FIELDS = [
  "name",
  "email",
  "project",
  "problem",
  "goals",
  "timeline",
  "budget",
] as const;

export type BriefField = (typeof BRIEF_FIELDS)[number];

/**
 * Per-field limits.
 *
 * These were previously tightened to per-field sizes (name 120, timeline 200,
 * etc). That was an unrequested change which made previously-acceptable briefs
 * fail validation with "Invalid field", so the original flat 2000 cap is
 * restored for everything. name/email keep RFC-derived ceilings only because
 * those are not content limits.
 */
export const FIELD_LIMITS: Record<BriefField, number> = {
  name: 2000,
  email: 254,
  project: 2000,
  problem: 2000,
  goals: 2000,
  timeline: 2000,
  budget: 2000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * Coerce arbitrary parsed JSON into a brief, dropping non-string values and
 * enforcing per-field length limits.
 *
 * Returns the cleaned brief plus a list of rejected field names.
 */
export function sanitizeBrief(input: unknown): {
  brief: ProjectBrief;
  invalid: string[];
} {
  const brief: ProjectBrief = {};
  const invalid: string[] = [];

  if (typeof input !== "object" || input === null) {
    return { brief, invalid };
  }

  const source = input as Record<string, unknown>;

  for (const field of BRIEF_FIELDS) {
    const value = source[field];

    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value !== "string") {
      invalid.push(field);
      continue;
    }

    const trimmed = value.trim();

    if (trimmed.length > FIELD_LIMITS[field]) {
      invalid.push(field);
      continue;
    }

    brief[field] = trimmed;
  }

  return { brief, invalid };
}

/**
 * A brief is deliverable when it has a valid email and a real project
 * description. Used before persisting a lead and before sending mail.
 */
export function isDeliverableBrief(brief: ProjectBrief): boolean {
  return (
    isValidEmail(brief.email ?? "") &&
    (brief.project?.trim().length ?? 0) > 0
  );
}