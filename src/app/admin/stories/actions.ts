"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { storySchema } from "@/lib/validations/story";

export type StoryFormState = { errors?: Record<string, string[] | undefined> } | undefined;

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

export async function createStory(
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.story.create({ data: parsed.data });
  revalidatePath("/admin/stories");
  revalidatePath("/agencia");
  redirect("/admin/stories?success=created");
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
  revalidatePath("/admin/stories");
  revalidatePath("/agencia");
  redirect("/admin/stories?success=updated");
}

export async function deleteStory(id: string): Promise<void> {
  await requireAdmin();
  await prisma.story.delete({ where: { id } });
  revalidatePath("/admin/stories");
  revalidatePath("/agencia");
}
