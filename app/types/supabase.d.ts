import type { SupabaseClient } from "@supabase/supabase-js";

// supabase.client.ts 플러그인 타입 정의
declare module "#app" {
  interface NuxtApp {
    $supabase: SupabaseClient;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient;
  }
}

export {};
