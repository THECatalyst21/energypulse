import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/affiliates - Get affiliate links
export async function GET() {
  try {
    const links = await db.affiliateLink.findMany({
      where: { active: true },
      orderBy: { clicks: "desc" },
    });

    const totalRevenue = links.reduce((sum, link) => sum + link.revenue, 0);
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

    return NextResponse.json({ 
      links, 
      stats: { totalRevenue, totalClicks, totalLinks: links.length } 
    });
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json({ links: [], stats: { totalRevenue: 0, totalClicks: 0, totalLinks: 0 } });
  }
}

// POST /api/affiliates - Track click
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Link ID required" }, { status: 400 });
    }

    const link = await db.affiliateLink.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true, url: link.url });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json({ success: false });
  }
}

// PUT /api/affiliates - Create affiliate link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, description, category } = body;

    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL required" }, { status: 400 });
    }

    const link = await db.affiliateLink.create({
      data: { name, url, description, category },
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate link:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
