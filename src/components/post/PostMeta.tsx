"use client";

import { Clock, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SocialShare from "@/components/SocialShare";
import { toast } from "sonner";
import { format } from "date-fns";

interface PostMetaProps {
  author: { name: string; avatar?: string | null };
  publishedAt: string;
  readTime: number;
  viewCount: number;
  category?: { name: string; color: string } | null;
  tags?: { id: string; name: string }[];
  title: string;
  slug: string;
  excerpt?: string | null;
}

export function PostMeta({
  author,
  publishedAt,
  readTime,
  viewCount,
  category,
  tags = [],
  title,
  slug,
  excerpt,
}: PostMetaProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-emerald-500">
            <AvatarImage src={author.avatar || ""} alt={author.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
              {author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(publishedAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{readTime} min</span>
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{viewCount} views</span>
        </div>
      </div>
      {category && <Badge style={{ backgroundColor: category.color }} className="text-white">{category.name}</Badge>}
      {tags.length > 0 && <div className="flex flex-wrap gap-2">{tags.map((tag) => <Badge key={tag.id} variant="outline">#{tag.name}</Badge>)}</div>}
      <Separator />
      <div className="flex items-center gap-2">
        <SocialShare url={`/post/${slug}`} title={title} excerpt={excerpt || ""} />
        <Button variant="outline" size="sm" onClick={handleCopyLink}>Copy Link</Button>
      </div>
    </div>
  );
}

export function TableOfContents({ content }: { content: string }) {
  const headings = content.split("\n").filter((line) => line.startsWith("## ")).map((line) => line.replace("## ", "").trim()).slice(0, 6);
  if (headings.length === 0) return null;
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
      <h3 className="font-semibold text-sm mb-3">📋 Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading, i) => <li key={i}><a href={`#${heading.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-600 hover:text-emerald-600">{i + 1}. {heading}</a></li>)}
      </ul>
    </div>
  );
}
