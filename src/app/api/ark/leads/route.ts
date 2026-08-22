import { NextRequest, NextResponse } from "next/server";
import { createArkLead, getConversation } from "@/lib/ark-db";
import type { ProjectBrief } from "@/lib/ark-engine";

const COOKIE = "ark_session";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const conversationId =
      typeof body.conversationId === "string"
        ? body.conversationId
        : "";

    const brief = (body.brief ?? {}) as ProjectBrief;
    const session = request.cookies.get(COOKIE)?.value;

    if (!conversationId || !session) {
      return NextResponse.json(
        { error: "Conversation session is required." },
        { status: 401 },
      );
    }

    if (
      typeof brief.project !== "string" ||
      !brief.project.trim() ||
      typeof brief.email !== "string" ||
      !validEmail(brief.email.trim())
    ) {
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

    const lead = await createArkLead(
      conversationId,
      session,
      {
        ...brief,
        email: brief.email.trim(),
        project: brief.project.trim(),
      },
    );

    if (!lead) {
      return NextResponse.json(
        { error: "Unable to save project lead." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      lead,
      message: "PROJECT BRIEF RECEIVED.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit project brief." },
      { status: 500 },
    );
  }
}
