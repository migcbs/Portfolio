import { getSiteSettings } from "@/lib/site-settings";
import { AboutForm } from "./about-form";

export default async function AdminAboutSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AboutForm
      defaultValues={{
        aboutText: settings?.aboutText ?? "",
        aboutImageUrl: settings?.aboutImageUrl ?? "",
      }}
    />
  );
}
