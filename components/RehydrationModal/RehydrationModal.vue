<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    @close="closeDialog"
    @open="intializeReacaptcha"
  >
    <bf-dialog-header slot="title" title="Request Access" />
    <div class="rehydration-modal-container">
      <div class="copy-container">
        <h2>
          You are requesting access to version {{ version }} of this dataset.
        </h2>
        <p class="paragraph">
          After submitting your request, the dataset version will be temporarily
          accessible in an S3 folder. You’ll receive an email from
          support@pennseive.io once the restoration is complete, within 24
          hours. Access lasts for 14 days before automatic removal. Further
          details are available on the
          <a
            href="https://docs.pennsieve.io/docs/requesting-rehydration-of-a-public-dataset"
            >Pennsieve Documentation Hub</a
          >.
        </p>
      </div>
      <!-- TODO: add ability to show user their own email address so they know where to look for the email. In dev environment it was blank with this implementation-->
      <!-- <div v-if="isUserAuthenticated">
        We will email you at the following address:
        {{ authenticatedUserEmail }}
      </div> -->
      <p class="paragraph support-msg">
        Please contact Pennsieve Support at
        <a href="mailto:support@pennsieve.io">support@pennsieve.io</a> if you
        have any questions.
      </p>
      <div v-if="!isUserAuthenticated">
        <el-form
          id="rehydration-request-form"
          ref="rehydrationForm"
          :model="rehydrationForm"
          :rules="rehydrationRules"
          @keyup.enter.native="onFormSubmit"
          hide-required-asterisk
        >
          <el-form-item label="Full Name" prop="unauthenticatedUserName">
            <el-input
              v-model="rehydrationForm.unauthenticatedUserName"
              class="full-name-input"
              autofocus
            ></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="unauthenticatedEmail">
            <el-input v-model="rehydrationForm.unauthenticatedEmail" />
          </el-form-item>
        </el-form>
      </div>
      <bf-button @click="onFormSubmit">
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
import EventBus from '@/utils/event-bus'

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
      type: Function,
      default: () => {}
    }
  },

  data() {
    return {
      rehydrationForm: {
        unauthenticatedUserName: '',
        unauthenticatedEmail: ''
      },
      rehydrationRules: {
        unauthenticatedUserName: [
          {
            required: true,
            message: 'Please enter your full name',
            trigger: 'blur'
          }
        ],
        unauthenticatedEmail: [
          {
            required: true,
            message: 'Please enter a valid email',
            trigger: 'blur',
            type: 'email'
          }
        ]
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
     * Clears the form
     */
    clearForm() {
      this.$refs.rehydrationForm.resetFields()
    },
    /**
     * Closes dialog
     */
    closeDialog() {
      if (!this.isUserAuthenticated) {
        this.clearForm()
      }
      this.$emit('close-rehydration-dialog')
      this.$recaptcha.destroy()
    },
    onFormSubmit() {
      if (this.isUserAuthenticated) {
        this.submitRehydrationRequest()
      } else {
        this.$refs.rehydrationForm.validate((valid) => {
          if (!valid) {
            return
          }
          this.submitRehydrationRequest()
        })
      }
    },
    /**
     * Click Handler for submit rehydration request button
     */
    async submitRehydrationRequest() {
      const isAuthenticated = Object.keys(this.profile).length > 0
      const firstName = pathOr('', ['firstName'], this.profile)
      const lastName = pathOr('', ['lastName'], this.profile)
      const email = pathOr('', ['email'], this.profile)

      const recaptchaToken = await this.generateRecaptchaToken()

      const url = `${process.env.api2_host}/discover/rehydrate`

      EventBus.$on('ajaxError', this.reqestRehydrationError.bind(this))

      await this.sendXhr(url, {
        method: 'POST',
        body: {
          datasetVersionId: this.version,
          datasetId: this.datasetId,
          name: isAuthenticated
            ? `${firstName} ${lastName}`
            : this.rehydrationForm.unauthenticatedUserName,
          email: isAuthenticated
            ? email
            : this.rehydrationForm.unauthenticatedEmail,
          recaptchaToken: recaptchaToken
        }
      }).then((data) => {
        if (data) {
          EventBus.$emit('toast', {
            detail: {
              msg: `Your request has been successfully submitted.`,
              type: 'SUCCESS',
              class: 'request-submitted'
            }
          })
        }
      })
      this.closeDialog()
    },
    /**
     * Generates ReCAPTCHA token to be sent to rehydration api for validation
     */
    async generateRecaptchaToken() {
      try {
        const token = await this.$recaptcha.execute()
        return token
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * Error handler for request rehydration submission
     */
    reqestRehydrationError() {
      EventBus.$emit('toast', {
        detail: {
          msg: `Failed to submit your request, please try later.`,
          type: 'ERROR',
          class: 'request-submitted'
        }
      })
    },
    /**
     * initialize recaptcha background process
     */
    async intializeReacaptcha() {
      try {
        await this.$recaptcha.init()
      } catch (e) {
        console.error(e)
      }
    }
  },

  beforeDestroy() {
    EventBus.$off('ajaxError', this.reqestRehydrationError.bind(this))
  }
}
</script>

<style lang="scss">
@import '../../assets/css/_variables.scss';

.el-form-item__label {
  color: $text-color;
  font-weight: 500;
  line-height: 16px;
  margin-bottom: 8px;
}

.el-form-item {
  margin-bottom: 16px;
  &.is-error {
    margin-bottom: 32px;
  }
}
</style>

<style lang="scss" scoped>
.copy-container {
  word-break: break-word;
}

.paragraph {
  word-break: break-word;
}

.support-msg,
h2 {
  margin-bottom: 16px;
}
</style>
