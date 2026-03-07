"use client";

import { useState } from "react";
import { Mail, Gift, CheckCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface NewsletterProps {
  source?: string;
  variant?: "inline" | "popup" | "sidebar";
  className?: string;
}

export default function Newsletter({ 
  source = "organic", 
  variant = "inline",
  className = "" 
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(variant === "popup");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source }),
      });

      const data = await res.json();

      if (data.success || data.message) {
        setSuccess(true);
        toast.success(data.message || "Successfully subscribed!");
        setEmail("");
        setName("");
      } else {
        toast.error("Failed to subscribe");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className={`bg-gradient-to-br from-emerald-500 to-teal-600 text-white ${className}`}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">You're In! 🎉</h3>
          <p className="text-emerald-100">
            Check your inbox for a welcome email with exclusive energy insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Popup variant
  if (variant === "popup" && showPopup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Get Exclusive Energy Insights</CardTitle>
            <CardDescription>
              Join 1,000+ energy professionals. Get weekly news, analysis, and opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe Free"}
              </Button>
            </form>
            <p className="text-xs text-center text-gray-500 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-emerald-600" />
            Stay Updated
          </CardTitle>
          <CardDescription>
            Weekly energy news in your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Inline variant (default)
  return (
    <Card className={`bg-gradient-to-br from-emerald-500 to-teal-600 text-white ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">
              📬 Get Weekly Energy Insights
            </h3>
            <p className="text-emerald-100 text-sm">
              Join 1,000+ professionals. Free newsletter with market analysis, 
              policy updates, and exclusive opportunities.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-w-[200px]"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-emerald-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

// Popup trigger component
export function NewsletterPopup({ className = "" }: { className?: string }) {
  return <Newsletter variant="popup" source="popup" className={className} />;
}
