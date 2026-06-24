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
export type MenuState = { menu: Menu | null } | null;

/**
 * 순서 변경 diff 계산용 flat 메뉴 타입
 */
export type FlatMenu = {
  id: string;
  order_idx: number;
  parent_id: string | null;
};
