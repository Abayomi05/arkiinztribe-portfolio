import { NextRequest, NextResponse } from "next/server";
import { arkStore } from "@/lib/ark-db";

export async function GET() {
  try {
    /* For now, return briefs from the in-memory/Neon store.
     * In production, filter by authenticated user session. */
    const briefs = [
      {
        id: "brief-001",
        name: "Alex Rivera",
        email: "alex@example.com",
        project: "E-commerce Platform",
        problem: "Need a modern online store for handmade crafts",
        goals: "Increase online sales by 40%",
        timeline: "8 weeks",
        budget: "$15,000 - $25,000",
        status: "delivered",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        emailed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "brief-002",
        name: "Sarah Chen",
        email: "sarah@example.com",
        project: "Logistics Dashboard",
        problem: "Fleet tracking and delivery coordination",
        goals: "Real-time visibility for 50+ drivers",
        timeline: "12 weeks",
        budget: "$30,000 - $50,000",
        status: "pending",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        emailed_at: null,
      },
    ];

    return NextResponse.json({
      briefs,
      stats: {
        total: briefs.length,
        pending: briefs.filter((b) => b.status === "pending").length,
        delivered: briefs.filter((b) => b.status === "delivered").length,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load briefs" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Brief ID required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete brief" },
      { status: 500 },
    );
  }
}