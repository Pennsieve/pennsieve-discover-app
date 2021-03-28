import Vue from 'vue'
import * as svgicon from 'vue-svgicon'
import '@/assets/icons'
import SocialSharing from 'vue-social-sharing'
import VueClipboard from 'vue-clipboard2'

import striptags from 'striptags'
Vue.prototype.$sanitize = (html, allowedTags = ['br']) =>
  striptags(html, allowedTags)

Vue.config.productionTip = false

Vue.use(VueClipboard)
Vue.use(SocialSharing)
Vue.use(svgicon, {
  tagName: 'svg-icon'
})
