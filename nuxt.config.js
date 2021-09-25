export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Roman Jean-Elie - front-end developer',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'French creative front-end developer from Paris',
      },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Roman Jean-Elie | Freelance creative developer',
      },
      {
        name: 'twitter:description,',
        content: 'French creative front-end developer from Paris',
      },
      { name: 'twitter:image,', content: '/cover.png' },
      { property: 'og:image,', content: '/cover.png' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/sanity-image-builder.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Gsap
  gsap: {
    clubPlugins: {
      splitText: true,
      morphSVG: true,
    },
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/sanity/module',
    'nuxt-gsap-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/style-resources'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true,
    extend(config) {
      config.module.rules.push({
        test: /\.(glsl|frag|vert)$/,
        loader: ['raw-loader', 'glslify-loader'],
      })
    },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ],
    },
  },

  generate: {
    exclude: [/^\/projects\/about/],
    fallback: true,
  },

  server: {
    host: '192.168.0.14',
  },

  styleResources: {
    scss: ['~/assets/styles/index.scss'],
  },
}
