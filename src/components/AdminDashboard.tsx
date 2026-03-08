"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PenTool,
  LogIn,
  LogOut,
  User,
  Settings,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  LayoutDashboard,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";

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
  author: { id: string; name: string; email: string; avatar: string | null; role: string };
  category: { id: string; name: string; color: string } | null;
  tags: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface AdminDashboardProps {
  categories: Category[];
  onPostChange: () => void;
}

export default function AdminDashboard({ categories, onPostChange }: AdminDashboardProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState("write");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", excerpt: "", content: "", categoryId: "", coverImage: "",
    published: true, featured: false,
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Secret admin access: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') setLoginDialogOpen(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (session && adminDialogOpen) fetchPosts();
  }, [session, adminDialogOpen]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?all=true");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Invalid credentials");
    } else {
      toast.success("Logged in!");
      setLoginDialogOpen(false);
      setAdminDialogOpen(true);
    }
  };

  const handleLogout = () => {
    signOut();
    toast.success("Logged out");
  };

  const generateImage = async () => {
    if (!formData.title) { toast.error("Enter a title first"); return; }
    setGeneratingImage(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Energy blog cover: ${formData.title}` }),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, coverImage: data.url });
        toast.success("Image generated!");
      }
    } catch { toast.error("Failed"); }
    finally { setGeneratingImage(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) { toast.error("Title and content required"); return; }
    try {
      const method = editingPost ? "PUT" : "POST";
      const body = editingPost ? { id: editingPost.id, ...formData } : { ...formData, authorId: session?.user?.id || "default-author" };
      const res = await fetch("/api/posts", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { toast.success(editingPost ? "Updated!" : "Published!"); resetForm(); fetchPosts(); onPostChange(); }
    } catch { toast.error("Failed"); }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({ title: post.title, excerpt: post.excerpt || "", content: post.content, categoryId: post.category?.id || "", coverImage: post.coverImage || "", published: post.published, featured: post.featured });
    setActiveTab("write");
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      const res = await fetch(`/api/posts?id=${postToDelete.id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchPosts(); onPostChange(); }
    } catch { toast.error("Failed"); }
    finally { setDeleteDialogOpen(false); setPostToDelete(null); }
  };

  const togglePublished = async (post: Post) => {
    try {
      const res = await fetch("/api/posts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: post.id, published: !post.published }) });
      if (res.ok) { fetchPosts(); onPostChange(); }
    } catch { toast.error("Failed"); }
  };

  const toggleFeatured = async (post: Post) => {
    try {
      const res = await fetch("/api/posts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: post.id, featured: !post.featured }) });
      if (res.ok) { fetchPosts(); onPostChange(); }
    } catch { toast.error("Failed"); }
  };

  const resetForm = () => {
    setFormData({ title: "", excerpt: "", content: "", categoryId: "", coverImage: "", published: true, featured: false });
    setEditingPost(null);
  };

  if (!session) {
    return (
      <>
        <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5 text-emerald-600" />Admin Login</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div><Label>Email</Label><Input type="email" placeholder="thecatalyst@energypulse.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required /></div>
              <div><Label>Password</Label><Input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required /></div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Sign In</Button>
            </form>
          </DialogContent>
        </Dialog>
        {/* Hidden admin button - hover in top right to see */}
        <Button onClick={() => setLoginDialogOpen(true)} variant="ghost" size="icon" className="opacity-0 hover:opacity-30 transition-opacity w-6 h-6" title="Admin">
          <Settings className="h-3 w-3" />
        </Button>
      </>
    );
  }

  return (
    <>
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Admin Login</DialogTitle></DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div><Label>Email</Label><Input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required /></div>
            <div><Label>Password</Label><Input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required /></div>
            <Button type="submit" className="w-full bg-emerald-600">Sign In</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">{session.user?.name}</span><ChevronDown className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel><div className="flex flex-col"><span>{session.user?.name}</span><span className="text-xs text-gray-500">{session.user?.email}</span></div></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAdminDialogOpen(true)}><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { resetForm(); setActiveTab("write"); setAdminDialogOpen(true); }}><PenTool className="h-4 w-4 mr-2" />Write Post</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="h-4 w-4 mr-2" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0"><DialogTitle className="flex items-center gap-2"><LayoutDashboard className="h-6 w-6 text-emerald-600" />Admin Dashboard</DialogTitle></DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-4"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="write" className="gap-2"><PenTool className="h-4 w-4" />{editingPost ? "Edit" : "Write"}</TabsTrigger><TabsTrigger value="manage" className="gap-2"><FileText className="h-4 w-4" />Manage</TabsTrigger></TabsList></div>
            <TabsContent value="write" className="m-0"><ScrollArea className="h-[60vh]"><form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4"><div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                <div><Label>Excerpt</Label><Input value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} /></div>
                <div><Label>Content *</Label><Textarea rows={15} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="font-mono" /></div>
              </div>
              <div className="space-y-4">
                <div><Label>Category</Label><select className="w-full px-3 py-2 border rounded-md bg-background" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}><option value="">Select</option>{categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</select></div>
                <div><Label>Cover Image</Label>{formData.coverImage && <div className="relative group"><img src={formData.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg" /><Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => setFormData({ ...formData, coverImage: "" })}><X className="h-4 w-4" /></Button></div>}<div className="flex gap-2"><Input value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} /><Button type="button" variant="outline" onClick={generateImage} disabled={generatingImage}>{generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}</Button></div></div>
                <Separator />
                <div className="flex items-center justify-between"><Label>Published</Label><Switch checked={formData.published} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} /></div>
                <div className="flex items-center justify-between"><Label>Featured</Label><Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} /></div>
                <Separator />
                <div className="flex gap-2"><Button type="submit" className="flex-1 bg-emerald-600" disabled={!formData.title || !formData.content}>{editingPost ? "Update" : "Publish"}</Button>{editingPost && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}</div>
              </div>
            </div></form></ScrollArea></TabsContent>
            <TabsContent value="manage" className="m-0"><ScrollArea className="h-[60vh]"><div className="p-6 pt-4">{loading ? <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" /></div> : posts.length === 0 ? <div className="text-center py-8"><FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No posts yet</p></div> : <div className="space-y-3">{posts.map((post) => (<Card key={post.id}><CardContent className="p-4"><div className="flex items-start justify-between gap-4"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h4 className="font-semibold truncate">{post.title}</h4>{post.published && <Badge className="text-xs text-green-600">Published</Badge>}{post.featured && <Badge className="text-xs text-amber-600">Featured</Badge>}</div><div className="text-sm text-gray-500">{post.category?.name} • {post.viewCount} views</div></div><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => toggleFeatured(post)}>{post.featured ? <StarOff className="h-4 w-4 text-amber-500" /> : <Star className="h-4 w-4" />}</Button><Button variant="ghost" size="sm" onClick={() => togglePublished(post)}>{post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-green-600" />}</Button><Button variant="ghost" size="sm" onClick={() => handleEdit(post)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setPostToDelete(post); setDeleteDialogOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button></div></div></CardContent></Card>))}</div>}</div></ScrollArea></TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Post?</AlertDialogTitle><AlertDialogDescription>This will delete "{postToDelete?.title}"</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </>
  );
}
