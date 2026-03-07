"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
    }
  }, [pathname, searchParams]);

  return null;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  if (process.env.NODE_ENV === "development") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
      <Suspense fallback={null}>
        <TrackPageView />
      </Suspense>
    </>
  );
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, { event_category: category, event_label: label, value });
  }
}

export const analytics = {
  adClick: (adType: string) => trackEvent("ad_click", "ads", adType),
  affiliateClick: (product: string) => trackEvent("affiliate_click", "affiliate", product),
  newsletterSignup: (source: string) => trackEvent("signup", "newsletter", source),
  postView: (title: string) => trackEvent("view", "post", title),
  postShare: (platform: string) => trackEvent("share", "social", platform),
  search: (query: string) => trackEvent("search", "engagement", query),
};
