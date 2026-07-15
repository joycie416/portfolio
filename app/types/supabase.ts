import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database.types";

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

/*
 key: TiptapEditor에서 부여한 고유 key (본문의 data-inline-key와 매핑됨)
 */
export type PostFile = {
  inlineImages: Record<string, File>;
  attachments: Record<string, File>;
};

// 임시 게시글 타입
export type TempPost = Tables<"temp_posts">;
export type TempPostInsertType = OmitDefaultColumns<TablesInsert<"temp_posts">>;

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

//-------------- 에러 타입 ----------------
export type PostBulkFailure =
  Database["public"]["Functions"]["posts_bulk_delete"]["Returns"][number];
