import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Initialize ZAI
    const zai = await ZAI.create();

    // Generate image
    const response = await zai.images.generations.create({
      prompt: `${prompt}, professional photography, high quality, detailed`,
      size: "1344x768", // Landscape for blog headers
    });

    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, "base64");

    // Generate unique filename
    const filename = `cover_${Date.now()}.png`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save image
    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
