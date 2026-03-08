import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Return a placeholder image from Unsplash based on the prompt
    const keywords = prompt.toLowerCase().includes("solar") ? "solar,panels"
      : prompt.toLowerCase().includes("wind") ? "wind,turbine"
      : prompt.toLowerCase().includes("oil") ? "oil,industry"
      : prompt.toLowerCase().includes("electric") ? "electric,car"
      : "energy,renewable";

    const imageUrl = `https://source.unsplash.com/1344x768/?${encodeURIComponent(keywords)}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: "Using placeholder image from Unsplash",
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
