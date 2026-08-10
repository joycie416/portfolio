const MENU_ROUTE_KEY = "menu-route";

export const useMenuRoute = () => {
  const menuId = useState<string | null>(MENU_ROUTE_KEY, () => null);

  const setMenuId = (id: string | null) => {
    menuId.value = id;
  };

  return {
    menuId: readonly(menuId),
    setMenuId,
  };
};
