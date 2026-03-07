import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/SessionProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/seo/StructuredData";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://energypulse.vercel.app"),
  title: {
    default: "EnergyPulse - Energy Issues Blog | Renewable Energy News & Analysis",
    template: "%s | EnergyPulse"
  },
  description: "Your trusted source for renewable energy news, policy updates, market analysis, and sustainability insights. Stay informed on energy issues.",
  keywords: ["Energy", "Renewable Energy", "Solar", "Wind", "EV", "Sustainability", "Policy", "Market Analysis", "Oil & Gas", "Carbon", "Net Zero", "Green Energy"],
  authors: [{ name: "EnergyPulse Team" }],
  creator: "EnergyPulse",
  publisher: "EnergyPulse",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://energypulse.vercel.app",
    siteName: "EnergyPulse",
    title: "EnergyPulse - Energy Issues Blog",
    description: "Stay informed on energy issues. Your trusted source for renewable energy news and insights.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EnergyPulse" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EnergyPulse - Energy Issues Blog",
    description: "Stay informed on energy issues",
    images: ["/og-image.png"],
  },
  verification: { google: "your-google-verification-code" },
  alternates: { canonical: "https://energypulse.vercel.app" },
  icons: { icon: "/logo.svg", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4177020989263386" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <WebsiteStructuredData />
          <OrganizationStructuredData />
          <GoogleAnalytics />
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
