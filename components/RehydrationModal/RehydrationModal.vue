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
        You are requesting rehydration for version {{ version }} of this
        dataset. The dataset version will be extracted into an S3 folder, the
        process will take some amount of time, an email will be sent upon
        completion, the rehydrated dataset will be available for 14 days.
      </div>
      <bf-button @click="submitRehydrationRequest">
        Submit
      </bf-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import BfButton from '../shared/BfButton/BfButton.vue'
import BfDialogHeader from '../shared/BfDialogHeader/BfDialogHeader.vue'
import { pathOr } from 'ramda'

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
    version: {
      type: Number,
      default: 0
    },
    datasetId: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      isRehydrationModalVisible: false
    }
  },

  computed: {
    ...mapState('userDisplayName', 'profile', 'userToken'),
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
    },
    /**
     * Click Hander for submit rehydration request button
     */
    submitRehydrationRequest() {
      // make API call to /rehydrate endpoint
      // datasetId, datasetVersionId
      const firstName = pathOr('', ['firstName'], this.profile)
      const lastName = pathOr('', ['lastName'], this.profile)

      console.log('firstName')
      console.log('lastName')
      console.log('this.profile', this.profile)
    }
  }
}
</script>

<style lang="scss" scoped></style>
