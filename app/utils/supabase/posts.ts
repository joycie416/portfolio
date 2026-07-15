import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { PostFile, PostInsertType } from "@/types/supabase";

export const POST_VISIBILITIES = ["all", "public", "private"] as const;
export type PostVisibility = (typeof POST_VISIBILITIES)[number];

export interface GetPostListParams {
  page: number;
  perPage: number;
  menuId?: string;
  query?: string;
  visibility?: PostVisibility;
}

// 정규식 특수문자 이스케이프 (data-inline-key 값을 정규식 리터럴로 사용하기 위함)
const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 본문(HTML) 안의 inline 이미지 <img> 태그를 찾아 src를 업로드된 publicUrl로 치환
// data-inline-key로 매칭하므로 key -> url 매핑에 없는 이미지는 스킵
const replaceInlineImageUrls = (
  html: string,
  urlByKey: Record<string, string>
): string =>
  Object.entries(urlByKey).reduce((acc, [key, url]) => {
    const tagPattern = new RegExp(
      `<img\\b[^>]*data-inline-key=["']${escapeRegExp(key)}["'][^>]*>`,
      "gi"
    );
    return acc.replace(tagPattern, (tag) =>
      /src=["'][^"']*["']/i.test(tag)
        ? tag.replace(/src=["'][^"']*["']/i, `src="${url}"`)
        : tag.replace(/<img/i, `<img src="${url}"`)
    );
  }, html);

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
  create: async (
    formData: PostInsertType,
    files: PostFile,
    temp: boolean = false
  ) => {
    const bucket = `${temp ? "temp_" : ""}posts`;
    const table: "posts" | "temp_posts" = temp ? "temp_posts" : "posts";

    // 1. postId를 미리 받아옴 (본문/스토리지 경로에 사용)
    const { data: postId, error: postIdError } = await client.rpc(
      `reserve_${temp ? "temp_" : ""}post_id`
    );
    if (postIdError) throw postIdError;

    // 실패 시 롤백을 위해 업로드에 성공한 스토리지 경로를 기록
    const uploadedPaths: string[] = [];

    const uploadFile = async (
      folder: "inline" | "attachments",
      key: string,
      file: File
    ) => {
      const path = `${postId}/${folder}/${key}`;
      const { error } = await client.storage.from(bucket).upload(path, file);
      if (error) throw error;
      uploadedPaths.push(path);

      return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    };

    try {
      // 2. 이미지와 첨부파일을 미리 업로드해서 publicUrl을 받음
      const inlineUrlByKey: Record<string, string> = {};
      for (const [key, file] of Object.entries(files.inlineImages)) {
        inlineUrlByKey[key] = await uploadFile("inline", key, file);
      }
      for (const [key, file] of Object.entries(files.attachments)) {
        await uploadFile("attachments", key, file);
      }

      // 3. inline image의 url을 publicUrl로 변경
      const content = replaceInlineImageUrls(formData.content, inlineUrlByKey);

      // 4. 게시글을 table에 업로드
      const { error: postInsertError } = await client
        .from(table)
        .insert({ ...formData, id: postId, content });
      if (postInsertError) throw postInsertError;

      return postId;
    } catch (error) {
      // 위 과정 중 하나라도 실패하면 이미 업로드된 파일을 모두 삭제
      if (uploadedPaths.length) {
        await client.storage.from(bucket).remove(uploadedPaths);
      }
      throw error;
    }
  },
});
