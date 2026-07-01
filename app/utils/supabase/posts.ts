import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export const POST_VISIBILITIES = ["all", "public", "private"] as const;
export type PostVisibility = (typeof POST_VISIBILITIES)[number];

export interface GetPostListParams {
  page: number;
  perPage: number;
  menuId?: string;
  query?: string;
  visibility?: PostVisibility;
}

export const posts = (client: SupabaseClient<Database>) => ({
  getList: async ({
    page,
    perPage,
    menuId,
    query: q,
    visibility = "all",
  }: GetPostListParams) => {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const keyword = q?.trim();

    // 검색어가 있으면 RPC, 없으면 기본 테이블에서 조회
    let query = keyword
      ? client.rpc(
          "search_posts_or_title_phrase_or_tags_any",
          { q: keyword },
          { count: "exact" }
        )
      : client.from("posts").select("*", { count: "exact" });

    if (menuId) query = query.eq("menu_id", menuId);
    if (visibility === "public") query = query.eq("hidden", false);
    else if (visibility === "private") query = query.eq("hidden", true);

    // 필터, 페이지네이션 적용된 목록 (count는 필터 반영된 전체 개수)
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      count: count ?? 0,
    };
  },
});
