import type { Menu } from "./supabase";

/**
 * 드래그앤드롭, 사이드바에서 사용하는 메뉴 그룹
 */
export type MenuGroup = {
  id: string;
  name: string;
  slug: string;
  hidden: boolean;
  postCount: number;
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

/**
 * Breadcrumb 에서 사용하는 메뉴 계층 타입
 */
export type MenuFamily = {
  parent: Pick<Menu, "id" | "name" | "slug"> | null;
  menu: Pick<Menu, "id" | "name" | "slug">;
};
