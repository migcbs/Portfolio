import { z } from "zod";

export const legalPageSchema = z.object({
  title: z.string().trim().min(1, "Requerido"),
  content: z.string().trim().min(1, "Requerido"),
});

export type LegalPageInput = z.infer<typeof legalPageSchema>;
