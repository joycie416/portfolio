import type { Menu } from "@/types/supabase";
import type { MenuGroup } from "@/types/common";

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
