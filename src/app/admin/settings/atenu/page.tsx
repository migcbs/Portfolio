import { getSiteSettings } from "@/lib/site-settings";
import { AtenuForm } from "./atenu-form";

export default async function AdminAtenuSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AtenuForm
      defaultValues={{
        agencyTagline: settings?.agencyTagline ?? "",
        agencyServices: (settings?.agencyServices ?? []).join(", "),
        atenuIntro: settings?.atenuIntro ?? "",
        atenuCustomText: settings?.atenuCustomText ?? "",
      }}
    />
  );
}
