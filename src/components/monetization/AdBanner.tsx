"use client";

import { useState } from "react";

interface AdBannerProps {
  type?: "horizontal" | "vertical" | "square";
  className?: string;
  publisherId?: string;
  slotId?: string;
}

export default function AdBanner({
  type = "horizontal",
  className = "",
  publisherId = "ca-pub-YOUR_PUBLISHER_ID",
  slotId = "YOUR_SLOT_ID",
}: AdBannerProps) {
  const [adBlocked, setAdBlocked] = useState(false);

  const sizes = {
    horizontal: "h-24 md:h-28",
    vertical: "h-64 md:h-80",
    square: "h-64 w-64",
  };

  // Note: Replace publisherId and slotId with your actual Google AdSense values
  // Get them from: https://www.google.com/adsense

  return (
    <div className={`relative ${className}`}>
      {adBlocked ? (
        <div className={`${sizes[type]} bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-emerald-200 dark:border-gray-600`}>
          <div className="text-center p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ad space available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Advertise with EnergyPulse
            </p>
          </div>
        </div>
      ) : (
        <div className={`${sizes[type]} bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600`}>
          {/* Google AdSense will replace this content */}
          {/* To enable ads:
              1. Go to https://www.google.com/adsense
              2. Add your site and get approved
              3. Create ad units and get your publisher ID and slot ID
              4. Replace the publisherId and slotId props above
          */}
          <div className="text-center p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Advertisement
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Your ad here
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              ads@energypulse.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// In-article ad component
export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl p-6 border border-emerald-100 dark:border-gray-600">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
            Sponsored
          </p>
          <div className="h-20 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                📢 Advertise your energy products here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Reach thousands of energy professionals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar ad component
export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide text-center">
        Advertisement
      </p>
      <div className="h-64 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🌱 Go Green
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Partner with us
          </p>
        </div>
      </div>
    </div>
  );
}
