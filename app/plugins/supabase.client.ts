import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { AUTH_STATE_KEYS } from "@/constants/supabase.auth";
import type { Database } from "@/types/extended-database.types";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const supabase = createBrowserClient<Database>(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey
  );

  // 서버, 클라이언트 상태 동기화
  const user = useState<User | null>(AUTH_STATE_KEYS.user, () => null);

  supabase.auth.onAuthStateChange((_event, session) => {
    if (_event === "SIGNED_OUT") {
      user.value = null;
      if (route.path.startsWith("/blog/admin")) {
        navigateTo("/blog");
        return;
      }
    }
    user.value = session?.user ?? null;
  });

  return { provide: { supabase } };
});
