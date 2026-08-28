import type { Menu } from "@/types/supabase";
import type { MenuGroup, FlatMenu, MenuFamily } from "@/types/menu";
import type { InputOption } from "@/types/common";

export const buildMenuTree = (menus: Menu[]): MenuGroup[] => {
  const parentMap = new Map<string, MenuGroup>();

  menus
    .filter((menu) => !menu.parent_id)
    .sort((a, b) => a.order_idx - b.order_idx)
    .forEach((menu) => {
      parentMap.set(menu.id, {
        id: menu.id,
        name: menu.name,
        slug: menu.slug,
        postCount: menu.posts?.[0]?.count ?? 0,
        hidden: menu.hidden,
        children: [],
      });
    });

  menus
    .filter((menu) => menu.parent_id)
    .sort((a, b) => a.order_idx - b.order_idx)
    .forEach((child) => {
      const parent = parentMap.get(child.parent_id!);
      if (!parent) return;

      const postCount = child.posts?.[0]?.count ?? 0;
      parent.postCount += postCount;
      parent.children.push({
        id: child.id,
        name: child.name,
        slug: child.slug,
        postCount,
        hidden: child.hidden,
        children: [],
      });
    });

  return [...parentMap.values()];
};

/**
 * MenuGroup 트리를 flat 배열로 변환 (order_idx, parent_id 포함)
 * drag-and-drop 후 변경 diff 계산에 사용
 */
export const flattenMenuGroups = (
  groups: MenuGroup[],
  parentId: string | null = null
): FlatMenu[] => {
  return groups.flatMap((group, index) => [
    { id: group.id, order_idx: index + 1, parent_id: parentId },
    ...flattenMenuGroups(group.children, group.id),
  ]);
};

interface ToMenuOptionsProps {
  menus: Menu[];
  withAll?: boolean;
  type?: "slug" | "id";
}

/**
 * 메뉴 데이터를 드롭다운용 메뉴 목록으로 변환
 * buildMenuTree와 동일한 계층 구조로 children을 포함
 * @param menus - 메뉴 데이터
 * @param withAll - 전체 메뉴 포함 여부
 * @param type - 메뉴 id 또는 slug 사용 여부
 */
export const toMenuOptions = ({
  menus,
  withAll = true,
  type = "slug",
}: ToMenuOptionsProps): InputOption<string>[] => {
  const defaultOptions: InputOption<string>[] = withAll
    ? [{ label: "전체", value: "all" }]
    : [];
  const parentMap = new Map<string, InputOption<string>>();

  menus
    .filter((menu) => !menu.parent_id)
    .sort((a, b) => a.order_idx - b.order_idx)
    .forEach((menu) => {
      parentMap.set(menu.id, {
        label: menu.name,
        value: type === "slug" ? menu.slug : menu.id,
        children: [],
      });
    });

  menus
    .filter((menu) => menu.parent_id)
    .sort((a, b) => a.order_idx - b.order_idx)
    .forEach((child) => {
      const parent = parentMap.get(child.parent_id!);
      if (!parent) return;

      parent.children?.push({
        label: child.name,
        value: type === "slug" ? child.slug : child.id,
      });
    });

  return [...defaultOptions, ...parentMap.values()];
};

/**
 * 게시글 목록 필터용 slug 배열.
 * 부모면 자신 + 자식, 자식이면 자신만. 메뉴 목록에 없으면 요청 slug만 반환.
 */
export const getMenuSlugsWithChildren = (
  slug: string,
  menus: Menu[]
): string[] => {
  const current = menus.find((menu) => menu.slug === slug);
  if (!current) return [slug];
  if (current.parent_id) return [current.slug];

  const childSlugs = menus
    .filter((menu) => menu.parent_id === current.id)
    .map((menu) => menu.slug);

  return [current.slug, ...childSlugs];
};

/**
 * 메뉴의 slug를 사용해 메뉴 계층을 찾아 반환
 * 해당 메뉴의 parent가 있는 경우 parent 정보도 함께 반환해 breadcrumb 에서 사용
 */
export const getMenuFamilyBySlug = (
  slug: string,
  menus: Menu[]
): MenuFamily | null => {
  const currentMenu = menus.find((menu) => menu.slug === slug);
  if (!currentMenu) return null;

  const parent = menus.find((menu) => menu.id === currentMenu.parent_id);
  if (!parent)
    return {
      parent: null,
      menu: {
        id: currentMenu.id,
        name: currentMenu.name,
        slug: currentMenu.slug,
      },
    };

  return {
    parent: { id: parent.id, name: parent.name, slug: parent.slug },
    menu: {
      id: currentMenu.id,
      name: currentMenu.name,
      slug: currentMenu.slug,
    },
  };
};
