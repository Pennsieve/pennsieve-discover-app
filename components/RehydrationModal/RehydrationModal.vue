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
        <el-form
          id="rehydration-request-form"
          ref="rehydrationForm"
          :model="rehydrationForm"
          :rules="rehydrationRules"
          @keyup.enter.native="onFormSubmit"
        >
        <el-form-item label="Full Name" prop="unauthenticatedUserName">
          <el-input
          v-model="rehydrationForm.unauthenticatedUserName" required class="full-name-input" autofocus></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="unauthenticatedEmail">
              <el-input v-model="rehydrationForm.unauthenticatedEmail" required />
            </el-form-item>
        </el-form>
        
      </div>
      <bf-button
        @click="onFormSubmit"
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
      rehydrationForm : {
        unauthenticatedUserName: '',
        unauthenticatedEmail: ''
      },
      rehydrationRules: {
        unauthenticatedUserName: [
          {
            required: true,
            message: 'Please enter your full name',
            trigger: 'submit',
          }
        ],
        unauthenticatedEmail: [
          {
            required: true,
            message: 'Please enter a valid email',
            trigger: 'submit',
            type: 'email'
          }
        ]
      },
      isRehydrationModalVisible: false,
      authenticatedUserEmail: '',
      isFormValid: false,
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
      if(!this.isUserAuthenticated) {
        this.clearForm();
      }
      this.$emit('close-rehydration-dialog')
    },
    onFormSubmit() {
      if(this.isUserAuthenticated) {   
        this.submitRehydrationRequest();     
      } else {
        this.$refs.rehydrationForm.validate(valid => {
          if(!valid) {
            return;
          }
          this.submitRehydrationRequest();
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
              : this.rehydrationForm.unauthenticatedUserName,
            email: isAuthenticated
              ? email
              : this.rehydrationForm.unauthenticatedEmail
          }
        })

        this.closeDialog()
        // when the API call is successful, make a toast pop up that tells the user that the request has been successful.
      } catch (error) {
        this.closeDialog()
        // Make a toast that tells the user there is an error pop up here
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
