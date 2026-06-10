// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// 구글, 네이버 사이트 등록
const googleSiteVerification = process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverSiteVerification = process.env.NUXT_PUBLIC_NAVER_SITE_VERIFICATION;
const googleSiteMeta = googleSiteVerification
  ? [
      {
        name: "google-site-verification",
        content: googleSiteVerification,
      },
    ]
  : [];
const naverSiteMeta = naverSiteVerification
  ? [
      {
        name: "naver-site-verification",
        content: naverSiteVerification,
      },
    ]
  : [];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/css/mixins.scss" as *;`,
        },
      },
    },
  },

  modules: ["shadcn-nuxt", "@nuxt/eslint", "@nuxt/image"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  runtimeConfig: {
    public: {
      siteUrl: "https://localhost:3000",
    },
  },

  routeRules: {
    "/": {
      prerender: true,
    },
  },
  app: {
    head: {
      title: "Haein's Portfolio",
      htmlAttrs: { lang: "ko" },
      meta: [...googleSiteMeta, ...naverSiteMeta],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },
});
