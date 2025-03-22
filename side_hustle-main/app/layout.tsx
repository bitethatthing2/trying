import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import NavMenu from "@/components/NavMenu";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "The Side Hustle Bar",
  description: "Get notified about the latest side hustle opportunities",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/only_these/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/only_these/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/only_these/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/only_these/ms-icon-310x310.png", sizes: "310x310", type: "image/png" },
    ],
    apple: [
      { url: "/only_these/ios/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/only_these/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/only_these/apple-icon-precomposed.png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Side Hustle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load environment variables before any other scripts */}
        <Script src="/env-config.js" strategy="beforeInteractive" />
        {/* Load tracking fix script early */}
        <Script src="/tracking-fix.js" strategy="beforeInteractive" />
        {/* Load Android notification icon helper */}
        <Script src="/notification-icon.js" strategy="afterInteractive" />
        {/* Load Elfsight Widget */}
        <Script 
          src="https://static.elfsight.com/platform/platform.js" 
          data-use-service-core 
          strategy="lazyOnload" 
          crossOrigin="anonymous"
          nonce="elfsight-nonce"
        />
        {/* Preconnect to external domains to improve performance */}
        <link rel="preconnect" href="https://static.elfsight.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://scontent.cdninstagram.com" crossOrigin="anonymous" />
        {/* Add referrer policy to enable third-party content loading */}
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body className={`${inter.className} bg-black min-h-screen`}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="h-12 w-auto">
              <Image
                src="/only_these/logos/logo.png"
                alt="Side Hustle Bar Logo"
                width={48}
                height={48}
                className="h-full w-auto"
                priority
                unoptimized
              />
            </div>
            <NavMenu />
          </div>
        </header>
        
        <main className="pt-16">
          <Toaster />
          {children}
        </main>
      </body>
    </html>
  );
}
