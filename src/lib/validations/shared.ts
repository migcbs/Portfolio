import { z } from "zod";

export const optionalUrl = z
  .string()
  .trim()
  .url("Debe ser una URL válida")
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
