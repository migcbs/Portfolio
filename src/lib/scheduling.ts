import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

// Mainland Mexico has used a fixed UTC-6 offset with no DST since 2022, so
// this can be a plain constant instead of needing a timezone library. Border
// municipalities that still observe DST are an accepted edge case.
export const MX_TIMEZONE = "America/Mexico_City";
const MX_OFFSET_HOURS = 6;

function wallTimeToUtc(dateStr: string, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h + MX_OFFSET_HOURS, m));
}

/** dateStr is "YYYY-MM-DD", the calendar date in America/Mexico_City. */
export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const [y, mo, d] = dateStr.split("-").map(Number);
  if (!y || !mo || !d) return [];

  const settings = await getSiteSettings();
  const duration = settings?.meetingDurationMinutes ?? 30;
  const dayOfWeek = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();

  const rules = await prisma.availability.findMany({ where: { dayOfWeek, active: true } });
  if (rules.length === 0) return [];

  const slots: string[] = [];
  for (const rule of rules) {
    const [sh, sm] = rule.startTime.split(":").map(Number);
    const [eh, em] = rule.endTime.split(":").map(Number);
    let cursor = sh * 60 + sm;
    const end = eh * 60 + em;
    while (cursor + duration <= end) {
      const hh = String(Math.floor(cursor / 60)).padStart(2, "0");
      const mm = String(cursor % 60).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      cursor += duration;
    }
  }

  const dayStart = wallTimeToUtc(dateStr, "00:00");
  const dayEnd = wallTimeToUtc(dateStr, "23:59");
  const booked = await prisma.bookingRequest.findMany({
    where: { scheduledAt: { gte: dayStart, lte: dayEnd } },
    select: { scheduledAt: true },
  });
  const bookedTimes = new Set(booked.map((b) => b.scheduledAt!.toISOString()));

  const now = new Date();
  return Array.from(new Set(slots))
    .sort()
    .filter((hhmm) => {
      const slotUtc = wallTimeToUtc(dateStr, hhmm);
      return slotUtc > now && !bookedTimes.has(slotUtc.toISOString());
    });
}

export function slotToUtcDate(dateStr: string, hhmm: string): Date {
  return wallTimeToUtc(dateStr, hhmm);
}
