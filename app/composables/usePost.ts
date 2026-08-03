import { posts, type PostVisibility } from "@/utils/supabase/posts";
import { postsTransformer } from "@/utils/post";
import type {
  Post,
  TempPost,
  TransformedPost,
  PostBulkFailure,
  PostInsertType,
  PostUpdateType,
  PostFile,
  PostUpdateFile,
  PostStorageFiles,
  PostSaveResult,
  SimpleTempPost,
  SimplePostWithMenuSlug,
} from "@/types/supabase";

export const POSTS_PAGE_SIZE = 10;

export type UseGetPostsParams = {
  page: MaybeRefOrGetter<number>;
  query?: MaybeRefOrGetter<string | undefined>;
  visibility?: MaybeRefOrGetter<PostVisibility>;
  slug?: MaybeRefOrGetter<string | undefined>;
  perPage?: number;
};

export const useGetPosts = (params: UseGetPostsParams) => {
  const supabase = useSupabaseClient();
  const pageSize = params.perPage ?? POSTS_PAGE_SIZE;

  // admin 목록: menu_full_name 매핑용 (조회 자체는 slug join으로 menus와 무관)
  const { data: menus, error: menusError } = useGetMenus();

  const page = computed(() => toValue(params.page));
  const slug = computed(() => toValue(params.slug));
  const query = computed(() => toValue(params.query));
  const visibility = computed<PostVisibility>(
    () => toValue(params.visibility) ?? "all"
  );

  const result = useAsyncData<{
    data: SimplePostWithMenuSlug[];
    count: number;
  }>(
    () =>
      `posts:${page.value}:${pageSize}:${slug.value ?? "all"}:${visibility.value}:${query.value?.trim() ?? ""}`,
    () =>
      posts(supabase).getList({
        page: page.value,
        perPage: pageSize,
        slug: slug.value,
        query: query.value,
        visibility: visibility.value,
      }),
    { default: () => ({ data: [], count: 0 }) }
  );

  // menu_full_name 추가
  const data = computed<TransformedPost[]>(() => {
    const postList = result.data.value?.data ?? [];

    // 메뉴 조회 에러 시
    if (menusError.value) {
      return postList.map((post) => ({
        ...post,
        menu_full_name: "오류가 발생했습니다.",
      }));
    }

    return postsTransformer(postList, menus.value ?? []);
  });

  const pending = computed(() => result.pending.value);
  const error = computed(() => result.error.value ?? null);

  // 필터 반영된 전체 개수 (페이지 수 계산용)
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

/**
 * 체크한 게시글에 대한 일괄 처리(삭제/공개여부 변경/메뉴 이동) RPC 래퍼.
 * 일부 실패한 경우 실패한 행만 반환
 */
export const useBulkPostActions = () => {
  const supabase = useSupabaseClient();

  // RPC로 행을 삭제하고, 성공한 게시글의 스토리지 파일까지 정리 (posts(client).bulkDelete 참고)
  const bulkDelete = (postIds: number[]): Promise<PostBulkFailure[]> =>
    posts(supabase).bulkDelete(postIds);

  const bulkUpdateHidden = async (
    postIds: number[],
    hidden: boolean
  ): Promise<PostBulkFailure[]> => {
    const { data, error } = await supabase.rpc("posts_bulk_update_hidden", {
      post_ids: postIds,
      new_hidden: hidden,
    });
    if (error) throw error;
    return data ?? [];
  };

  const bulkMoveMenu = async (
    postIds: number[],
    menuId: string
  ): Promise<PostBulkFailure[]> => {
    const { data, error } = await supabase.rpc("posts_bulk_move_menu", {
      post_ids: postIds,
      target_menu_id: menuId,
    });
    if (error) throw error;
    return data ?? [];
  };

  return { bulkDelete, bulkUpdateHidden, bulkMoveMenu };
};

export const useCreatePost = () => {
  const supabase = useSupabaseClient();

  const createPost = (
    formData: PostInsertType,
    files: PostFile,
    temp: boolean = false
  ): Promise<PostSaveResult> => posts(supabase).create(formData, files, temp);

  return { createPost };
};

export const usePublishTempPost = () => {
  const supabase = useSupabaseClient();

  const publishTempPost = (
    tempId: number,
    formData: PostInsertType,
    files: PostUpdateFile
  ): Promise<PostSaveResult> =>
    posts(supabase).publishFromTemp(tempId, formData, files);

  return { publishTempPost };
};

export type GetPostResult<TData extends Post | TempPost = Post | TempPost> = {
  post: TData;
  files: PostStorageFiles;
};

export type UseGetPostParams<TTemp extends boolean | undefined = false> = {
  id: MaybeRefOrGetter<number | null>;
  temp?: MaybeRefOrGetter<TTemp>;
  immediate?: boolean;
};

type UseGetPostReturn<TPost extends Post | TempPost> = ReturnType<
  typeof useAsyncData<GetPostResult<TPost> | null>
>;

// 수정 화면 등에서 단일 게시글(또는 임시저장 게시글)과 첨부파일 조회
export function useGetPost(
  params: UseGetPostParams<true> & { temp: MaybeRefOrGetter<true> }
): UseGetPostReturn<TempPost>;
export function useGetPost(
  params: UseGetPostParams<false>
): UseGetPostReturn<Post>;
export function useGetPost(
  params: UseGetPostParams<boolean>
): UseGetPostReturn<Post | TempPost>;
export function useGetPost({
  id,
  temp,
  immediate = true,
}: UseGetPostParams<boolean>) {
  const supabase = useSupabaseClient();

  return useAsyncData<GetPostResult<Post | TempPost> | null>(
    () => `post:${toValue(temp) ? "temp" : "post"}:${toValue(id) ?? "none"}`,
    async () => {
      const postId = toValue(id);
      if (postId == null) return null;

      const isTemp = toValue(temp) ?? false;
      const [post, files] = await Promise.all([
        posts(supabase).getById(postId, isTemp),
        posts(supabase).getFiles(postId, isTemp),
      ]);
      return { post, files };
    },
    {
      default: () => null,
      immediate,
      watch: [() => toValue(id), () => toValue(temp)],
    }
  );
}

export const useUpdatePost = () => {
  const supabase = useSupabaseClient();

  const updatePost = (
    formData: PostUpdateType,
    files: PostUpdateFile,
    temp: boolean = false
  ): Promise<PostSaveResult> => posts(supabase).update(formData, files, temp);

  return { updatePost };
};

export const useDeletePost = () => {
  const supabase = useSupabaseClient();

  const deletePost = (id: number, temp: boolean = false) =>
    posts(supabase).delete(id, temp);

  return { deletePost };
};

export const TEMP_POST_LIST_KEY = "temp-posts";
export const useGetTempPosts = () => {
  const supabase = useSupabaseClient();

  return useAsyncData<{
    data: SimpleTempPost[];
    count: number;
  }>(
    () => TEMP_POST_LIST_KEY,
    () => posts(supabase).getTempList(),
    { default: () => ({ data: [], count: 0 }) }
  );
};
