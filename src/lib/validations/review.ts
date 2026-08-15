import { z } from "zod";

export const reviewAdminSchema = z.object({
  authorName: z.string().trim().min(1, "El nombre es requerido"),
  text: z.string().trim().min(1, "El texto es requerido"),
  rating: z.coerce.number().int().min(1).max(5),
  approved: z.boolean(),
});

export const reviewPublicSchema = z.object({
  authorName: z.string().trim().min(1, "Tu nombre es requerido").max(100),
  text: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
  rating: z.coerce.number().int().min(1, "Selecciona una calificación").max(5),
});

export type ReviewAdminInput = z.infer<typeof reviewAdminSchema>;
export type ReviewPublicInput = z.infer<typeof reviewPublicSchema>;
