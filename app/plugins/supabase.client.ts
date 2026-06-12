import { createBrowserClient } from "@supabase/ssr";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const supabase = createBrowserClient(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
  );

  return { provide: { supabase } };
});
