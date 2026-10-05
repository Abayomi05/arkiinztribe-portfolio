import { NextRequest, NextResponse } from "next/server";
import { deliverProjectBrief } from "@/lib/brief-mailer";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  isValidEmail,
  sanitizeBrief,
} from "@/lib/validation";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  const limit = rateLimit(
    clientKey(request, "project-brief"),
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );

  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `Too many briefs submitted. Try again in ${limit.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  try {
    const body = await request.json();
    const { brief, invalid } = sanitizeBrief(body);

    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Invalid field: ${invalid.join(", ")}.` },
        { status: 400 },
      );
    }

    const { email, project } = brief;

    if (!project) {
      return NextResponse.json(
        { error: "Project description is required." },
        { status: 400 },
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const result = await deliverProjectBrief(
      brief,
      "the ARKIINZTRIBE direct project brief form",
    );

    if (result.error) {
      return NextResponse.json(
        { error: "Project brief delivery failed." },
        { status: 502 },
      );
    }

    if (!result.delivered) {
      return NextResponse.json(
        { error: "Project brief transmission is not configured." },
        { status: 500 },
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
