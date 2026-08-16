import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";

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

export const metadata: Metadata = {
  title: "Miguel Ceballos — Portafolio",
  description: "Desarrollo web y soluciones digitales — ATENU BrandHouse",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const portfolioBrand = settings?.portfolioBrand ?? "Miguel Ceballos — Portafolio";
  const agencyBrand = settings?.agencyBrand ?? "ATENU BrandHouse";

  return (
    <html lang="es" className={`${bebasNeue.variable} ${spaceMono.variable} ${barlowCondensed.variable}`}>
      <body className="font-mono bg-black text-white antialiased min-h-screen flex flex-col">
        <CustomCursor />
        <Navbar brand={portfolioBrand} logoUrl={settings?.logoUrl ?? null} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer agencyBrand={agencyBrand} />
      </body>
    </html>
  );
}
