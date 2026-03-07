import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/categories - Fetch all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, icon } = body;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        color: color || "#10B981",
        icon,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

// Seed default categories if none exist
export async function PUT() {
  try {
    const existingCategories = await db.category.count();
    
    if (existingCategories === 0) {
      const defaultCategories = [
        { name: "Renewable Energy", slug: "renewable-energy", description: "Solar, wind, hydro and more", color: "#10B981", icon: "sun" },
        { name: "Oil & Gas", slug: "oil-gas", description: "Fossil fuel industry updates", color: "#F59E0B", icon: "droplet" },
        { name: "Policy & Regulation", slug: "policy-regulation", description: "Government policies and laws", color: "#6366F1", icon: "scale" },
        { name: "Sustainability", slug: "sustainability", description: "Environmental initiatives", color: "#22C55E", icon: "leaf" },
        { name: "Technology", slug: "technology", description: "Energy tech innovations", color: "#3B82F6", icon: "cpu" },
        { name: "Market Analysis", slug: "market-analysis", description: "Market trends and forecasts", color: "#EC4899", icon: "trending-up" },
      ];

      await db.category.createMany({ data: defaultCategories });
      return NextResponse.json({ message: "Default categories seeded", count: defaultCategories.length });
    }

    return NextResponse.json({ message: "Categories already exist" });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return NextResponse.json({ error: "Failed to seed categories" }, { status: 500 });
  }
}
