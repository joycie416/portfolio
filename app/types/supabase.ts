import type { Tables, TablesInsert, TablesUpdate } from "./database.types";

// 쉽게 사용할 수 있도록 db 타입 정의

type OmitDefaultColumns<T, ExcludeId extends boolean = false> = Omit<
  T,
  ExcludeId extends true
    ? "id" | "created_at" | "modified_at"
    : "created_at" | "modified_at"
>;
type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Menu = Tables<"menus">;
export type MenuInsertType = OmitDefaultColumns<
  RequiredFields<
    TablesInsert<"menus">,
    "name" | "parent_id" | "order_idx" | "hidden"
  >,
  true
>;
export type MenuUpdateType = OmitDefaultColumns<
  RequiredFields<TablesUpdate<"menus">, "id">
>;

export type Post = Tables<"posts">;
export type PostInsertType = OmitDefaultColumns<
  RequiredFields<
    TablesInsert<"posts">,
    "title" | "content" | "menu_id" | "hidden" | "tags" | "title_image"
  >,
  true
>;
export type PostUpdateType = OmitDefaultColumns<
  RequiredFields<TablesUpdate<"posts">, "id">
>;
export type TransformedPost = Post & {
  menu_full_name: string;
};

export type Comment = Tables<"comments">;
export type CommentInsertType = OmitDefaultColumns<
  RequiredFields<
    TablesInsert<"comments">,
    "content" | "post_id" | "nickname" | "password"
  >,
  true
>;
export type CommentUpdateType = OmitDefaultColumns<
  RequiredFields<TablesUpdate<"comments">, "id">
>;
