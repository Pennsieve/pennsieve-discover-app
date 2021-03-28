import { pathOr, propOr } from 'ramda'
import { mapState, mapActions } from 'vuex'
import Cookies from 'js-cookie'
import EventBus from '../../utils/event-bus'
import logger from '../../mixins/logger'
import LogoutHandler from '@/mixins/logout-handler'

export default {
  data() {
    return {
      minCompletedEvents: 5
    }
  },

  mixins: [logger, LogoutHandler],

  mounted() {
    // Vue event listeners
    EventBus.$on('toast', this.onToast.bind(this))
    EventBus.$on('logout', this.onLogout.bind(this))
    EventBus.$on('ajaxError', this.onToast.bind(this))
  },

  computed: {
    ...mapState(['userToken'])
  },

  beforeDestroy() {
    EventBus.$off('toast', this.onToast.bind(this))
    EventBus.$off('logout', this.onLogout.bind(this))
    EventBus.$off('ajaxError', this.onToast.bind(this))
  },

  methods: {
    ...mapActions(['updateUserToken', 'updateProfile']),
    /**
     * @param {Object} evt
     */
    onToast(evt) {
      const detailMsg = pathOr('', ['detail', 'msg'], evt)
      const message = propOr(detailMsg, 'msg', evt)
      const type = pathOr('info', ['detail', 'type'], evt).toLowerCase()
      let messageClass = pathOr('', ['detail', 'class'], evt)

      if (!message) {
        this.logger(['Error!', evt], 'error')
        return
      }

      // Check the route to see if header is visible
      if (this.$route.matched.some((record) => record.components.header)) {
        messageClass = 'with-header'
      }

      this.$message({
        message,
        type,
        showClose: false,
        customClass: messageClass,
        duration: 3000,
        dangerouslyUseHTMLString: true
      })
    },

    /**
     * Handle logout
     */
    onLogout() {
      const token = Cookies.get('user_token') || this.userToken || ''
      const url = `${process.env.api_host}/account/logout?api_key=${token}`
      this.$axios
        .$post(url)
        .then(this.handleLogout())
        .catch(() => {
          EventBus.$emit('toast', {
            detail: {
              msg: `There was an error with your sign out attempt. Please try again.`
            }
          })
        })
    },

    /**
     * Get profile url
     * @param {String} token
     * @returns {String}
     */
    getProfileUrl(token) {
      return `${process.env.api_host}/user?api_key=${token}`
    },

    /**
     * Update state if user token exists
     * @param {String} token
     */
    getProfile(token) {
      if (!token) {
        return
      }

      const profileUrl = this.getProfileUrl(token)
      this.$axios
        .$get(profileUrl)
        .then((profile) => {
          this.updateUserToken(token)
          this.updateProfile(profile)
        })
        .catch((response) => {
          if (response.status !== 200) {
            this.handleLogout()
          }
        })
    }
  }
}
