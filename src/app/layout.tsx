import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { NotificationSystem } from "@/components/notifications/notification-system";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "EventHive - Interactive Event Discovery & Chat Platform",
    template: "%s | EventHive",
  },
  description:
    "Map-based event discovery meets community chat - Connecting India through events and conversations",
  keywords: ["events", "community", "chat", "India", "discovery", "maps"],
  authors: [{ name: "EventHive Team", url: "https://eventhive.com" }],
  creator: "EventHive Team",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://eventhive.com",
    title: "EventHive - Interactive Event Discovery & Chat Platform",
    description:
      "Discover events on an interactive map, chat with communities, and connect with India",
    siteName: "EventHive",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EventHive - Connect through events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventHive - Interactive Event Discovery & Chat Platform",
    description: "Map-based event discovery meets community chat",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#007AFF" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="relative min-h-screen">{children}</div>
          <NotificationSystem />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
