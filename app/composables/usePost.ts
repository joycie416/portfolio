import { posts, type PostVisibility } from "@/utils/supabase/posts";
import { postsTransformer } from "@/utils/posts-transformer";
import type { Post, TransformedPost } from "@/types/supabase";

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
