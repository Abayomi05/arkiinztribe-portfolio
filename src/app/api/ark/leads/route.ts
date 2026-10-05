import { NextRequest, NextResponse } from "next/server";
import { createArkLead, getConversation } from "@/lib/ark-db";
import { deliverProjectBrief } from "@/lib/brief-mailer";
import {
  clearBriefEmailed,
  markBriefEmailed,
  wasBriefEmailed,
} from "@/lib/email-dedupe";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  isDeliverableBrief,
  sanitizeBrief,
} from "@/lib/validation";

const COOKIE = "ark_session";
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  const limit = rateLimit(
    clientKey(request, "ark-leads"),
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );

  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `Too many requests. Try again in ${limit.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  try {
    const body = await request.json();

    const conversationId =
      typeof body.conversationId === "string"
        ? body.conversationId
        : "";

    const { brief, invalid } = sanitizeBrief(body.brief);
    const session = request.cookies.get(COOKIE)?.value;

    if (!conversationId || !session) {
      return NextResponse.json(
        { error: "Conversation session is required." },
        { status: 401 },
      );
    }

    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Invalid field: ${invalid.join(", ")}.` },
        { status: 400 },
      );
    }

    if (!isDeliverableBrief(brief)) {
      return NextResponse.json(
        { error: "A valid project description and email are required." },
        { status: 400 },
      );
    }

    const conversation = await getConversation(
      conversationId,
      session,
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation unavailable." },
        { status: 404 },
      );
    }

    if (!conversation.ready) {
      return NextResponse.json(
        { error: "Complete the project brief before submitting." },
        { status: 400 },
      );
    }

    const lead = await createArkLead(conversationId, session, brief);

    if (!lead) {
      return NextResponse.json(
        { error: "Unable to save project lead." },
        { status: 500 },
      );
    }

    /*
     * Email the inbox on the first submit, and on any resubmit where a
     * previous delivery did NOT succeed.
     *
     * Gating purely on `lead.created` (an earlier attempt here) silently
     * dropped every brief after the first: createArkLead is idempotent, so a
     * resubmit returns created=false and no mail was ever sent - yet the
     * client still received 200. It also meant a first send that failed could
     * never be retried, losing the lead permanently.
     */
    const alreadyEmailed = wasBriefEmailed(conversationId);

    if (lead.created || !alreadyEmailed) {
      const result = await deliverProjectBrief(
        brief,
        "the ARKIINZTRIBE ARK agent",
      );

      if (result.error) {
        // Allow the visitor to retry the delivery.
        clearBriefEmailed(conversationId);

        return NextResponse.json(
          { error: "Project brief saved, but email delivery failed." },
          { status: 502 },
        );
      }

      if (result.delivered) {
        markBriefEmailed(conversationId);
      }
    }

    return NextResponse.json({
      lead,
      message: "PROJECT BRIEF RECEIVED.",
    });
  } catch (error) {
    console.error("ARK_LEAD_ERROR", error);

    return NextResponse.json(
      { error: "Unable to submit project brief." },
      { status: 500 },
    );
  }
}
