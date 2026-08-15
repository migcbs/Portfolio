import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Ajustes del sitio</h1>
      <SettingsForm
        defaultValues={{
          portfolioBrand: settings?.portfolioBrand ?? "",
          agencyBrand: settings?.agencyBrand ?? "",
          heroTitle: settings?.heroTitle ?? "",
          heroDescription: settings?.heroDescription ?? "",
          heroVideoUrl: settings?.heroVideoUrl ?? "",
          heroImageUrl: settings?.heroImageUrl ?? "",
          aboutText: settings?.aboutText ?? "",
          aboutImageUrl: settings?.aboutImageUrl ?? "",
          contactEmail: settings?.contactEmail ?? "",
          agencyTagline: settings?.agencyTagline ?? "",
          agencyServices: (settings?.agencyServices ?? []).join(", "),
        }}
      />
    </div>
  );
}
