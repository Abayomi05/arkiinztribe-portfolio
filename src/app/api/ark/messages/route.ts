import { NextRequest, NextResponse } from "next/server";
import {
  addMessage,
  getConversation,
  updateConversation,
} from "@/lib/ark-db";
import { respondToMessage, type ProjectBrief } from "@/lib/ark-engine";

const MAX_MESSAGE = 2000;
const COOKIE = "ark_session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId : "";
    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    if (!content || content.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Message must be between 1 and ${MAX_MESSAGE} characters.` },
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

    const conversation = await getConversation(conversationId, session);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation unavailable." },
        { status: 404 },
      );
    }

    const result = respondToMessage(
      content,
      (conversation.brief ?? {}) as ProjectBrief,
    );

    await addMessage(conversationId, "visitor", content);
    await addMessage(conversationId, "ark", result.message.content);
    await updateConversation(
      conversationId,
      session,
      result.brief,
      result.ready,
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Unable to process message." },
      { status: 500 },
    );
  }
}
