import { z } from "zod";

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "La etiqueta es requerida"),
  url: z.string().trim().url("Debe ser una URL válida"),
  scope: z.enum(["PERSONAL", "AGENCY"]),
  clientId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  order: z.coerce.number().int().default(0),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
