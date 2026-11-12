import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";

/* Next.js 16 routes handlers are typed as `(request, context)`, while
 * `toNextJsHandler` returns a `(request)`-shaped handler. Cast to the
 * Next 16 shape so the generated types and runtime stay in sync. */
const authHandler = toNextJsHandler(auth.handler);

export const GET = authHandler.GET as (
  request: NextRequest,
  context: { params: Promise<{ auth: string[] }> }
) => Promise<Response>;

export const POST = GET;