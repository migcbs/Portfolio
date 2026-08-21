"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema } from "@/lib/validations/password";

export type ChangePasswordState =
  | { errors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await requireAdmin();
  const email = session.user?.email;
  if (!email) return { errors: { currentPassword: ["No se pudo identificar la sesión"] } };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { errors: { currentPassword: ["Usuario no encontrado"] } };

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { errors: { currentPassword: ["Contraseña actual incorrecta"] } };

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
  });

  return { success: true };
}
