import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";
import { BRAND_BYLINE, BRAND_NAME } from "@/lib/brand";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { CookieConsentBanner } from "@/components/layout/CookieConsent";

export const dynamic = "force-dynamic";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-accent",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: { default: BRAND_NAME, template: `%s · ${BRAND_NAME}` },
    description: settings?.heroDescription ?? `${BRAND_NAME} ${BRAND_BYLINE}. Desarrollo web y soluciones digitales.`,
    applicationName: BRAND_NAME,
    openGraph: { siteName: BRAND_NAME, title: BRAND_NAME },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="es" className={`${bebasNeue.variable} ${spaceMono.variable} ${barlowCondensed.variable}`}>
      <body className="font-mono bg-black text-white antialiased min-h-screen flex flex-col">
        <AmbientBackground backgroundUrl={settings?.backgroundUrl} />
        <CustomCursor />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
