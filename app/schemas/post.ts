import { z } from "zod";

export const postFilterSchema = z.object({
  query: z.string(),
  menuId: z.string(),
  visibility: z.enum(["all", "public", "private"]),
});

export type PostFilterForm = z.infer<typeof postFilterSchema>;
