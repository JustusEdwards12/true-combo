import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl().replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: `${SITE_NAME} | Smash Ultimate Guides and Matchup Strategy`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  keywords: [
    "Smash Ultimate guides",
    "Smash Ultimate character guides",
    "Smash Ultimate matchup strategy",
    "beginner Smash Ultimate improvement",
    "competitive Smash mechanics",
  ],
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    title: `${SITE_NAME} | Smash Ultimate Guides and Matchup Strategy`,
    description: SITE_TAGLINE,
    url: `${siteUrl}/`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Smash Ultimate Guides and Matchup Strategy`,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
