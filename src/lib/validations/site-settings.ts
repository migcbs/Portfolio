import { z } from "zod";
import { optionalUrl, optionalText } from "./shared";

export const siteSettingsSchema = z.object({
  portfolioBrand: z.string().trim().min(1, "Requerido"),
  agencyBrand: z.string().trim().min(1, "Requerido"),
  heroTitle: z.string().trim().min(1, "Requerido"),
  heroDescription: z.string().trim().min(1, "Requerido"),
  heroVideoUrl: optionalUrl,
  heroImageUrl: optionalUrl,
  aboutText: optionalText,
  aboutImageUrl: optionalUrl,
  contactEmail: optionalText,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
