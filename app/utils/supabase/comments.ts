import { PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/extended-database.types";
import type {
  CommentInsertType,
  CommentWithSlug,
  PublicComment,
} from "@/types/supabase";

export interface GetCommentListWithSlugParams {
  query?: string;
  perPage?: number;
  page?: number;
}

// 비밀번호는 제외하고 조회
const LIST_COLUMNS =
  "id, post_id, nickname, content, created_at, modified_at" as const;
const LIST_WITH_SLUG_COLUMNS =
  `${LIST_COLUMNS}, posts!inner(id, title, menus!inner(slug))` as const;

type CommentRowWithPost = PublicComment & {
  posts: {
    id: number;
    title: string;
    menus: { slug: string };
  };
};

export const comments = (client: SupabaseClient<Database>) => {
  return {
    getList: async (postId: number) => {
      const { data, count, error } = await client
        .from("comments")
        .select(LIST_COLUMNS, { count: "exact" })
        .eq("post_id", postId)
        .order("created_at", { ascending: false });
      if (error) throw new PostgrestError(error);
      return { data: data ?? [], count: count ?? 0 };
    },
    create: async (comment: CommentInsertType) => {
      const { data, error } = await client.from("comments").insert(comment);
      if (error) throw new PostgrestError(error);
      return data;
    },
    // 관리자용: 비밀번호 없이 직접 삭제
    delete: async (commentId: number) => {
      const { error } = await client
        .from("comments")
        .delete()
        .eq("id", commentId);
      if (error) throw new PostgrestError(error);
      return commentId;
    },
    // 비로그인 사용자용: 비밀번호 검증만 수행 (수정/삭제 전 잠금 해제용)
    verifyPassword: async (id: number, password: string) => {
      const { data, error } = await client.rpc("comment_anon_verify_password", {
        p_id: id,
        p_password: password,
      });
      if (error) throw new PostgrestError(error);
      return data ?? false;
    },
    // 비로그인 사용자용: 비밀번호 재검증 후 수정 (DB에서 검증)
    updateWithPassword: async (
      id: number,
      password: string,
      content: string
    ) => {
      const { data, error } = await client.rpc("comment_anon_update", {
        p_id: id,
        p_password: password,
        p_content: content,
      });
      if (error) throw new PostgrestError(error);
      return data;
    },
    // 비로그인 사용자용: 비밀번호 재검증 후 삭제 (DB에서 검증)
    deleteWithPassword: async (id: number, password: string) => {
      const { data, error } = await client.rpc("comment_anon_delete", {
        p_id: id,
        p_password: password,
      });
      if (error) throw new PostgrestError(error);
      return data;
    },
    getListWithSlug: async ({
      query: q,
      perPage = 10,
      page = 1,
    }: GetCommentListWithSlugParams): Promise<{
      data: CommentWithSlug[];
      count: number;
    }> => {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      const keyword = q?.trim();

      let query = client.from("comments").select(LIST_WITH_SLUG_COLUMNS, {
        count: "exact",
      });

      if (keyword) query = query.ilike("content", `%${keyword}%`);

      const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw new PostgrestError(error);

      const rows = (data ?? []) as unknown as CommentRowWithPost[];

      return {
        data: rows.map(({ posts, ...comment }) => ({
          ...comment,
          post_title: posts.title,
          menu_slug: posts.menus.slug,
        })),
        count: count ?? 0,
      };
    },
  };
};
