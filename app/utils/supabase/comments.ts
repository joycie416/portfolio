import { PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/extended-database.types";
import type {
  Comment,
  CommentInsertType,
  CommentUpdateType,
  CommentWithSlug,
} from "@/types/supabase";

export interface GetCommentListWithSlugParams {
  query?: string;
  perPage?: number;
  page?: number;
}

// 비밀번호는 제외하고 조회
const LIST_WITH_SLUG_COLUMNS =
  "id, post_id, nickname, content, created_at, modified_at, posts!inner(id, title, menus!inner(slug))" as const;

type CommentRowWithPost = Omit<Comment, "password"> & {
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
        .select("*", { count: "exact" })
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
    update: async (comment: CommentUpdateType) => {
      const { error } = await client
        .from("comments")
        .update(comment)
        .eq("id", comment.id);
      if (error) throw new PostgrestError(error);
      return comment.id;
    },
    delete: async (commentId: number) => {
      const { error } = await client
        .from("comments")
        .delete()
        .eq("id", commentId);
      if (error) throw new PostgrestError(error);
      return commentId;
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
