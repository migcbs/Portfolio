import { z } from "zod";

export const leadSchema = z
  .object({
    name: z.string().trim().min(1, "Tu nombre es requerido"),
    email: z.string().trim().email("Email inválido"),
    message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
    projectType: z.enum(["WEB_DEV", "DIGITAL_MARKETING"], {
      message: "Selecciona el tipo de proyecto",
    }),
    marketingFocus: z.enum(["DESIGN", "PHOTO_VIDEO"]).optional().or(z.literal("")),
  })
  .transform((data) => ({
    ...data,
    marketingFocus: data.marketingFocus || null,
  }))
  .refine((data) => data.projectType !== "DIGITAL_MARKETING" || data.marketingFocus, {
    message: "Selecciona si es diseño o fotografía y video",
    path: ["marketingFocus"],
  });

export type LeadInput = z.infer<typeof leadSchema>;
