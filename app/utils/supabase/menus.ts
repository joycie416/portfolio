import { PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { MenuInsertType, MenuUpdateType } from "@/types/supabase";

export const menus = (client: SupabaseClient<Database>) => ({
  getAll: async () => {
    const { data, error } = await client
      .from("menus")
      .select("*, posts(count)");
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
  getBySlug: async (slug: string) => {
    const { data, error } = await client
      .from("menus")
      .select("id, name, slug")
      .eq("slug", slug)
      .single();
    if (error) throw new PostgrestError(error);
    return data;
  },
});
