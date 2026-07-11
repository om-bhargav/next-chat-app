import {z} from "zod";
export const messageSchema = z.object({
  content: z
    .string()
    .transform((value) => value.trim() || undefined)
    .nullable(),
});