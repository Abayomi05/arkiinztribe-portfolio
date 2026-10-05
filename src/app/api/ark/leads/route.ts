import { NextRequest, NextResponse } from "next/server";
import { createArkLead, getConversation } from "@/lib/ark-db";
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
     * Only email the inbox when this conversation creates a NEW lead.
     * Previously the email fired on every submit, so a client retry (or a
     * double-click on the transmit button) emailed the same brief twice.
     */
    if (lead.created) {
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
