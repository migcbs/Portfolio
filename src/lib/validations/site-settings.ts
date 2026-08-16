import { z } from "zod";
import { optionalUrl, optionalText } from "./shared";

export const generalSettingsSchema = z.object({
  portfolioBrand: z.string().trim().min(1, "Requerido"),
  agencyBrand: z.string().trim().min(1, "Requerido"),
  logoUrl: optionalUrl,
  backgroundUrl: optionalUrl,
  contactEmail: optionalText,
});

export const heroSettingsSchema = z.object({
  heroTitle: z.string().trim().min(1, "Requerido"),
  heroDescription: z.string().trim().min(1, "Requerido"),
  heroVideoUrl: optionalUrl,
  heroImageUrl: optionalUrl,
});

export const aboutSettingsSchema = z.object({
  aboutText: optionalText,
  aboutImageUrl: optionalUrl,
});

export const atenuSettingsSchema = z.object({
  agencyTagline: z.string().trim().min(1, "Requerido"),
  agencyServices: z.array(z.string()).default([]),
  atenuIntro: z.string().trim().min(1, "Requerido"),
  atenuCustomText: z.string().trim().min(1, "Requerido"),
});

export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;
export type HeroSettingsInput = z.infer<typeof heroSettingsSchema>;
export type AboutSettingsInput = z.infer<typeof aboutSettingsSchema>;
export type AtenuSettingsInput = z.infer<typeof atenuSettingsSchema>;
