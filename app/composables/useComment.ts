import type {
  Comment,
  CommentInsertType,
  CommentUpdateType,
} from "@/types/supabase";
import { comments } from "@/utils/supabase/comments";

export const useGetComments = ({ postId }: { postId: number }) => {
  const supabase = useSupabaseClient();

  return useLazyAsyncData<{ data: Comment[]; count: number }>(
    () => `comments:${postId}`,
    () => comments(supabase).getList(postId),
    { default: () => ({ data: [], count: 0 }) }
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
