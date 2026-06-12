import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { CookieMethodsServer, CookieOptions } from "@supabase/ssr";
import { appendHeader, getHeader, type H3Event } from "h3";

export function serverSupabaseClient(event: H3Event) {
  const config = useRuntimeConfig();

  // createServerClient deprecated 오류 해결 위해 cookies 타입 지정
  // https://github.com/supabase/supabase/issues/41123
  const cookies: CookieMethodsServer = {
    getAll() {
      const cookieHeader = getHeader(event, "Cookie");
      if (!cookieHeader) {
        return null;
      }
      return parseCookieHeader(cookieHeader).map(({ name, value }) => ({
        name,
        value: value ?? "",
      }));
    },
    setAll(
      cookiesToSet: { name: string; value: string; options: CookieOptions }[],
    ) {
      cookiesToSet.forEach(({ name, value, options }) => {
        appendHeader(
          event,
          "Set-Cookie",
          serializeCookieHeader(name, value, options),
        );
      });
    },
  };

  return createServerClient(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
    { cookies },
  );
}
