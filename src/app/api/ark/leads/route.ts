import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createArkLead, getConversation } from "@/lib/ark-db";
import type { ProjectBrief } from "@/lib/ark-engine";

const COOKIE = "ark_session";
function getResend() { const key = process.env.RESEND_API_KEY; return key ? new Resend(key) : null; }

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

    const resend = getResend();

    if (resend && process.env.PROJECT_BRIEF_TO_EMAIL) {
      const briefEmail = brief.email?.trim() || "Not provided";

      const { error } = await resend.emails.send({
        from: process.env.PROJECT_BRIEF_FROM_EMAIL || "ARKIINZTRIBE <onboarding@resend.dev>",
        to: [process.env.PROJECT_BRIEF_TO_EMAIL],
        replyTo: briefEmail,
        subject: `NEW ARKIINZTRIBE PROJECT BRIEF — ${brief.project.trim()}`,
        html: `
          <h2>NEW PROJECT BRIEF</h2>
          <p><strong>Project:</strong> ${brief.project?.trim() || "Not provided"}</p>
          <p><strong>Problem:</strong> ${brief.problem?.trim() || "Not provided"}</p>
          <p><strong>Goals:</strong> ${brief.goals?.trim() || "Not provided"}</p>
          <p><strong>Timeline:</strong> ${brief.timeline?.trim() || "Not provided"}</p>
          <p><strong>Budget:</strong> ${brief.budget?.trim() || "Not provided"}</p>
          <p><strong>Client email:</strong> ${briefEmail}</p>
          <hr />
          <p>Submitted through the ARKIINZTRIBE ARK project system.</p>
        `,
      });

      if (error) {
        console.error("Project brief email failed:", error);
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
  } catch {
    return NextResponse.json(
      { error: "Unable to submit project brief." },
      { status: 500 },
    );
  }
}
