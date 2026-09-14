import type {
  CommentInsertType,
  CommentWithSlug,
  PublicComment,
} from "@/types/supabase";
import { comments } from "@/utils/supabase/comments";

export type UseGetCommentsParams = {
  postId: MaybeRefOrGetter<number>;
  server?: boolean;
  lazy?: boolean;
};

export const useGetComments = ({
  postId,
  server,
  lazy,
}: UseGetCommentsParams) => {
  const supabase = useSupabaseClient();
  const id = computed(() => toValue(postId));

  return useLazyAsyncData<{ data: PublicComment[]; count: number }>(
    () => `comments:${id.value}`,
    () => comments(supabase).getList(id.value),
    { default: () => ({ data: [], count: 0 }), server, lazy }
  );
};

export const useCreateComment = () => {
  const supabase = useSupabaseClient();

  const createComment = (formData: CommentInsertType) =>
    comments(supabase).create(formData);
  return { createComment };
};

// 관리자용: 비밀번호 없이 직접 삭제
export const useDeleteComment = () => {
  const supabase = useSupabaseClient();

  const deleteComment = (commentId: number) =>
    comments(supabase).delete(commentId);
  return { deleteComment };
};

// 비로그인 사용자용: 비밀번호 검증 (UI 잠금 해제용, 수정/삭제 없음)
export const useVerifyCommentPassword = () => {
  const supabase = useSupabaseClient();

  const verifyPassword = (id: number, password: string) =>
    comments(supabase).verifyPassword(id, password);
  return { verifyPassword };
};

// 비로그인 사용자용: 비밀번호 재검증 후 수정
export const useUpdateCommentWithPassword = () => {
  const supabase = useSupabaseClient();

  const updateComment = (id: number, password: string, content: string) =>
    comments(supabase).updateWithPassword(id, password, content);
  return { updateComment };
};

// 비로그인 사용자용: 비밀번호 재검증 후 삭제
export const useDeleteCommentWithPassword = () => {
  const supabase = useSupabaseClient();

  const deleteComment = (id: number, password: string) =>
    comments(supabase).deleteWithPassword(id, password);
  return { deleteComment };
};

export const COMMENTS_PAGE_SIZE = 10;

export type UseGetCommentsWithSlugParams = {
  page: MaybeRefOrGetter<number>;
  query?: MaybeRefOrGetter<string | undefined>;
  perPage?: number;
  server?: boolean;
  lazy?: boolean;
};

/**
 * 블로그 홈/관리자 댓글 관리 사용
 */
export const useGetCommentsWithSlug = (
  params: UseGetCommentsWithSlugParams
) => {
  const supabase = useSupabaseClient();
  const pageSize = params.perPage ?? COMMENTS_PAGE_SIZE;

  const page = computed(() => toValue(params.page));
  const query = computed(() => toValue(params.query));

  const { data, pending, error, refresh, ...result } = useAsyncData<{
    data: CommentWithSlug[];
    count: number;
  }>(
    () =>
      `comments:with-slug:${page.value}:${pageSize}:${query.value?.trim() ?? ""}`,
    () =>
      comments(supabase).getListWithSlug({
        page: page.value,
        perPage: pageSize,
        query: query.value,
      }),
    {
      default: () => ({ data: [], count: 0 }),
      server: params.server,
      lazy: params.lazy,
    }
  );

  const commentList = computed(() => data.value?.data ?? []);
  const filteredCount = computed(() => data.value?.count ?? 0);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredCount.value / pageSize))
  );

  return {
    ...result,
    data: commentList,
    pending,
    error,
    refresh,
    page,
    totalPages,
    pageSize,
    filteredCount,
  };
};
