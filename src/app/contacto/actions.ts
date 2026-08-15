"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations/lead";

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
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.lead.create({ data: parsed.data });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}
