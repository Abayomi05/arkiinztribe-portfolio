import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_FIELD = 2000;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = clean(body.name);
    const email = clean(body.email);
    const project = clean(body.project);
    const problem = clean(body.problem);
    const goals = clean(body.goals);
    const timeline = clean(body.timeline);
    const budget = clean(body.budget);

    const fields = {
      name,
      email,
      project,
      problem,
      goals,
      timeline,
      budget,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value.length > MAX_FIELD) {
        return NextResponse.json(
          { error: `${key} is too long.` },
          { status: 400 },
        );
      }
    }

    if (!project) {
      return NextResponse.json(
        { error: "Project description is required." },
        { status: 400 },
      );
    }

    if (!email || !validEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const key = process.env.RESEND_API_KEY;
    const destination = process.env.PROJECT_BRIEF_TO_EMAIL;

    if (!key || !destination) {
      console.error("PROJECT_BRIEF_CONFIG_MISSING");

      return NextResponse.json(
        { error: "Project brief transmission is not configured." },
        { status: 500 },
      );
    }

    const resend = new Resend(key);

    const { error } = await resend.emails.send({
      from:
        process.env.PROJECT_BRIEF_FROM_EMAIL ||
        "ARKIINZTRIBE <onboarding@resend.dev>",
      to: [destination],
      replyTo: email,
      subject: `NEW ARKIINZTRIBE PROJECT BRIEF — ${project}`,
      text: [
        "NEW ARKIINZTRIBE PROJECT BRIEF",
        "",
        `Name: ${name || "Not provided"}`,
        `Email: ${email}`,
        "",
        `Project: ${project}`,
        "",
        `Problem / Need: ${problem || "Not provided"}`,
        "",
        `Goals: ${goals || "Not provided"}`,
        "",
        `Timeline: ${timeline || "Not provided"}`,
        "",
        `Budget: ${budget || "Not provided"}`,
        "",
        "Submitted through the ARKIINZTRIBE TRANSMIT PROJECT BRIEF system.",
      ].join("\n"),
    });

    if (error) {
      console.error(
        "PROJECT_BRIEF_DIRECT_RESEND_ERROR",
        JSON.stringify(error, null, 2),
      );

      return NextResponse.json(
        { error: "Project brief delivery failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "PROJECT BRIEF TRANSMITTED. DELIVERY CONFIRMED.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to transmit project brief." },
      { status: 500 },
    );
  }
}
