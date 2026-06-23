import { menus } from "@/utils/supabase/menus";
import type { Menu, MenuInsertType, MenuUpdateType } from "@/types/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export const useGetAllMenus = () => {
  const supabase = useSupabaseClient();
  return useAsyncData<Menu[], PostgrestError>("menus", () =>
    menus(supabase).getAll()
  );
};

export const useCreateMenu = () => {
  const supabase = useSupabaseClient();

  const createMenu = async (formData: MenuInsertType) => {
    try {
      await menus(supabase).create(formData);
    } catch (error) {
      if (error instanceof PostgrestError) {
        throw error;
      }
    }
  };

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

export const useDeleteMenu = () => {
  const supabase = useSupabaseClient();

  const deleteMenu = async (id: string) => {
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (error) throw error;
    return;
  };

  return { deleteMenu };
};
