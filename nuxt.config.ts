// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      htmlAttrs: {
        lang: "es",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      meta: [
        {
          name: "viewport",
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"',
        },
      ],
      title: "Meta K",
    },
  },
  css: ['@/assets/css/base.css', '@fortawesome/fontawesome-svg-core/styles.css'],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxt/eslint"],
});
