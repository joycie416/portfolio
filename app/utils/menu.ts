import type { Menu } from "@/types/supabase";
import type { MenuGroup, FlatMenu } from "@/types/menu";
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

/**
 * 메뉴 데이터를 드롭다운용 메뉴 목록으로 변환
 * @param menus - 메뉴 데이터
 * @returns 드롭다운용 메뉴 목록
 */
export const toMenuOptions = (
  menus: Menu[],
  withAll: boolean = true
): InputOption<string>[] => {
  const sortByOrder = (a: Menu, b: Menu) => a.order_idx - b.order_idx;

  const parents = menus.filter((menu) => !menu.parent_id).sort(sortByOrder);

  const childrenByParent = new Map<string, Menu[]>();
  menus
    .filter((menu) => menu.parent_id)
    .sort(sortByOrder)
    .forEach((child) => {
      const siblings = childrenByParent.get(child.parent_id!) ?? [];
      siblings.push(child);
      childrenByParent.set(child.parent_id!, siblings);
    });

  const options: InputOption<string>[] = withAll
    ? [{ label: "전체", value: "all" }]
    : [];

  parents.forEach((parent) => {
    options.push({ label: parent.name, value: parent.id });

    childrenByParent.get(parent.id)?.forEach((child) => {
      options.push({ label: ` - ${child.name}`, value: child.id });
    });
    childrenByParent.delete(parent.id);
  });

  // 부모를 찾지 못한 메뉴는 맨 뒤에 추가
  childrenByParent.forEach((orphans) => {
    orphans.forEach((child) => {
      options.push({ label: child.name, value: child.id });
    });
  });

  return options;
};
