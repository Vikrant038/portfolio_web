import type { Metadata, Viewport } from "next";
import "./globals.css";
import SettingsProvider, { themeBootScript } from "@/lib/settings";
import SmoothScrollProvider from "@/components/providers/SmoothScroll";
import Clarity from "@/components/providers/Clarity";
import VitalsReporter from "@/components/providers/VitalsReporter";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import PageTransition from "@/components/ui/PageTransition";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import SectionStepper from "@/components/ui/SectionStepper";
import CommandPalette from "@/components/ui/CommandPalette";
import ConsentBanner from "@/components/ui/ConsentBanner";
import SiteChrome from "@/components/ui/SiteChrome";
import { Toaster } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

const siteUrl = SITE_CONFIG.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vikrant Yadav - AI Systems Engineer & Data Specialist",
    template: "%s · Vikrant Yadav",
  },
  description:
    "Portfolio of Vikrant Yadav - AI Systems Engineer and IIT Madras BS (Data Science) candidate building RAG pipelines, multi-agent automation, and data systems that ship.",
  keywords: [
    "portfolio",
    "AI engineer",
    "data scientist",
    "RAG",
    "LLM",
    "data engineering",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Vikrant Yadav",
    title: "Vikrant Yadav - AI Systems Engineer & Data Specialist",
    description:
      "AI automation, RAG pipelines, and data systems that turn manual workflows into measurable outcomes.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Vikrant Yadav" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vikrant Yadav - AI Systems Engineer",
    description:
      "AI automation, RAG pipelines, and data systems that turn manual workflows into measurable outcomes.",
    images: ["/og.svg"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090B13" },
    { media: "(prefers-color-scheme: light)", color: "#F6F4EE" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-void"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Space+Grotesk:wght@300..700&display=swap"
        />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://scripts.clarity.ms" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="bg-void text-paper">
        <SettingsProvider>
          <SmoothScrollProvider>
            <Clarity />
            <VitalsReporter />
            <CustomCursor />
            <Preloader />
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <ScrollProgress />
            <Navbar />
            <SectionStepper />
            <PageTransition>{children}</PageTransition>
            <Footer />
            <BackToTop />
            <SiteChrome />
            <ConsentBanner />
            <CommandPalette />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgb(var(--surface))",
                  color: "rgb(var(--paper))",
                  border: "1px solid rgb(var(--line) / 0.12)",
                  borderRadius: "1rem",
                  backdropFilter: "blur(12px)",
                },
              }}
              theme="system"
            />
          </SmoothScrollProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
