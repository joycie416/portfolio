import { z } from "zod";
import { POST_VISIBILITIES } from "@/utils/supabase/posts";

export const postFilterSchema = z.object({
  query: z.string(),
  menuId: z.string(),
  visibility: z.enum(POST_VISIBILITIES),
});

export type PostFilterForm = z.infer<typeof postFilterSchema>;

export const postSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요." }),
  menuId: z.string().min(1, { message: "메뉴를 선택해주세요." }),
  content: z.string().min(1, { message: "내용을 입력해주세요." }),
  hidden: z.boolean(),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
});

export type PostForm = z.infer<typeof postSchema>;
