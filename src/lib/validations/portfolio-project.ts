import { z } from "zod";
import { optionalUrl, optionalText } from "./shared";

export const PROJECT_CATEGORIES = ["WEB_DEV", "DIGITAL_MARKETING", "PHOTO", "VIDEO", "GRAPHIC_DESIGN"] as const;
export const PROJECT_STATUSES = ["PLANNING", "IN_PROGRESS", "COMPLETED"] as const;

export const portfolioProjectSchema = z.object({
  title: z.string().trim().min(1, "El título es requerido"),
  description: z.string().trim().min(1, "La descripción es requerida"),
  imageUrl: optionalUrl,
  projectUrl: optionalUrl,
  tags: z.array(z.string()).default([]),
  category: z.enum(PROJECT_CATEGORIES),
  status: z.enum(PROJECT_STATUSES),
  progress: z.coerce.number().int().min(0).max(100).default(100),
  devTime: optionalText,
  internalNotes: optionalText,
  active: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type PortfolioProjectInput = z.infer<typeof portfolioProjectSchema>;
