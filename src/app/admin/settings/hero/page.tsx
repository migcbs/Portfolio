import { getSiteSettings } from "@/lib/site-settings";
import { HeroForm } from "./hero-form";

export default async function AdminHeroSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <HeroForm
      defaultValues={{
        heroTitle: settings?.heroTitle ?? "",
        heroDescription: settings?.heroDescription ?? "",
        heroVideoUrl: settings?.heroVideoUrl ?? "",
        heroImageUrl: settings?.heroImageUrl ?? "",
      }}
    />
  );
}
