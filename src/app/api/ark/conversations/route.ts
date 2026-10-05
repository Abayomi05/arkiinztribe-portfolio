import { NextRequest, NextResponse } from "next/server";
import {
  createConversation,
  getConversation,
  getMessages,
  hasDatabase,
} from "@/lib/ark-db";
import { createInitialMessage } from "@/lib/ark-engine";

const COOKIE = "ark_session";

function sessionId(request: NextRequest) {
  return request.cookies.get(COOKIE)?.value ?? crypto.randomUUID();
}

function attachSession(response: NextResponse, session: string) {
  response.cookies.set(COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const session = sessionId(request);

    /*
     * Both backends create a conversation, so the old hasDatabase
     * special case is no longer needed.
     */
    const conversation = await createConversation(session);

    if (!conversation) {
      return NextResponse.json(
        { error: "Unable to create conversation." },
        { status: 503 },
      );
    }

    return attachSession(
      NextResponse.json({
        conversation: {
          id: conversation.id,
          sessionId: conversation.session_id,
          brief: conversation.brief,
          ready: conversation.ready,
          messages: [createInitialMessage()],
        },
        storage: hasDatabase ? "NEON" : "LOCAL SESSION",
      }),
      session,
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to initialize conversation." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const session = request.cookies.get(COOKIE)?.value;

    if (!id || !session) {
      return NextResponse.json(
        { error: "Conversation unavailable." },
        { status: 404 },
      );
    }

    const conversation = await getConversation(id, session);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation unavailable." },
        { status: 404 },
      );
    }

    const messages = await getMessages(id);

    return NextResponse.json({
      conversation,
      messages,
      storage: hasDatabase ? "NEON" : "LOCAL SESSION",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load conversation." },
      { status: 500 },
    );
  }
}
