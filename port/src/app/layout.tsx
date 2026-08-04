import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Playfair_Display } from "next/font/google";
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

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxe-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ariadne Voss — Product Engineer & Creative Technologist",
    template: "%s · Ariadne Voss",
  },
  description:
    "Luxury portfolio of Ariadne Voss — product engineer, creative technologist and 3D web artist crafting glassmorphic, cinematic digital experiences.",
  keywords: [
    "portfolio",
    "product engineer",
    "creative technologist",
    "webgl",
    "three.js",
    "design systems",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ariadne Voss",
    title: "Ariadne Voss — Product Engineer & Creative Technologist",
    description:
      "Cinematic digital products where engineering precision meets creative craft.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Ariadne Voss" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ariadne Voss — Product Engineer",
    description:
      "Cinematic digital products where engineering precision meets creative craft.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} bg-void`}
      suppressHydrationWarning
    >
      <head>
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
