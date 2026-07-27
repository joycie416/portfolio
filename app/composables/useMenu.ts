import { menus } from "@/utils/supabase/menus";
import type { Menu, MenuInsertType, MenuUpdateType } from "@/types/supabase";
import type { FlatMenu } from "@/types/menu";
import type { PostgrestError } from "@supabase/supabase-js";

export const useGetMenus = () => {
  const supabase = useSupabaseClient();
  return useAsyncData<Menu[], PostgrestError>("menus", () =>
    menus(supabase).getAll()
  );
};

export const useCreateMenu = () => {
  const supabase = useSupabaseClient();

  const createMenu = (formData: MenuInsertType) =>
    menus(supabase).create(formData);

  return { createMenu };
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

export const useUpdateMenu = () => {
  const supabase = useSupabaseClient();

  const updateMenu = (data: MenuUpdateType) => menus(supabase).update(data);

  return { updateMenu };
};

export const useDeleteMenu = () => {
  const supabase = useSupabaseClient();

  const deleteMenu = async (id: string) => {
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (error) throw error;
  };

  return { deleteMenu };
};

export const useReorderMenus = () => {
  const supabase = useSupabaseClient();

  const reorderMenus = async (updates: FlatMenu[]) => {
    const { error } = await supabase.rpc("fn_menus_reorder", { updates });
    if (error) throw error;
  };

  return { reorderMenus };
};
