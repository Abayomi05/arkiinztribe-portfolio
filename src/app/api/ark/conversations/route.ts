import { NextRequest, NextResponse } from "next/server";
import {
  createConversation,
  getConversation,
  getMessages,
  hasDatabase,
} from "@/lib/ark-db";
import { createInitialMessage } from "@/lib/ark-engine";

const COOKIE = "ark_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Whether the session cookie may carry the `Secure` attribute.
 *
 * This used to be `process.env.NODE_ENV === "production"`, which is wrong:
 * NODE_ENV describes the build, not how the browser reached the server. Any
 * production-mode server reached over plain HTTP - `next start` locally, a
 * LAN address, or an http:// preview - has its cookie silently rejected by
 * the browser, so every subsequent ARK call fails 401 and the conversation
 * becomes unusable.
 *
 * Decide from the actual request instead. `x-forwarded-proto` is checked
 * first because a TLS-terminating proxy (Vercel, nginx, Cloudflare) presents
 * http to the app while the browser is on https.
 *
 * `ARK_SECURE_COOKIES` forces the value when the proxy headers are
 * unavailable; it accepts true/false.
 */
function isSecureRequest(request: NextRequest): boolean {
  const override = process.env.ARK_SECURE_COOKIES?.trim().toLowerCase();

  if (override === "true") return true;
  if (override === "false") return false;

  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  if (forwardedProto) return forwardedProto === "https";

  return request.nextUrl.protocol === "https:";
}

function sessionId(request: NextRequest) {
  return request.cookies.get(COOKIE)?.value ?? crypto.randomUUID();
}

function attachSession(
  response: NextResponse,
  session: string,
  request: NextRequest,
) {
  response.cookies.set(COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(request),
    maxAge: COOKIE_MAX_AGE,
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
      request,
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
