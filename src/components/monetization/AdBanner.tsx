"use client";

import { useEffect } from "react";

interface AdBannerProps {
  type?: "horizontal" | "vertical" | "square";
  className?: string;
  slot?: string;
}

// Your AdSense Publisher ID
const PUBLISHER_ID = "ca-pub-4177020989263386";

// Default ad slots (create these in your AdSense dashboard)
const AD_SLOTS = {
  horizontal: "1234567890", // Replace with your horizontal ad slot
  vertical: "0987654321",   // Replace with your vertical ad slot
  square: "1122334455",     // Replace with your square ad slot
};

export default function AdBanner({
  type = "horizontal",
  className = "",
  slot,
}: AdBannerProps) {
  const adSlot = slot || AD_SLOTS[type];

  useEffect(() => {
    try {
      // Push ad to AdSense
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  const sizes = {
    horizontal: { minHeight: "90px", className: "w-full" },
    vertical: { minHeight: "250px", className: "w-full max-w-[300px]" },
    square: { minHeight: "250px", className: "w-[250px]" },
  };

  return (
    <div className={`ad-container ${className}`}>
      {/* Ad Label */}
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 text-center">
        Advertisement
      </p>
      
      {/* AdSense Ad Unit */}
      <ins
        className={`adsbygoogle ${sizes[type].className}`}
        style={{ display: "block", minHeight: sizes[type].minHeight }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// In-article ad component
export function InArticleAd({ className = "" }: { className?: string }) {
  useEffect(() => {
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`my-8 ${className}`}>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2 text-center">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot="1234567890" // Replace with your in-article slot
        data-ad-format="fluid"
        data-ad-layout="in-article"
      />
    </div>
  );
}

// Sidebar ad component
export function SidebarAd({ className = "" }: { className?: string }) {
  useEffect(() => {
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-2 ${className}`}>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2 text-center">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "300px", height: "250px" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot="0987654321" // Replace with your sidebar slot
        data-ad-format="rectangle"
      />
    </div>
  );
}

// Multiplex ad (shows multiple ads)
export function MultiplexAd({ className = "" }: { className?: string }) {
  useEffect(() => {
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={className}>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2 text-center">
        Sponsored
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="autorelaxed"
        data-ad-client={PUBLISHER_ID}
        data-ad-slot="5566778899" // Replace with your multiplex slot
      />
    </div>
  );
}
