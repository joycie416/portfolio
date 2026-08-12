import type {
  Comment,
  CommentInsertType,
  CommentUpdateType,
  CommentWithSlug,
} from "@/types/supabase";
import {
  comments,
  type GetCommentListWithSlugParams,
} from "@/utils/supabase/comments";

export const useGetComments = ({
  postId,
  server,
  lazy,
}: {
  postId: number;
  server?: boolean;
  lazy?: boolean;
}) => {
  const supabase = useSupabaseClient();

  return useLazyAsyncData<{ data: Comment[]; count: number }>(
    () => `comments:${postId}`,
    () => comments(supabase).getList(postId),
    { default: () => ({ data: [], count: 0 }), server, lazy }
  );
};

export const useCreateComment = () => {
  const supabase = useSupabaseClient();

  const createComment = (formData: CommentInsertType) =>
    comments(supabase).create(formData);
  return { createComment };
};

export const useUpdateComment = () => {
  const supabase = useSupabaseClient();

  const updateComment = (formData: CommentUpdateType) =>
    comments(supabase).update(formData);
  return { updateComment };
};

export const useDeleteComment = () => {
  const supabase = useSupabaseClient();

  const deleteComment = (commentId: number) =>
    comments(supabase).delete(commentId);
  return { deleteComment };
};

/**
 * 블로그 홈/관리자 댓글 관리 사용
 */
export const useGetCommentsWithSlug = (
  params: GetCommentListWithSlugParams & { server?: boolean; lazy?: boolean }
) => {
  const supabase = useSupabaseClient();

  return useAsyncData<{ data: CommentWithSlug[]; count: number }>(
    () =>
      `comments:with-slug:${params.perPage || 10}:${params.page || 1}:${params.query || ""}`,
    () => comments(supabase).getListWithSlug(params),
    {
      default: () => ({ data: [], count: 0 }),
      server: params.server,
      lazy: params.lazy,
    }
  );
};
