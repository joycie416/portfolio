import { menus } from "@/utils/supabase/menus";
import type { MenuUpdateType } from "@/types/supabase";

export const useGetAllMenus = () => {
  const supabase = useSupabaseClient();
  return useAsyncData("menus", () => menus(supabase).getAll());
};

export const useUpdateHidden = () => {
  const supabase = useSupabaseClient();

  const updateHidden = ({
    id,
    hidden,
  }: Pick<MenuUpdateType, "id" | "hidden">) =>
    menus(supabase).update({ id, hidden });

  return { updateHidden };
};
