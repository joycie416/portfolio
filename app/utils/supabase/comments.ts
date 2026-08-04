import { PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { CommentInsertType, CommentUpdateType } from "@/types/supabase";

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
  };
};
