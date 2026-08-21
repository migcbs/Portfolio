"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations/lead";
import { sendLeadNotification } from "@/lib/resend";
import { getSiteSettings } from "@/lib/site-settings";

export type ContactFormState =
  | { errors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    projectType: formData.get("projectType"),
    marketingFocus: formData.get("marketingFocus"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const lead = await prisma.lead.create({ data: parsed.data });

  const settings = await getSiteSettings();
  const toEmail = settings?.contactEmail || process.env.ADMIN_EMAIL || "";
  await sendLeadNotification(lead, toEmail);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}
