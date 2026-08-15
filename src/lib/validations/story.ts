import { z } from "zod";

export const storySchema = z.object({
  clientId: z.string().trim().min(1, "Selecciona un cliente"),
  category: z.enum(["PHOTO", "VIDEO", "MERCH"]),
  type: z.enum(["IMAGE", "VIDEO"]),
  mediaUrl: z.string().trim().url("Debe ser una URL válida"),
  order: z.coerce.number().int().default(0),
  active: z.boolean(),
});

export type StoryInput = z.infer<typeof storySchema>;
