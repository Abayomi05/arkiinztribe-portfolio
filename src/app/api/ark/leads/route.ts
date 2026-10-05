import { NextRequest, NextResponse } from "next/server";
import {
  createArkLead,
  getConversation,
  markLeadEmailed,
} from "@/lib/ark-db";
import { deliverProjectBrief } from "@/lib/brief-mailer";
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
     * Email unless this lead already has an accepted delivery on record.
     *
     * `emailed_at` is persisted (not in-memory) because /api/ark/messages
     * normally emails first, and this route may run on a different
     * serverless instance. Gating on `lead.created` alone was wrong twice
     * over: it re-sent nothing when messages had already delivered, but
     * also could never retry a delivery that had failed.
     */
    if (!lead.emailed_at) {
      const result = await deliverProjectBrief(
        brief,
        "the ARKIINZTRIBE ARK agent",
      );

      if (result.error) {
        return NextResponse.json(
          { error: "Project brief saved, but email delivery failed." },
          { status: 502 },
        );
      }

      if (result.unconfigured) {
        /*
         * The lead is stored, but nothing was emailed. Returning 200 here
         * would tell the visitor their brief reached ARKIINZTRIBE when no
         * mail was ever sent, so surface it instead of silently succeeding.
         */
        return NextResponse.json(
          {
            lead,
            delivered: false,
            message:
              "PROJECT BRIEF SAVED, BUT NOT EMAILED - the server is missing its email configuration.",
          },
          { status: 503 },
        );
      }

      if (result.delivered) {
        await markLeadEmailed(conversationId);
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
