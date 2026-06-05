// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["shadcn-nuxt", "@nuxt/eslint", "@nuxt/image"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  routeRules: {
    "/": {
      prerender: true,
    },
  },
});
