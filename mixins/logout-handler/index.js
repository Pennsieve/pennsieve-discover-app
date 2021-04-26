import { mapActions } from 'vuex'
import EventBus from '../../utils/event-bus'

export default {
  methods: {
    ...mapActions(['clearState']),

    /**
     * 'logout' event callback
     */
    handleLogout() {
      // clear vuex
      this.clearState()
      // remove user token
      this.$cookies.remove('user_token')
      // send toast
      EventBus.$emit('toast', {
        detail: {
          msg: `Signed out successfully.`
        }
      })
    }
  }
}
