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
      <!-- TODO: add ability to show user their own email address so they know where to look for the email. In dev environment it was blank with this implementation-->
      <!-- <div v-if="isUserAuthenticated">
        We will email you at the following address:
        {{ authenticatedUserEmail }}
      </div> -->
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
import { pathOr } from 'ramda'
import BfButton from '../shared/BfButton/BfButton.vue'
import BfDialogHeader from '../shared/BfDialogHeader/BfDialogHeader.vue'
import Request from '@/mixins/request'

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

  async mounted() {
    this.authenticatedUserEmail = pathOr('', ['email'], this.profile)
    try {
      await this.$recaptcha.init();
    } catch (e) {
      console.error(e);
    }
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
    async submitRehydrationRequest() {
      const isAuthenticated = Object.keys(this.profile).length > 0
      const firstName = pathOr('', ['firstName'], this.profile)
      const lastName = pathOr('', ['lastName'], this.profile)
      const email = pathOr('', ['email'], this.profile)

      const recaptchaToken = await this.generateRecaptchaToken();

      // make API call the rehydration endpoint
      // replace with config.env.api_host
      const url = `https://api2.pennsieve.net/discover/rehydrate`
      // TODO: don't forget to change this to pull from the ENV instead of being hard coded.
      try {
        await this.sendXhr(url, {
          method: 'POST',
          body: {
            datasetVersionId: this.version,
            datasetId: this.datasetId,
            name: isAuthenticated
              ? `${firstName} ${lastName}`
              : this.formData.unauthenticatedUserName,
            email: isAuthenticated
              ? email
              : this.formData.unauthenticatedUserEmail,
            recaptchaToken: recaptchaToken
          }
        })
        // when the API call is successful, make a toast pop up that tells the user that the request has been successful.
      } catch (error) {
        this.clearForm()
        this.closeDialog()
        // Make a toast that tells the user there is an error pop up here
      }
    },
    /**
     * Generates ReCAPTCHA token to be sent to rehydration api for validation
     */
    async generateRecaptchaToken() {
      try {
        const token = await this.$recaptcha.execute()
        return token;

      } catch (error) {
        console.error(error)
      }
    }
  },

  beforeDestroy() {
    this.$recaptcha.destroy()
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
