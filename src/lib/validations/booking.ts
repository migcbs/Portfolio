import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().trim().min(1, "Tu nombre es requerido"),
  company: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  email: z.string().trim().email("Email inválido"),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  preferredContact: z.enum(["EMAIL", "PHONE", "WHATSAPP"]),
  message: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  source: z.string().trim().min(1),
  scheduledDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  scheduledTime: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export type BookingInput = z.infer<typeof bookingSchema>;
