import type { Tables, TablesInsert, TablesUpdate } from "./database.types";
import type { Database } from "./extended-database.types";

// 쉽게 사용할 수 있도록 db 타입 정의

type OmitDefaultColumns<T, ExcludeId extends boolean = false> = Omit<
  T,
  ExcludeId extends true
    ? "id" | "created_at" | "modified_at"
    : "created_at" | "modified_at"
>;
type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Menu = Tables<"menus"> & { posts: { count: number }[] };
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
export type SimplePost = Omit<Post, "content" | "tags" | "modified_at">;
export type SimplePostWithMenuSlug = SimplePost & {
  menu_slug: string;
};
export type PostInsertType = OmitDefaultColumns<
  RequiredFields<
    TablesInsert<"posts">,
    "title" | "content" | "menu_id" | "hidden" | "tags" | "thumbnail"
  >,
  true
>;
// 게시글 수정 폼에서 사용하는 타입 (create와 동일하게 필수 필드를 강제하고, id도 함께 필요)
export type PostUpdateType = OmitDefaultColumns<
  RequiredFields<
    TablesUpdate<"posts">,
    "id" | "title" | "content" | "menu_id" | "hidden" | "tags" | "thumbnail"
  >
>;
export type TransformedPost = SimplePostWithMenuSlug & {
  menu_full_name: string;
};

/*
 key: TiptapEditor에서 부여한 고유 key (본문의 data-inline-key와 매핑됨)
 */
export type PostFile = {
  inlineImages: Record<string, File>;
  attachments: Record<string, File>;
};

// 게시글 수정 시 사용하는 파일 정보
// - inlineImages/attachments: 새로 추가된 파일만 담음 (기존 파일은 그대로 유지되므로 다시 전달할 필요 없음)
// - removedAttachmentKeys: 기존 첨부파일 중 사용자가 삭제한 파일의 key 목록 (스토리지에서도 함께 제거됨)
//   (기존 inline 이미지는 본문에서 삭제되면 자동으로 감지되어 정리되므로 별도로 전달하지 않음)
export type PostUpdateFile = PostFile & {
  removedAttachmentKeys: string[];
};

// create/update 성공 시 반환값 (본문은 업로드된 publicUrl로 치환된 최종값)
export type PostSaveResult = {
  id: number;
  content: string;
  thumbnail: string | null;
  /** 저장 후 스토리지에 남아 있는 첨부파일 목록 */
  attachments: PostStorageFile[];
};

// 스토리지에 저장된 게시글 파일(inline 이미지/첨부파일) 정보
export type PostStorageFile = {
  key: string;
  path: string;
  size?: number;
  url: string;
};

export type PostStorageFiles = {
  inlineImages: PostStorageFile[];
  attachments: PostStorageFile[];
};

// 임시 게시글 타입
export type TempPost = Tables<"temp_posts">;
// 임시 게시글 목록용 타입
export type SimpleTempPost = Pick<
  Tables<"temp_posts">,
  "id" | "title" | "created_at"
>;
export type TempPostInsertType = OmitDefaultColumns<
  TablesInsert<"temp_posts">,
  true
>;

// 이전/다음 게시글 타입
export type PostNeighbor = {
  id: number;
  title: string;
};
export type PostNeighbors = {
  prev: PostNeighbor | null;
  next: PostNeighbor | null;
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

//-------------- 에러 타입 ----------------
export type PostBulkFailure =
  Database["public"]["Functions"]["posts_bulk_delete"]["Returns"][number];
