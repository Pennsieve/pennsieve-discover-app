<template>
  <el-dialog
    :visible="visible"
    class=""
    :show-close="false"
    @close="closeDialog"
  >
    <bf-dialog-header slot="title" title="Request Rehydration" />
    <div class="rehydration-modal-container">
      <div v-if="isUserAuthenticated">
        You are requesting rehydration for version {{ currentVersion }} of this
        dataset. The dataset version will be extracted into an S3 folder, the
        process will take some amount of time, an email will be sent upon
        completion, the rehydrated dataset will be available for 14 days.
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import BfButton from '../shared/BfButton/BfButton.vue'
import BfDialogHeader from '../shared/BfDialogHeader/BfDialogHeader.vue'

export default {
  name: 'RehydrationModal',

  components: {
    BfButton,
    BfDialogHeader
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    versionNumber: {
      type: Number,
      default: 0
    },
    currentVersion: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      isRehydrationModalVisible: false
    }
  },

  computed: {
    ...mapState(['userToken']),
    /**
     * checks to see if user is authenticated
     * @returns {Boolean}
     */
    isUserAuthenticated() {
      return !!this.userToken
    }
  },

  mounted() {},

  methods: {
    /**
     * Closes dialog
     */
    closeDialog() {
      this.$emit('close-rehydration-dialog')
    }
  }
}
</script>

<style lang="scss" scoped></style>
