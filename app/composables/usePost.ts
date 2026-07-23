import { posts, type PostVisibility } from "@/utils/supabase/posts";
import { postsTransformer } from "@/utils/post";
import type {
  Post,
  TransformedPost,
  PostBulkFailure,
  PostInsertType,
  PostUpdateType,
  PostFile,
  PostUpdateFile,
  PostStorageFiles,
  PostSaveResult,
  SimpleTempPost,
} from "@/types/supabase";

export const POSTS_PAGE_SIZE = 10;

export interface UseGetPostsParams {
  page: MaybeRefOrGetter<number>;
  menuId?: MaybeRefOrGetter<string | undefined>;
  query?: MaybeRefOrGetter<string | undefined>;
  visibility?: MaybeRefOrGetter<PostVisibility>;
  perPage?: number;
}

export const useGetPosts = (params: UseGetPostsParams) => {
  const supabase = useSupabaseClient();
  const pageSize = params.perPage ?? POSTS_PAGE_SIZE;

  const page = computed(() => toValue(params.page));
  const menuId = computed(() => toValue(params.menuId));
  const query = computed(() => toValue(params.query));
  const visibility = computed<PostVisibility>(
    () => toValue(params.visibility) ?? "all"
  );

  // 메뉴 목록 (메뉴 이름 매핑용) - "menus" 키로 앱 전체에서 캐시 공유
  const {
    data: menus,
    pending: menusPending,
    error: menusError,
  } = useGetAllMenus();

  // 페이지/필터 조합마다 별도 캐시 키 -> 같은 조건으로 돌아오면 재요청 없음
  const result = useAsyncData<{
    data: Post[];
    count: number;
  }>(
    () =>
      `posts:${page.value}:${menuId.value ?? "all"}:${visibility.value}:${query.value?.trim() ?? ""}`,
    () =>
      posts(supabase).getList({
        page: page.value,
        perPage: pageSize,
        menuId: menuId.value,
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

  // 게시글/메뉴 둘 중 하나라도 로딩 중이면 로딩 상태
  const pending = computed(() => result.pending.value || menusPending.value);
  // 게시글 조회 에러만 치명적으로 취급 (메뉴 에러는 menu_full_name 문구로 대체 처리)
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

export interface UseGetPostParams {
  id: MaybeRefOrGetter<number>;
  temp?: MaybeRefOrGetter<boolean>;
}

// 수정 화면 등에서 단일 게시글(또는 임시저장 게시글)을 조회
export const useGetPost = ({ id, temp }: UseGetPostParams) => {
  const supabase = useSupabaseClient();

  return useAsyncData<Post | null>(
    () => `post:${toValue(temp) ? "temp" : "post"}:${toValue(id)}`,
    () => posts(supabase).getById(toValue(id), toValue(temp) ?? false),
    { default: () => null }
  );
};

export interface UseGetPostFilesParams {
  postId: MaybeRefOrGetter<number>;
  temp?: MaybeRefOrGetter<boolean>;
}

// 스토리지 데이터 조회
export const useGetPostFiles = ({ postId, temp }: UseGetPostFilesParams) => {
  const supabase = useSupabaseClient();

  return useAsyncData<PostStorageFiles>(
    () => `post-files:${toValue(temp) ? "temp" : "post"}:${toValue(postId)}`,
    () => posts(supabase).getFiles(toValue(postId), toValue(temp) ?? false),
    { default: () => ({ inlineImages: [], attachments: [] }) }
  );
};

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
