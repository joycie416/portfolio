import { z } from "zod";
import { POST_VISIBILITIES } from "@/utils/supabase/posts";

export const postFilterSchema = z.object({
  query: z.string(),
  menuId: z.string(),
  visibility: z.enum(POST_VISIBILITIES),
});

export type PostFilterForm = z.infer<typeof postFilterSchema>;
