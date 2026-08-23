import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  addMessage,
  createArkLead,
  getConversation,
  updateConversation,
} from "@/lib/ark-db";
import {
  respondToMessage,
  type ProjectBrief,
} from "@/lib/ark-engine";

const MAX_MESSAGE = 2000;
const COOKIE = "ark_session";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

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
      (conversation.brief ?? {}) as ProjectBrief,
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
      const email = result.brief.email?.trim() || "";
      const project = result.brief.project?.trim() || "";

      if (!validEmail(email) || !project) {
        return NextResponse.json(
          {
            error:
              "A valid project description and email are required.",
          },
          { status: 400 },
        );
      }

      const lead = await createArkLead(
        conversationId,
        session,
        {
          ...result.brief,
          email,
          project,
        },
      );

      if (!lead) {
        return NextResponse.json(
          {
            error:
              "The project brief could not be saved.",
          },
          { status: 500 },
        );
      }

      /*
       * Only send the inbox email when this conversation
       * creates a new lead. This prevents duplicate emails
       * if the request is retried.
       */
      if (lead.created) {
        const resend = getResend();

        if (
          resend &&
          process.env.PROJECT_BRIEF_TO_EMAIL
        ) {
          const { error } =
            await resend.emails.send({
              from:
                process.env.PROJECT_BRIEF_FROM_EMAIL ||
                "ARKIINZTRIBE <onboarding@resend.dev>",
              to: [
                process.env.PROJECT_BRIEF_TO_EMAIL,
              ],
              replyTo: email,
              subject:
                `NEW ARKIINZTRIBE PROJECT BRIEF — ${project}`,
              html: `
                <h2>NEW ARKIINZTRIBE PROJECT BRIEF</h2>

                <p>
                  <strong>Project:</strong>
                  ${project}
                </p>

                <p>
                  <strong>Problem:</strong>
                  ${result.brief.problem?.trim() || "Not provided"}
                </p>

                <p>
                  <strong>Goals:</strong>
                  ${result.brief.goals?.trim() || "Not provided"}
                </p>

                <p>
                  <strong>Timeline:</strong>
                  ${result.brief.timeline?.trim() || "Not provided"}
                </p>

                <p>
                  <strong>Budget:</strong>
                  ${result.brief.budget?.trim() || "Not provided"}
                </p>

                <p>
                  <strong>Client email:</strong>
                  ${email}
                </p>

                <hr />

                <p>
                  Submitted automatically through
                  the ARKIINZTRIBE ARK project system.
                </p>
              `,
            });

          if (error) {
            console.error(
              "PROJECT_BRIEF_RESEND_ERROR",
              JSON.stringify(error, null, 2),
            );

            return NextResponse.json(
              {
                error:
                  "Project brief was saved, but inbox delivery failed.",
              },
              { status: 502 },
            );
          }
        }
      }

      finalMessage = {
        role: "ark",
        content:
          "PROJECT BRIEF RECEIVED. Your project details have been captured and sent to the ARKIINZTRIBE project inbox. We’ll be in touch.",
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
