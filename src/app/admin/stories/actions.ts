"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { storySchema } from "@/lib/validations/story";

export type StoryFormState = { errors?: Record<string, string[] | undefined>; success?: boolean } | undefined;

function parseForm(formData: FormData) {
  return storySchema.safeParse({
    clientId: formData.get("clientId"),
    category: formData.get("category"),
    type: formData.get("type"),
    mediaUrl: formData.get("mediaUrl"),
    order: formData.get("order"),
    active: formData.get("active") === "on",
  });
}

function revalidateAll() {
  revalidatePath("/admin/stories");
  revalidatePath("/portafolio");
}

export async function createStory(
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.story.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function updateStory(
  id: string,
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.story.update({ where: { id }, data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function deleteStory(id: string): Promise<void> {
  await requireAdmin();
  await prisma.story.delete({ where: { id } });
  revalidateAll();
}
