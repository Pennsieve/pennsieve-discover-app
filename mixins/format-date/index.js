import moment from 'moment'

export default {
  methods: {
    /**
     * Format date for display
     * @param {Date} date
     * @returns {String}
     */
    formatDate(date) {
      return moment.utc(date).format('MMMM D, YYYY')
    },

    formatCalendarDate(date) {
      return moment.utc(date).format('L')
    }
  }
}
