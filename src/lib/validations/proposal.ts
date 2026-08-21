import { z } from "zod";
import { optionalText } from "./shared";

export const proposalSchema = z.object({
  clientName: z.string().trim().min(1, "Requerido"),
  clientEmail: z.string().trim().email("Email inválido"),
  title: z.string().trim().min(1, "Requerido"),
  description: optionalText,
  depositPercent: z.coerce.number().int().min(0).max(100).default(50),
  validUntil: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v) : null)),
});

export type ProposalInput = z.infer<typeof proposalSchema>;
