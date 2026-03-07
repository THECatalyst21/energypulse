"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import {
  Zap,
  Leaf,
  TrendingUp,
  Shield,
  Search,
  Clock,
  Eye,
  Tag,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Dynamic imports for client-side only components
const AdminDashboard = dynamic(() => import("@/components/AdminDashboard"), { ssr: false });
const SocialShare = dynamic(() => import("@/components/SocialShare"), { ssr: false });

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  readTime: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
  tags: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
  _count?: { posts: number };
}

const defaultCategories: Category[] = [
  { id: "1", name: "Renewable Energy", slug: "renewable-energy", description: "Solar, wind, hydro and more", color: "#10B981", icon: "sun" },
  { id: "2", name: "Oil & Gas", slug: "oil-gas", description: "Fossil fuel industry updates", color: "#F59E0B", icon: "droplet" },
  { id: "3", name: "Policy & Regulation", slug: "policy-regulation", description: "Government policies and laws", color: "#6366F1", icon: "scale" },
  { id: "4", name: "Sustainability", slug: "sustainability", description: "Environmental initiatives", color: "#22C55E", icon: "leaf" },
  { id: "5", name: "Technology", slug: "technology", description: "Energy tech innovations", color: "#3B82F6", icon: "cpu" },
  { id: "6", name: "Market Analysis", slug: "market-analysis", description: "Market trends and forecasts", color: "#EC4899", icon: "trending-up" },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const url = selectedCategory
        ? `/api/posts?categoryId=${selectedCategory}`
        : "/api/posts";
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }
    try {
      const res = await fetch(`/api/posts?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to search posts:", error);
    }
  };

  const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);
  const regularPosts = posts.filter((p) => !p.featured);
  const recentPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "renewable energy":
        return <Zap className="h-5 w-5" />;
      case "oil & gas":
        return <TrendingUp className="h-5 w-5" />;
      case "policy & regulation":
        return <Shield className="h-5 w-5" />;
      case "sustainability":
        return <Leaf className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const PostDetailDialog = () => {
    if (!selectedPost) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPostDialogOpen(false)}>
        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedPost.coverImage && (
            <div className="aspect-video relative overflow-hidden">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center gap-2 mb-3">
              {selectedPost.category && (
                <Badge style={{ backgroundColor: selectedPost.category.color }} className="text-white">
                  {selectedPost.category.name}
                </Badge>
              )}
              <span className="text-sm text-gray-500">
                {format(new Date(selectedPost.createdAt), "MMMM d, yyyy")}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
            
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={selectedPost.author.avatar || ""} />
                <AvatarFallback>{selectedPost.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedPost.author.name}</p>
                <p className="text-sm text-gray-500">{selectedPost.readTime} min read • {selectedPost.viewCount} views</p>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="prose dark:prose-invert max-w-none">
              {selectedPost.content.split("\n").map((paragraph, idx) => {
                if (paragraph.startsWith("## ")) {
                  return <h3 key={idx} className="text-lg font-semibold mt-6 mb-3">{paragraph.replace("## ", "")}</h3>;
                }
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return <p key={idx} className="font-semibold mt-4">{paragraph.replace(/\*\*/g, "")}</p>;
                }
                if (paragraph.startsWith("- ")) {
                  return <li key={idx} className="ml-4">{paragraph.replace("- ", "")}</li>;
                }
                if (paragraph.trim()) {
                  return <p key={idx} className="mb-3">{paragraph}</p>;
                }
                return null;
              })}
            </div>

            {selectedPost.tags.length > 0 && (
              <div className="flex gap-2 mt-6 flex-wrap">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-6" />
            
            <div className="flex items-center justify-between">
              <SocialShare
                url={`/post/${selectedPost.slug}`}
                title={selectedPost.title}
                excerpt={selectedPost.excerpt || ""}
              />
              <Button variant="outline" onClick={() => setPostDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  EnergyPulse
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">Powering Knowledge</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => {}} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                Home
              </button>
              <button onClick={() => document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" })} className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
                Articles
              </button>
              <button onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })} className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
                Categories
              </button>
              <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
                About
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <AdminDashboard categories={categories} onPostChange={fetchPosts} />
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-emerald-100 dark:border-gray-800">
            <nav className="flex flex-col p-4 gap-2">
              <button className="px-4 py-2 rounded-lg text-emerald-600 bg-emerald-50 text-left">Home</button>
              <button onClick={() => { document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left">Articles</button>
              <button onClick={() => { document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left">Categories</button>
              <button onClick={() => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left">About</button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-500/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200">
              <Leaf className="h-3 w-3 mr-1" />
              Sustainable Energy News
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Stay Informed on{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Energy Issues
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Your trusted source for renewable energy news, policy updates, market analysis, 
              and sustainability insights. Join the conversation shaping our energy future.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 h-12 bg-white dark:bg-gray-800 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Search
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                  <p className="text-sm text-gray-500">Articles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                  <p className="text-sm text-gray-500">Categories</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {posts.reduce((sum, p) => sum + p.viewCount, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Views</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              All Posts
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                  selectedCategory === category.id
                    ? "ring-2 ring-emerald-500 shadow-lg"
                    : ""
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <span style={{ color: category.color }}>{getCategoryIcon(category.name)}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category._count?.posts || 0} posts</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Featured
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editor's Picks</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => { setSelectedPost(post); setPostDialogOpen(true); }}
                >
                  {post.coverImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        {post.category && (
                          <Badge
                            style={{ backgroundColor: post.category.color }}
                            className="text-white mb-2"
                          >
                            {post.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt || post.content.slice(0, 120) + "..."}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author.avatar || ""} />
                        <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="articles" className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles Grid */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {selectedCategory
                  ? `${categories.find((c) => c.id === selectedCategory)?.name || "Articles"}`
                  : "Latest Articles"}
              </h2>
              
              {loading ? (
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : regularPosts.length === 0 && featuredPosts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No articles yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Be the first to share energy insights!
                    </p>
                  </CardContent>
                </Card>
              ) : regularPosts.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <p className="text-gray-500">
                      No more articles in this category. Check the featured posts above!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {regularPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => { setSelectedPost(post); setPostDialogOpen(true); }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {post.coverImage && (
                          <div className="sm:w-48 md:w-64 flex-shrink-0">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-48 sm:h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-6">
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <Badge
                                variant="outline"
                                style={{ borderColor: post.category.color, color: post.category.color }}
                              >
                                {post.category.name}
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">
                              {format(new Date(post.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                            {post.excerpt || post.content.slice(0, 150) + "..."}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={post.author.avatar || ""} />
                                <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {post.author.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {post.readTime} min read
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.viewCount}
                              </span>
                            </div>
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag.id} variant="secondary" className="text-xs">
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80">
              <div className="sticky top-24 space-y-6">
                {/* Recent Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      Recent Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentPosts.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No recent posts</p>
                    ) : (
                      recentPosts.map((post, index) => (
                        <div key={post.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div 
                            className="flex gap-3 cursor-pointer hover:opacity-80"
                            onClick={() => { setSelectedPost(post); setPostDialogOpen(true); }}
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2 hover:text-emerald-600">
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(post.createdAt), "MMM d")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Tags Cloud */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="h-5 w-5 text-emerald-600" />
                      Popular Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["Solar", "Wind", "EV", "Net Zero", "Carbon", "Hydrogen", "Battery", "Grid"].map(
                        (tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 cursor-pointer"
                          >
                            {tag}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Stay Updated</CardTitle>
                    <CardDescription className="text-emerald-100">
                      Get weekly energy news in your inbox
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        placeholder="Your email"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      />
                      <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50">
                        Subscribe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              About EnergyPulse
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Your Source for Energy Intelligence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              EnergyPulse is dedicated to bringing you the latest insights on energy issues, 
              from renewable technologies to policy developments. Our mission is to inform 
              and inspire the transition to a sustainable energy future.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Latest News</h3>
                  <p className="text-sm text-gray-500">Breaking updates from the energy sector</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Market Analysis</h3>
                  <p className="text-sm text-gray-500">Expert insights on energy markets</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Policy Updates</h3>
                  <p className="text-sm text-gray-500">Regulatory changes and impacts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EnergyPulse</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted source for energy news, policy updates, and sustainability insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <button className="hover:text-emerald-400 transition-colors">{cat.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-emerald-400 transition-colors">About Us</button></li>
                <li><button className="hover:text-emerald-400 transition-colors">Contact</button></li>
                <li><button className="hover:text-emerald-400 transition-colors">Write for Us</button></li>
                <li><button className="hover:text-emerald-400 transition-colors">Advertise</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-emerald-400 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-emerald-400 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-emerald-400 transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2025 EnergyPulse. All rights reserved.</p>
            <p>Powered by sustainable energy knowledge</p>
          </div>
        </div>
      </footer>

      {/* Post Detail Dialog */}
      {postDialogOpen && <PostDetailDialog />}
    </div>
  );
}
