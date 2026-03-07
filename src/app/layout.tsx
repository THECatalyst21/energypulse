import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EnergyPulse - Energy Issues Blog",
  description: "Your trusted source for renewable energy news, policy updates, market analysis, and sustainability insights.",
  keywords: ["Energy", "Renewable", "Solar", "Wind", "Sustainability", "Policy", "Market Analysis"],
  authors: [{ name: "EnergyPulse Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "EnergyPulse - Energy Issues Blog",
    description: "Stay informed on energy issues. Your trusted source for renewable energy news and insights.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnergyPulse - Energy Issues Blog",
    description: "Stay informed on energy issues",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
