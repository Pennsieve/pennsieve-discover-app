<template>
  <el-dialog :visible="visible" :show-close="false" @close="closeDialog">
    <bf-dialog-header slot="title" title="Request Rehydration" />
    <div class="rehydration-modal-container">
      <div class="copy-container">
        <h2>
          You are requesting rehydration for version {{ version }} of this
          dataset.
        </h2>
        <p class="paragraph">
          Once you submit your request, the version of the dataset you've
          requested will be extracted into an S3 folder. An email notification
          will be sent within 24 hours of initiating the process. The rehydrated
          dataset will then be available for 14 days.
        </p>
      </div>
      <div v-if="isUserAuthenticated">
        We will email you at the following address:
        {{ authenticatedUserEmail }}
      </div>
      <p class="paragraph">
        Please contact Pennsieve Support at support@pennsieve.io if you have any
        questions.
      </p>
      <div class="copy-container" v-if="!isUserAuthenticated">
        <form @submit.prevent="submitForm" ref="form">
          <div class="input-container">
            <label class="bold" for="unauthenticatedUserName">Full Name</label>
            <input
              id="unauthenticatedUserName"
              v-model="formData.unauthenticatedUserName"
              type="text"
              @input="getFormValidity"
            />
          </div>
          <div class="input-container">
            <label class="bold" for="unauthenticatedUserEmail">Email</label>
            <input
              id="unauthenticatedUserEmail"
              v-model="formData.unauthenticatedUserEmail"
              type="email"
              @input="getFormValidity"
            />
          </div>
        </form>
      </div>
      <bf-button
        @click="submitRehydrationRequest"
        :disabled="!isUserAuthenticated && !isFormValid"
      >
        Submit
      </bf-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { composeP, pathOr } from 'ramda'
import BfButton from '../shared/BfButton/BfButton.vue'
import BfDialogHeader from '../shared/BfDialogHeader/BfDialogHeader.vue'
import Request from '@/mixins/request'

import config from '../../nuxt.config'

export default {
  name: 'RehydrationModal',

  components: {
    BfButton,
    BfDialogHeader
  },

  mixins: [Request],

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
    },
    closeRehydrationDialog: {
      type: Function
    }
  },

  data() {
    return {
      formData: {
        unauthenticatedUserName: '',
        unauthenticatedUserEmail: ''
      },
      isRehydrationModalVisible: false,
      authenticatedUserEmail: '',
      isFormValid: false
    }
  },

  computed: {
    ...mapState(['userDisplayName', 'profile', 'userToken']),
    /**
     * checks to see if user is authenticated
     * @returns {Boolean}
     */
    isUserAuthenticated() {
      return !!this.userToken
    }
  },

  mounted() {
    this.authenticatedUserEmail = pathOr('', ['email'], this.profile)
  },

  methods: {
    /**
     * Checks validity of form
     */
    getFormValidity() {
      this.isFormValid =
        this.formData.unauthenticatedUserName &&
        this.formData.unauthenticatedUserEmail &&
        this.$refs.form.checkValidity()
    },
    /**
     * Clears the form
     */
    clearForm() {
      this.formData = {
        unauthenticatedUserName: '',
        unauthenticatedUserEmail: ''
      }
      this.isFormValid = false
    },
    /**
     * Closes dialog
     */
    closeDialog() {
      this.clearForm()
      this.$emit('close-rehydration-dialog')
    },
    /**
     * Click Hander for submit rehydration request button
     */
    submitRehydrationRequest() {
      const isAuthenticated = Object.keys(this.profile).length > 0
      const firstName = pathOr('', ['firstName'], this.profile)
      const lastName = pathOr('', ['lastName'], this.profile)
      const email = pathOr('', ['email'], this.profile)

      // make API call the rehydration endpoint
      // replace with config.env.api_host
      const url = `https://api2.pennsieve.net/rehydrate/?api_key=${this.userToken}`
      // TODO: don't forget to change this to pull from the ENV instead of being hard coded.

      this.sendXhr(url, {
        method: 'POST',
        body: {
          datasetVersionId: this.version,
          datasetId: this.datasetId,
          name: isAuthenticated
            ? `${firstName} ${lastName}`
            : this.formData.unauthenticatedUserName,
          email: isAuthenticated
            ? email
            : this.formData.unauthenticatedUserEmail
        }
      }).then((resp) => {})
      this.clearForm()
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.bold {
  font-weight: bold;
}
.copy-container {
  word-break: break-word;
}

.paragraph {
  word-break: break-word;
}

.input-container {
  display: flex;
  flex-direction: column;
  max-width: 200px;
  margin-bottom: 10px;
}

.error {
  color: red;
}
</style>