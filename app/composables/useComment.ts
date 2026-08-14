import type {
  Comment,
  CommentInsertType,
  CommentUpdateType,
  CommentWithSlug,
} from "@/types/supabase";
import { comments } from "@/utils/supabase/comments";

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

  const result = useAsyncData<{ data: CommentWithSlug[]; count: number }>(
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

  const data = computed(() => result.data.value?.data ?? []);
  const pending = computed(() => result.pending.value);
  const error = computed(() => result.error.value ?? null);
  const filteredCount = computed(() => result.data.value?.count ?? 0);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredCount.value / pageSize))
  );

  return {
    ...result,
    data,
    pending,
    error,
    refresh: result.refresh,
    page,
    totalPages,
    pageSize,
    filteredCount,
  };
};
