<template>
  <div class="bf-footer">
    <div v-if="showSignupFooter" class="signup">
      <div class="container-fluid discover-content">
        <div class="row bottom-sm">
          <div class="col-xs-12 col-sm-7 col-md-6 signup-message">
            <h2>Ready to publish your data?</h2>
            <p class="mb-0">
              Create a free Blackfynn account and share your data with the
              world.
            </p>
          </div>
          <div class="col-xs-12 col-sm-5 col-md-6">
            <div class="buttons">
              <!-- <bf-button class="signup-button">
                <a
                  href="https://www.blackfynn.com/academia/#signup"
                  target="_blank"
                  >Sign up for free</a
                >
              </bf-button> -->
              <bf-button class="learn-button">
                <a href="https://docs.pennsieve.io" target="_blank">
                  Learn more
                </a>
              </bf-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-container">
      <div class="container-fluid discover-content">
        <div class="row">
          <div class="col-xs-12">
            <svg-icon
              class="mb-16"
              name="pennsieve-logo"
              width="35"
              height="35"
              color="#fff"
            />
            <p class="mb-8">
              Copyright &copy; {{ copyrightYear }} University of Pennsylvania.
              All rights reserved.
            </p>
            <ul class="footer-text footer-links unstyled">
              <li>
                <a href="https://www.blackfynn.com/terms" target="_blank">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="https://www.blackfynn.com/privacy" target="_blank">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://docs.pennsieve.io/" target="_blank">
                  Documentation Hub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BfButton from '../BfButton/BfButton.vue'

export default {
  name: 'BfFooter',

  components: {
    BfButton
  },

  props: {
    showSignupFooter: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    /**
     * Returns the copyright year for the footer
     * @returns {String}
     */
    copyrightYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/_variables.scss';

.bf-footer {
  display: block;
  font-size: 13px;
  z-index: 2;

  .signup {
    background-color: #000000;
    padding: 72px 0 88px;
  }

  .signup-message {
    h2 {
      color: #ffffff;
      font-size: 32px;
      font-weight: bold;
      line-height: 56px;
      margin-bottom: 0;
      margin: 0;
    }

    p {
      color: #ffffff;
      font-size: 24px;
      font-weight: 300;
      line-height: 32px;
    }
  }

  .buttons {
    display: flex;

    @media (max-width: 48em) {
      margin-top: 32px;
    }

    @media (min-width: 48em) {
      justify-content: flex-end;
    }

    .signup-button {
      margin-right: 20px;
      width: 159px;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      line-height: 32px;
      padding: 0;

      &:focus {
        background-color: $dopamine-dark;
      }

      a {
        color: #fafafa;
        text-decoration: none;
      }
    }

    .learn-button {
      height: 48px;
      width: 130px;
      border: 2px solid #fafafa;
      border-radius: 3px;
      font-size: 16px;
      font-weight: 500;
      line-height: 32px;
      background-color: transparent;
      padding: 0;

      &:hover {
        background-color: $dopamine;
        border: 2px solid $dopamine;
      }

      &:focus {
        background-color: $dopamine-dark;
        border: 2px solid $dopamine-dark;
      }

      a {
        color: #fafafa;
        text-decoration: none;
      }
    }
  }

  p {
    color: #fafafa;
    font-size: 14px;
    line-height: 24px;
  }

  .footer-container {
    padding: 48px 0 56px;
    background: $dopamine-dark;
  }

  .footer-text {
    color: #fafafa;
  }
}

.footer-links {
  display: flex;
  li {
    &:before {
      content: '|';
    }
    &:first-child {
      margin: 0;

      &:before {
        content: '';
      }

      a {
        padding-left: 0;
      }
    }
  }

  a {
    color: $dendrite;
    font-size: 14px;
    line-height: 16px;
    padding: 0 4px;
    text-decoration: underline;

    &:visited,
    &:active,
    &:hover,
    &:focus {
      color: $dendrite;
    }
    &:hover,
    &:focus {
      text-decoration: none;
    }
  }
}

a {
  color: $glial;
}

a:hover {
  color: $primary-color;
}
</style>
