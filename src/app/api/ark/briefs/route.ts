import { NextRequest, NextResponse } from "next/server";
import { getConversation, updateConversation } from "@/lib/ark-db";
import type { ProjectBrief } from "@/lib/ark-engine";

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

    const brief = (body.brief ?? {}) as ProjectBrief;

    const fields = ["project", "problem", "goals", "timeline", "email"] as const;

    for (const field of fields) {
      if (
        brief[field] !== undefined &&
        (typeof brief[field] !== "string" || brief[field].length > 1000)
      ) {
        return NextResponse.json(
          { error: `Invalid ${field}.` },
          { status: 400 },
        );
      }
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
  } catch {
    return NextResponse.json(
      { error: "Unable to save project brief." },
      { status: 500 },
    );
  }
}
