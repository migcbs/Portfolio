import { getSiteSettings } from "@/lib/site-settings";
import { GeneralForm } from "./general-form";

export default async function AdminGeneralSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <GeneralForm
      defaultValues={{
        portfolioBrand: settings?.portfolioBrand ?? "",
        agencyBrand: settings?.agencyBrand ?? "",
        logoUrl: settings?.logoUrl ?? "",
        backgroundUrl: settings?.backgroundUrl ?? "",
        contactEmail: settings?.contactEmail ?? "",
      }}
    />
  );
}
