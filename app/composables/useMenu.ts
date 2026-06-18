import { menus } from "@/utils/supabase/menus";

export const useGetAllMenus = () => {
  const supabase = useSupabaseClient();
  return useAsyncData("menus", () => menus(supabase).getAll());
};
