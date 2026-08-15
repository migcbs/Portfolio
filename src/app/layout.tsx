import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Miguel Ceballos — Portafolio",
  description: "Desarrollo web y soluciones digitales — ATENU BrandHouse",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const portfolioBrand = settings?.portfolioBrand ?? "Miguel Ceballos — Portafolio";
  const agencyBrand = settings?.agencyBrand ?? "ATENU BrandHouse";

  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen flex flex-col`}>
        <Navbar brand={portfolioBrand} logoUrl={settings?.logoUrl ?? null} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer agencyBrand={agencyBrand} />
      </body>
    </html>
  );
}
