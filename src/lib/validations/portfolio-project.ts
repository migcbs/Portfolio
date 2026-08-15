import { z } from "zod";
import { optionalUrl } from "./shared";

export const portfolioProjectSchema = z.object({
  title: z.string().trim().min(1, "El título es requerido"),
  description: z.string().trim().min(1, "La descripción es requerida"),
  imageUrl: optionalUrl,
  projectUrl: optionalUrl,
  tags: z.array(z.string()).default([]),
  active: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type PortfolioProjectInput = z.infer<typeof portfolioProjectSchema>;
