import type { Menu } from "./supabase";

/**
 * 드래그앤드롭 모드에서 사용하는 메뉴 그룹
 */
export type MenuGroup = {
  id: string;
  name: string;
  hidden: boolean;
  children: MenuGroup[];
};

/**
 * 메뉴 추가/수정 시 상태
 */
export type MenuState = { mode: "drag" } | { mode: "edit"; menu: Menu | null };
