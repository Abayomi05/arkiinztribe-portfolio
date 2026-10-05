import { NextRequest, NextResponse } from "next/server";
import { getConversation, updateConversation } from "@/lib/ark-db";
import { isDeliverableBrief, sanitizeBrief } from "@/lib/validation";

const COOKIE = "ark_session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId : "";

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation is required." },
        { status: 400 },
      );
    }

    const session = request.cookies.get(COOKIE)?.value;

    if (!session) {
      return NextResponse.json(
        { error: "Conversation session is required." },
        { status: 401 },
      );
    }

    const conversation = await getConversation(conversationId, session);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation unavailable." },
        { status: 404 },
      );
    }

    /*
     * This endpoint previously flipped ready=true unconditionally, so an
     * empty brief could be marked complete. A brief is only "ready" once it
     * carries a valid email and a project description.
     */
    const { brief, invalid } = sanitizeBrief(body.brief);

    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Invalid field: ${invalid.join(", ")}.` },
        { status: 400 },
      );
    }

    const ready = isDeliverableBrief(brief);

    if (!ready) {
      return NextResponse.json(
        {
          error: "A valid project description and email are required.",
        },
        { status: 400 },
      );
    }

    const updated = await updateConversation(
      conversationId,
      session,
      brief,
      true,
    );

    return NextResponse.json({
      brief,
      ready: true,
      conversation: updated,
      message: "PROJECT BRIEF READY.",
    });
  } catch (error) {
    console.error("ARK_BRIEF_ERROR", error);

    return NextResponse.json(
      { error: "Unable to save project brief." },
      { status: 500 },
    );
  }
}
