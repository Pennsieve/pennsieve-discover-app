<template>
  <div
    :class="
      datasetDetails.embargo ? 'version-message-fixed' : 'version-message'
    "
    class="el-message el-message--info"
  >
    <p v-if="!datasetDetails.embargo" class="el-message__content">
      {{ messageCopy }} version {{ currentVersion }} of this dataset. A
      <nuxt-link
        :to="{
          name: 'datasets-id',
          params: {
            id: datasetDetails.id
          }
        }"
      >
        more recent version
      </nuxt-link>
      is available.
    </p>
    <p v-else class="el-message__content">
      This dataset is under embargo and will be made publicly available on
      {{ embargoedReleaseDate }}
    </p>
  </div>
</template>

<script>
import { propOr } from 'ramda'
import FormatDate from '../../mixins/format-date'
export default {
  name: 'DatasetVersionMessage',

  mixins: [FormatDate],

  props: {
    currentVersion: {
      type: Number,
      default: 1
    },
    datasetDetails: {
      type: Object,
      default: () => {}
    },
    isTombStone: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    /**
     * Copy to show in the message
     * depeneding on whether the user is
     * on the tombstone page or not
     * @returns {String}
     */
    messageCopy() {
      return this.isTombStone ? 'You are attempting to view' : 'You are viewing'
    },

    /**
     * Get formatted embargoed date
     * @return {String}
     */
    embargoedReleaseDate() {
      const date = propOr('', 'embargoReleaseDate', this.datasetDetails)
      return this.formatCalendarDate(date)
    }
  }
}
</script>

<style lang="scss" scoped>
.version-message {
  position: absolute;
  top: 72px;
}
a {
  // Removes the underlined space at the end
  // of the nuxt link to the latest version
  display: inline-block;
}

.version-message-fixed {
  box-sizing: border-box;
  top: 72px;
  max-width: 600px;
  width: 100%;
}
</style>
