import { propOr } from 'ramda'
import { mapGetters } from 'vuex'
import Cookie from 'js-cookie'
import EventBus from '@/utils/event-bus'
import LogoutHandler from '@/mixins/logout-handler'

const _isString = (x) => Object.prototype.toString.call(x) === '[object String]'

const _trimValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (_isString(obj[key])) {
      obj[key] = obj[key].trim()
    }
  })
}

const _isDiscoverRequest = (url) => {
  return url.includes(process.env.discover_api_host)
}

const _hasParams = (url) => {
  return url.split('?').length > 1
}

export default {
  mixins: [LogoutHandler],

  data() {
    return {
      isLoading: false
    }
  },

  computed: {
    ...mapGetters(['isSignedIn'])
  },

  methods: {
    /**
     * Send xhr request
     * @param {String} url
     * @param {Object} opts
     */
    sendXhr(url, opts) {
      if (!url) {
        return Promise.reject(new Error('Url is missing!'))
      }

      this.isLoading = true
      const method = propOr('GET', 'method', opts)
      const optsHeader = propOr({}, 'header', opts)

      const headers = Object.assign(
        {},
        { 'Content-type': 'application/json' },
        optsHeader
      )

      url = this.generateUrlWithToken(url)

      let requestOpts = { method, headers }
      let body = propOr({}, 'body', opts)

      if (body) {
        if (typeof body === 'object') {
          _trimValues(body)
        }
        body = JSON.stringify(body)
        requestOpts = Object.assign({}, requestOpts, { data: body })
      }

      return this.$axios(url, requestOpts)
        .then((response) => {
          if (response.status >= 400) {
            return Promise.reject(response)
          }
          return response.data
        })
        .catch(this.handleXhrError.bind(this))
        .finally(() => {
          this.isLoading = false
        })
    },

    /**
     * Handles ajax errors
     * @param {Object} err
     */
    handleXhrError(err) {
      this.isLoading = false
      const status = err.status
      // logout
      if (status === 401) {
        return this.handleLogout()
      }
      // emit ajaxError
      EventBus.$emit('ajaxError', err)
    },

    /**
     * If the user is signed in, append
     * session token to the url
     * @param {String} url
     */
    generateUrlWithToken(url) {
      const userToken = Cookie.get('user_token')
      if ((this.isSignedIn || userToken) && _isDiscoverRequest(url)) {
        const char = _hasParams(url) ? '&' : '?'
        return `${url}${char}api_key=${userToken}`
      }
      return url
    }
  }
}
