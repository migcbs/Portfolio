import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { AgendaManager } from "./agenda-manager";

export default async function AdminAgendaSettingsPage() {
  const [rules, settings] = await Promise.all([
    prisma.availability.findMany(),
    getSiteSettings(),
  ]);

  return <AgendaManager rules={rules} meetingDurationMinutes={settings?.meetingDurationMinutes ?? 30} />;
}
