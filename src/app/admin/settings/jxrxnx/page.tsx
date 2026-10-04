import { getSiteSettings } from "@/lib/site-settings";
import { JxrxnxForm } from "./jxrxnx-form";

export default async function AdminJxrxnxSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <JxrxnxForm
      defaultValues={{
        agencyTagline: settings?.agencyTagline ?? "",
        jxrxnxIntro: settings?.jxrxnxIntro ?? "",
        jxrxnxCustomText: settings?.jxrxnxCustomText ?? "",
      }}
    />
  );
}
