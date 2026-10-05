import { NextRequest, NextResponse } from "next/server";
import {
  addMessage,
  createArkLead,
  getConversation,
  updateConversation,
} from "@/lib/ark-db";
import { deliverProjectBrief } from "@/lib/brief-mailer";
import { respondToMessage } from "@/lib/ark-engine";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  isDeliverableBrief,
  sanitizeBrief,
} from "@/lib/validation";

const MAX_MESSAGE = 2000;
const COOKIE = "ark_session";
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  const limit = rateLimit(
    clientKey(request, "ark-messages"),
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );

  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `ARK is receiving too many messages. Try again in ${limit.retryAfterSeconds} seconds.`,
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

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!content || content.length > MAX_MESSAGE) {
      return NextResponse.json(
        {
          error: `Message must be between 1 and ${MAX_MESSAGE} characters.`,
        },
        { status: 400 },
      );
    }

    const session = request.cookies.get(COOKIE)?.value;

    if (!conversationId || !session) {
      return NextResponse.json(
        { error: "Conversation session is required." },
        { status: 401 },
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

    const result = respondToMessage(
      content,
      sanitizeBrief(conversation.brief).brief,
    );

    await addMessage(
      conversationId,
      "visitor",
      content,
    );

    await updateConversation(
      conversationId,
      session,
      result.brief,
      result.ready,
    );

    let finalMessage = result.message;

    if (result.ready) {
      const { brief, invalid } = sanitizeBrief(result.brief);

      if (invalid.length > 0 || !isDeliverableBrief(brief)) {
        return NextResponse.json(
          { error: "A valid project description and email are required." },
          { status: 400 },
        );
      }

      const lead = await createArkLead(conversationId, session, brief);

      if (!lead) {
        return NextResponse.json(
          { error: "The project brief could not be saved." },
          { status: 500 },
        );
      }

      /*
       * Only send the inbox email when this conversation creates a new lead.
       * This prevents duplicate emails if the request is retried.
       */
      if (lead.created) {
        const delivery = await deliverProjectBrief(
          brief,
          "the ARKIINZTRIBE ARK agent",
        );

        if (delivery.error) {
          return NextResponse.json(
            {
              error:
                "Project brief was saved, but inbox delivery failed.",
            },
            { status: 502 },
          );
        }
      }

      finalMessage = {
        role: "ark",
        content:
          "PROJECT BRIEF RECEIVED. Your project details have been captured and sent to the ARKIINZTRIBE project inbox. We'll be in touch.",
      };
    }

    await addMessage(
      conversationId,
      "ark",
      finalMessage.content,
    );

    return NextResponse.json({
      message: finalMessage,
      brief: result.brief,
      ready: result.ready,
    });
  } catch (error) {
    console.error("ARK_MESSAGE_ERROR", error);

    return NextResponse.json(
      { error: "Unable to process message." },
      { status: 500 },
    );
  }
}
