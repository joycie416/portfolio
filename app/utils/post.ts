import type { InputOption } from "@/types/common";
import type { Menu, Post, TransformedPost } from "@/types/supabase";
import { POST_VISIBILITIES, type PostVisibility } from "@/utils/supabase/posts";

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
  posts: Post[],
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
