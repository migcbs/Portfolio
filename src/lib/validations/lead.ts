import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Tu nombre es requerido"),
  email: z.string().trim().email("Email inválido"),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
});

export type LeadInput = z.infer<typeof leadSchema>;
