import { z } from "zod";

export const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^(https?:\/\/|\/)/.test(v), {
    message: "Debe ser una URL válida (o una ruta que empiece con /, como /logo.png)",
  })
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const optionalText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => v ?? "");

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
