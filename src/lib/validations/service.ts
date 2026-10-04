import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  description: z.string().trim().min(1, "La descripción es requerida"),
  features: z.array(z.string()).default([]),
  active: z.boolean(),
  isFavorite: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
