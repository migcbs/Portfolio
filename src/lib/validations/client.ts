import { z } from "zod";
import { optionalUrl, optionalText } from "./shared";

export const clientSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  description: optionalText,
  logoUrl: optionalUrl,
  website: optionalUrl,
  active: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type ClientInput = z.infer<typeof clientSchema>;
