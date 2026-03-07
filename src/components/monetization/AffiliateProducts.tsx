"use client";

import { useState } from "react";
import { ExternalLink, ShoppingCart, Zap, Sun, Car, Battery, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Default affiliate products (demo)
const defaultProducts = [
  { id: "1", name: "Renogy 100W Solar Panel Kit", url: "https://amazon.com/dp/B009Z6CW7O?tag=energypulse-20", description: "Perfect starter kit for home solar projects.", category: "solar", price: "$119.99", rating: "4.7⭐" },
  { id: "2", name: "Tesla Model 3/Y Wall Connector", url: "https://shop.tesla.com/product/wall-connector", description: "Official Tesla home charging solution.", category: "ev", price: "$425", rating: "4.9⭐" },
  { id: "3", name: "EcoFlow Delta Pro Power Station", url: "https://ecoflow.com", description: "Massive 3.6kWh capacity for backup power.", category: "battery", price: "$3,699", rating: "4.8⭐" },
  { id: "4", name: "Clean Energy Investing Guide", url: "https://amazon.com?tag=energypulse-20", description: "Learn to invest in renewable energy.", category: "books", price: "$14.99", rating: "4.6⭐" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  solar: <Sun className="h-4 w-4" />, ev: <Car className="h-4 w-4" />, battery: <Battery className="h-4 w-4" />, books: <BookOpen className="h-4 w-4" />, default: <Zap className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  solar: "bg-amber-100 text-amber-700 border-amber-300",
  ev: "bg-blue-100 text-blue-700 border-blue-300",
  battery: "bg-emerald-100 text-emerald-700 border-emerald-300",
  books: "bg-purple-100 text-purple-700 border-purple-300",
};

interface AffiliateProductsProps { variant?: "grid" | "inline" | "sidebar"; category?: string; className?: string; }

export default function AffiliateProducts({ variant = "grid", category, className = "" }: AffiliateProductsProps) {
  const [products] = useState(defaultProducts);

  const handleClick = async (product: typeof defaultProducts[0]) => {
    toast.success("Opening product page...");
    window.open(product.url, "_blank", "noopener,noreferrer");
  };

  const filteredProducts = category ? products.filter((p) => p.category === category) : products;

  if (variant === "sidebar") {
    return (
      <Card className={className}>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShoppingCart className="h-4 w-4 text-emerald-600" />Recommended</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {filteredProducts.slice(0, 3).map((product) => (
            <button key={product.id} onClick={() => handleClick(product)} className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors group">
              <div className="flex items-start gap-2">
                <span className="text-lg">{categoryIcons[product.category || "default"]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 group-hover:text-emerald-600">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-emerald-600 font-medium">{product.price}</span>
                    <span className="text-xs text-gray-400">{product.rating}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          <p className="text-xs text-center text-gray-400 mt-2">Affiliate links • Small commission</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 my-8 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold">Recommended Products</h3>
          <Badge variant="outline" className="text-xs">Affiliate</Badge>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredProducts.slice(0, 2).map((product) => (
            <button key={product.id} onClick={() => handleClick(product)} className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all text-left group">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">{categoryIcons[product.category || "default"]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm group-hover:text-emerald-600 line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-500">{product.price} • {product.rating}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-emerald-600" />Recommended Energy Products</h2>
        <p className="text-xs text-gray-500">Affiliate links</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => handleClick(product)}>
            <CardContent className="p-4">
              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center mb-3">
                <span className="text-4xl opacity-60">{categoryIcons[product.category || "default"]}</span>
              </div>
              <Badge variant="outline" className={`mb-2 ${categoryColors[product.category || "default"]}`}>{product.category}</Badge>
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-600">{product.price}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">{product.rating}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
