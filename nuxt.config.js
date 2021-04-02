export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/favicons/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/favicons/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/img/favicons/favicon-32x32.png',
        sizes: '32x32'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/img/favicons/favicon-16x16.png',
        sizes: '16x16'
      },
      {
        rel: 'mask-icon',
        href: '/img/favicons/safari-pinned-tab.svg',
        color: '#2760ff'
      }
    ]
  },
  env: {
    discover_api_host:
      process.env.PENNSIEVE_DISCOVER_API_HOST ||
      'https://api.pennsieve.io/discover',
    zipit_host:
      process.env.PENNSIEVE_ZIPIT_HOST ||
      'https://api.pennsieve.io/zipit/discover',
    max_download_size: parseInt(process.env.MAX_DOWNLOAD_SIZE || '5000000000'),
    googleTagManager: process.env.PENNSIEVE_DISCOVER_GOOGLE_TAG_MANAGER || '',
    siteUrl: process.env.SITE_URL || 'https://localhost:3000',
    api_host: process.env.PENNSIEVE_API_HOST || 'https://api.pennsieve.io',
    region: process.env.REGION || 'us-east-1',
    userPoolId: process.env.USER_POOL_ID || 'us-east-1_XciE1JSvP',
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID || '2653f5r4vgk8eo1p17nvaftaea'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/display.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/bootstrap', '@/plugins/element-ui', '@/plugins/amplify'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/gtm'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/robots'
  ],
  /*
   ** robots.txt
   */
  robots: [
    {
      // all environment
      UserAgent: '*',

      // disallow all in all environments except production
      Disallow: () => (process.env.DEPLOY_ENV !== 'production' ? '/' : [])
    }
  ],
  /**
   * Google Tag manager config
   */
  gtm: {
    id: process.env.PENNSIEVE_DISCOVER_GOOGLE_TAG_MANAGER || ''
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  /**
   * Custom routes
   */
  router: {
    extendRoutes(routes) {
      routes.push({
        name: 'version',
        path: '/datasets/:id/version/:version',
        component: '@/pages/datasets/_id.vue'
      })
    }
  }
}
