<template>
  <el-dialog
    :visible="visible"
    class=""
    :show-close="false"
    @close="closeDialog"
  >
    <bf-dialog-header slot="title" title="Rehydration Request" />
    <div class="rehydration-modal-container">
      <div v-if="isUserAuthenticated">
        Only see this if the user is authenticated
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
    }
  },

  data() {
    return {
      isRehydrationModalVisible: false
    }
  },

  computed: {
    ...mapState(['userToken']),
    isUserAuthenticated() {
      return false
    }
  },

  mounted() {
    console.log('logging the userToken', this.userToken)
  },

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
