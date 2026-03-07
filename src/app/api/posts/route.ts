import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/posts - Fetch all posts with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const slug = searchParams.get("slug");
    const all = searchParams.get("all");

    // If slug is provided, get single post
    if (slug) {
      const post = await db.post.findUnique({
        where: { slug },
        include: {
          author: true,
          category: true,
          tags: true,
          comments: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      // Increment view count
      await db.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });

      return NextResponse.json({ post });
    }

    // Build filter conditions
    const where: {
      published?: boolean;
      categoryId?: string;
      OR?: Array<{ title: { contains: string }; content: { contains: string } }>;
    } = {};

    // Only filter by published if not requesting all posts (for admin)
    if (all !== "true") {
      where.published = true;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const posts = await db.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, categoryId, authorId, coverImage, published, featured, tags } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Calculate read time (roughly 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Check if author exists, create if not
    let author = await db.author.findUnique({ where: { id: authorId } });
    if (!author) {
      author = await db.author.create({
        data: {
          id: authorId,
          name: "Default Author",
          email: "author@energypulse.com",
        },
      });
    }

    // Check if category exists
    let categoryConnect = null;
    if (categoryId) {
      const category = await db.category.findUnique({ where: { id: categoryId } });
      if (category) {
        categoryConnect = { connect: { id: categoryId } };
      }
    }

    // Create or find tags
    const tagConnections = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        let tag = await db.tag.findUnique({ where: { slug: tagSlug } });
        if (!tag) {
          tag = await db.tag.create({
            data: { name: tagName, slug: tagSlug },
          });
        }
        tagConnections.push({ id: tag.id });
      }
    }

    const post = await db.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published: published ?? true,
        featured: featured ?? false,
        readTime,
        authorId: author.id,
        categoryId: categoryConnect ? categoryId : null,
        tags: tagConnections.length > 0 ? { connect: tagConnections } : undefined,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// PUT /api/posts - Update a post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const post = await db.post.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE /api/posts - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    await db.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
