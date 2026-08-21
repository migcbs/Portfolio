"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations/booking";
import { sendBookingNotification } from "@/lib/resend";
import { getSiteSettings } from "@/lib/site-settings";
import { getAvailableSlots, slotToUtcDate } from "@/lib/scheduling";

export type BookingFormState =
  | { errors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

export async function getAvailableSlotsAction(dateStr: string): Promise<string[]> {
  return getAvailableSlots(dateStr);
}

export async function submitBookingRequest(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const parsed = bookingSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredContact: formData.get("preferredContact"),
    message: formData.get("message"),
    source: formData.get("source"),
    scheduledDate: formData.get("scheduledDate"),
    scheduledTime: formData.get("scheduledTime"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { scheduledDate, scheduledTime, ...bookingFields } = parsed.data;

  let scheduledAt: Date | null = null;
  if (scheduledDate && scheduledTime) {
    const freeSlots = await getAvailableSlots(scheduledDate);
    if (freeSlots.includes(scheduledTime)) {
      scheduledAt = slotToUtcDate(scheduledDate, scheduledTime);
    }
  }

  const booking = await prisma.bookingRequest.create({ data: { ...bookingFields, scheduledAt } });

  const settings = await getSiteSettings();
  const toEmail = settings?.contactEmail || process.env.ADMIN_EMAIL || "";
  await sendBookingNotification(booking, toEmail);

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
  return { success: true };
}
