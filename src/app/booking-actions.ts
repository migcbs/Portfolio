"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations/booking";
import { sendBookingNotification } from "@/lib/resend";
import { getSiteSettings } from "@/lib/site-settings";

export type BookingFormState =
  | { errors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

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
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const booking = await prisma.bookingRequest.create({ data: parsed.data });

  const settings = await getSiteSettings();
  const toEmail = settings?.contactEmail || process.env.ADMIN_EMAIL || "";
  await sendBookingNotification(booking, toEmail);

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
  return { success: true };
}
