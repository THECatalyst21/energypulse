import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/subscribers - Get all subscribers (admin)
export async function GET() {
  try {
    const subscribers = await db.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: subscribers.length,
      active: subscribers.filter((s) => s.active).length,
      thisMonth: subscribers.filter(
        (s) => new Date(s.createdAt).getMonth() === new Date().getMonth()
      ).length,
    };

    return NextResponse.json({ subscribers, stats });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ subscribers: [], stats: { total: 0, active: 0, thisMonth: 0 } });
  }
}

// POST /api/subscribers - Subscribe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ message: "Already subscribed!" });
      } else {
        // Reactivate
        await db.subscriber.update({
          where: { email },
          data: { active: true, name: name || existing.name },
        });
        return NextResponse.json({ message: "Welcome back!" });
      }
    }

    const subscriber = await db.subscriber.create({
      data: {
        email,
        name,
        source: source || "organic",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Successfully subscribed!",
      subscriber 
    });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

// DELETE /api/subscribers - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await db.subscriber.update({
      where: { email },
      data: { active: false },
    });

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
