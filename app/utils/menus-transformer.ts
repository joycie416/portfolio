import type { Menu } from "@/types/supabase";
import type { MenuGroup, FlatMenu } from "@/types/menu";

export const menusTransformer = (menus: Menu[]): MenuGroup[] => {
  const parentMap = new Map<string, MenuGroup>();

  menus
    .filter((menu) => !menu.parent_id)
    .sort((a, b) => a.order_idx - b.order_idx)
    .forEach((menu) => {
      parentMap.set(menu.id, {
        id: menu.id,
        name: menu.name,
        hidden: menu.hidden,
        children: [],
      });
    });

  menus
    .filter((menu) => menu.parent_id)
    .sort((a, b) => a.order_idx - b.order_idx)
    .forEach((child) => {
      parentMap.get(child.parent_id!)?.children.push({
        id: child.id,
        name: child.name,
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
