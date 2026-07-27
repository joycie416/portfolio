import { PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { MenuInsertType, MenuUpdateType } from "~/types/supabase";

export const menus = (client: SupabaseClient<Database>) => ({
  getAll: async () => {
    const { data, error } = await client.from("menus").select();
    if (error) throw error;
    return data;
  },
  update: async (formData: MenuUpdateType) => {
    const { error } = await client
      .from("menus")
      .update(formData)
      .eq("id", formData.id);
    if (error) throw new PostgrestError(error);
    return;
  },
  create: async (formData: MenuInsertType) => {
    const { error } = await client.from("menus").insert(formData);
    if (error) throw new PostgrestError(error);
    return;
  },
  delete: async (id: string) => {
    const { error } = await client.from("menus").delete().eq("id", id);
    if (error) throw new PostgrestError(error);
    return;
  },
});
