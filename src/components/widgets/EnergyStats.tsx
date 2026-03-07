"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnergyStats() {
  const [stats, setStats] = useState([
    { label: "WTI Crude", value: "78.42", change: 2.34 },
    { label: "Brent", value: "82.15", change: -1.23 },
    { label: "Natural Gas", value: "2.89", change: 0.45 },
    { label: "Solar Index", value: "124.50", change: 3.67 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => prev.map((s) => ({ ...s, value: (parseFloat(s.value) + (Math.random() - 0.5) * 0.5).toFixed(2), change: parseFloat((Math.random() * 6 - 3).toFixed(2)) })));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live Energy Markets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <p className="text-xs text-gray-400">{s.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{s.value}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${s.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {s.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{s.change >= 0 ? "+" : ""}{s.change}%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-4 text-center">Updates every 30s • For informational purposes only</p>
      </CardContent>
    </Card>
  );
}
