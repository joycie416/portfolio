import type { PostVisibility } from "~/utils/supabase/posts";

export interface PostFilterForm {
  query: string;
  menuId: string;
  visibility: PostVisibility;
}
