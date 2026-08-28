import type { InputOption } from "@/types/common";
import type {
  Menu,
  SimplePostWithMenuSlug,
  TransformedPost,
} from "@/types/supabase";
import { POST_VISIBILITIES, type PostVisibility } from "@/utils/supabase/posts";

export const EXCERPT_MAX_LENGTH = 200;

/**
 * Tiptap HTML 본문에서 excerpt(미리보기)를 생성한다.
 * - 이미지, 테이블은 제외하고, 그 외 텍스트 (헤딩, 인용, 코드, 리스트 등)는 포함
 * - 연속 공백은 하나로 정리
 * - maxLength 초과 시 말줄임(...) 추가
 */
export const generateExcerpt = (
  html: string,
  maxLength = EXCERPT_MAX_LENGTH
): string => {
  const trimmedHtml = html.trim();
  if (!trimmedHtml) return "";

  const text = extractPlainText(trimmedHtml);
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength)}...`;
};

const extractPlainText = (html: string): string => {
  if (import.meta.client) {
    // DOMParser는 브라우저 API
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("img, table").forEach((element) => element.remove());
    return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
  }

  // SSR 환경
  // 태그 제거 후 텍스트 추출
  return html
    .replace(/<(img|table)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(img|table)\b[^>]*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const POST_VISIBILITY_LABELS: Record<PostVisibility, string> = {
  all: "전체",
  public: "공개",
  private: "비공개",
};

export const getVisibilityOptions = (): InputOption<PostVisibility>[] =>
  POST_VISIBILITIES.map((value) => ({
    label: POST_VISIBILITY_LABELS[value],
    value,
  }));

/**
 * 게시글 목록에 메뉴 전체 이름(menu_full_name)을 붙여 변환한다.
 * 부모 메뉴가 있으면 `부모메뉴이름/자식메뉴이름`, 없으면 `메뉴이름` 형태로 만든다.
 */
export const postsTransformer = (
  posts: SimplePostWithMenuSlug[],
  menus: Menu[]
): TransformedPost[] => {
  const menuMap = new Map(menus.map((menu) => [menu.id, menu]));

  const getMenuFullName = (menuId: string): string => {
    const menu = menuMap.get(menuId);
    if (!menu) return "";

    const parent = menu.parent_id ? menuMap.get(menu.parent_id) : undefined;
    return parent ? `${parent.name}/${menu.name}` : menu.name;
  };

  return posts.map((post) => ({
    ...post,
    menu_full_name: getMenuFullName(post.menu_id),
  }));
};
