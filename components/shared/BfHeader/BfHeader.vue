<template>
  <div class="bf-header">
    <div class="logo-wrap">
      <img
        src="../../../assets/images/pennsieve-logo-white.svg"
        class="logo"
      >
    </div>
    <span class="discover-title">Discover</span>
<!--    <div class="logo-wrap">-->
<!--      <button id="btn-home">-->
<!--        <nuxt-link-->
<!--          :to="{-->
<!--            name: 'index'-->
<!--          }"-->
<!--        >-->
<!--          <svg-icon name="pennsieve-logo" width="35" height="35" color="#fff" />-->
<!--        </nuxt-link>-->
<!--      </button>-->
<!--      <nuxt-link-->
<!--        v-if="!isSearchVisible"-->
<!--        :to="{-->
<!--          name: 'index'-->
<!--        }"-->
<!--        class="header-title"-->
<!--      >-->
<!--        <span class="blackfynn-title">Pennsieve</span>-->
<!--        <span class="discover-title">Discover</span>-->
<!--      </nuxt-link>-->
<!--    </div>-->

    <div
      v-if="isSearchVisible"
      class="dataset-search-wrap"
      :class="{ 'mobile-search-open': isMobileSearchOpen }"
    >
      <dataset-search ref="datasetSearch" submit-button-type="secondary" />
    </div>

    <div class="nav-links">
      <a
        v-if="isMobile && isSearchVisible"
        class="mr-16"
        href="#"
        @click.prevent="toggleSearch"
      >
        <svg-icon
          :class="iconSpacing"
          :name="btnMobileSearchIcon"
          :height="mobileSearchIconSize"
          :width="mobileSearchIconSize"
          color="#fff"
        />
      </a>
      <a href="https://docs.pennsieve.io" target="_blank" class="mr-16">
        <svg-icon
          :class="iconSpacing"
          icon="icon-help"
          height="22"
          width="22"
          color="#fff"
        />{{ helpLinkCopy }}
      </a>
      <bf-user-dropdown-menu
        :is-mobile="isMobile"
        :icon-spacing="iconSpacing"
        @open-log-in-modal="openLogInModal"
      />
    </div>
    <bf-log-in-dialog
      :visible.sync="isLogInModalVisible"
      :is-mobile="isMobile"
      @close-log-in-dialog="closeLogInModal"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DatasetSearch from '@/components/DatasetSearch/DatasetSearch.vue'
import BfLogInDialog from '@/components/shared/BfLogInDialog/BfLogInDialog.vue'
import BfUserDropdownMenu from '@/components/shared/BfUserDropdownMenu/BfUserDropdownMenu.vue'

export default {
  name: 'BfHeader',

  components: {
    DatasetSearch,
    BfLogInDialog,
    BfUserDropdownMenu
  },

  props: {
    isSearchVisible: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isMobileSearchOpen: false,
      isLogInModalVisible: false,
      displayName: '',
      windowWidth: ''
    }
  },

  computed: {
    ...mapState(['profile', 'userToken', 'userDisplayName']),

    btnMobileSearchIcon() {
      return this.isMobileSearchOpen ? 'icon-remove' : 'icon-magnifying-glass'
    },

    /**
     * Conditional size for mobile search icon button
     * @returns {String}
     */
    mobileSearchIconSize() {
      return this.isMobileSearchOpen ? '16' : '24'
    },

    /**
     * True if the user is on mobile (or small screen)
     * @returns {Boolean}
     */
    isMobile() {
      return this.windowWidth <= 768
    },

    /**
     * Copy for help button, display nothing if
     * on mobile
     * @returns {String}
     */
    helpLinkCopy() {
      return this.isMobile ? '' : 'Need Help?'
    },

    /**
     * Conditional icon spacing for mobile
     * @returns {String}
     */
    iconSpacing() {
      return this.isMobile ? 'mr-4' : 'mr-8'
    }
  },

  beforeMount() {
    // Setup resize event listener
    this.windowWidth = window.innerWidth
    window.onresize = () => this.onResize(window.innerWidth)
  },

  methods: {
    /**
     * Toggle search and focus
     * Timeout is used so the input focuses
     * after the transition
     */
    toggleSearch() {
      this.isMobileSearchOpen = !this.isMobileSearchOpen

      if (this.isMobileSearchOpen) {
        window.setTimeout(() => {
          this.$refs.datasetSearch.focus()
        }, 200)
      }
    },

    /**
     * Display log in modal
     */
    openLogInModal() {
      this.isLogInModalVisible = true
    },

    /**
     * Hide log in modal
     */
    closeLogInModal() {
      this.isLogInModalVisible = false
    },

    /**
     * Resize event listener
     * @param {Number} width
     */
    onResize(width) {
      this.windowWidth = width
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/css/_variables.scss';
.bf-header {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 64px;
  background-color: $purple_2;
  padding-right: 20px;
  position: relative;
  width: 100%;
}

.not-logged-in {
  background: $gray_1;
  display: block;

  .login-wrapper {
    background: $white;
    box-sizing: border-box;
    color: $gray_4;
    max-width: 720px;
    min-height: 100vh;
    padding-bottom: 20px;
    padding-top: 130px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-inner {
    background: $white;
    box-sizing: border-box;
    color: $gray_4;
    max-width: 720px;
    flex: 1;
    width: 360px;
  }

  .login-header {
    margin-bottom: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .logo {
    display: block;
    height: 35px;
    width: 198px;
  }

  .password {
    margin-bottom: 32px;
  }

  .forgot-password,
  .token-cancel {
    margin-left: 16px;
  }

  .sign-up {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;
  }

  .sign-in,
  .forgot-password {
    width: 50%;
  }

  .forgot-password {
    text-align: center;
  }

  .button-spinner {
    height: 20px;
    margin: -3px 8px -3px 0;
    width: 20px;
  }

  .signin-form-item {
    .el-form-item__content {
      display: flex;
    }
  }

  .centered-spaced {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;
  }
  .orcid-error-text {
    color: #fcb603;
  }
}
//.not-logged-in {
//  background: $gray_1;
//  display: block;
//
//  .login-wrapper {
//    background: $white;
//    box-sizing: border-box;
//    color: $gray_4;
//    max-width: 720px;
//    min-height: 100vh;
//    padding-bottom: 20px;
//    padding-top: 130px;
//    display: flex;
//    flex-direction: column;
//    align-items: center;
//  }
//
//  .login-inner {
//    background: $white;
//    box-sizing: border-box;
//    color: $gray_4;
//    max-width: 720px;
//    flex: 1;
//    width: 360px;
//  }
//
//  .login-header {
//    margin-bottom: 60px;
//    display: flex;
//    flex-direction: row;
//    justify-content: center;
//  }
//
//  .logo {
//    display: block;
//    height: 35px;
//    width: 198px;
//  }
//
//  .password {
//    margin-bottom: 32px;
//  }
//
//  .forgot-password,
//  .token-cancel {
//    margin-left: 16px;
//  }
//
//  .sign-up {
//    text-align: center;
//    margin-bottom: 20px;
//    margin-top: 30px;
//  }
//
//  .sign-in,
//  .forgot-password {
//    width: 50%;
//  }
//
//  .forgot-password {
//    text-align: center;
//  }
//
//  .button-spinner {
//    height: 20px;
//    margin: -3px 8px -3px 0;
//    width: 20px;
//  }
//
//  .signin-form-item {
//    .el-form-item__content {
//      display: flex;
//    }
//  }
//
//  .centered-spaced {
//    text-align: center;
//    margin-bottom: 20px;
//    margin-top: 30px;
//  }
//  .orcid-error-text {
//    color: #fcb603;
//  }
//}

.logo {
  display: block;
  height: 35px;
  width: 198px;
}
.logo-wrap {
  align-items: center;
  display: flex;
  flex-shrink: 0;
}
#btn-home {
  height: 64px;
  width: 64px;
  background-color: $purple_2;
}
.header-title {
  color: #ffffff;
  font-size: 22px;
  line-height: 21px;
  display: inline;
  margin-left: 16px;
  &:hover {
    text-decoration: none;
  }
}

.nav-links {
  flex-shrink: 0;
  margin-left: auto;
  a {
    color: white;
    display: inline-block;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 400;
  }
}
.header-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.blackfynn-title {
  font-family: 'SharpSans';
  font-weight: 500;
  margin-right: 3px;
}

.discover-title {
  font-family: 'SharpSansLight';
  font-weight: 100;
  color: white;
  font-size: 18px;
}

.dataset-search {
  @media (max-width: 48em) {
    background: $purple_2;
    box-sizing: border-box;
    flex: 1;
    margin: 0;
    padding: 12px 0 12px 12px;
    transform: translateX(100vw);
    transition: 0.2s cubic-bezier(0.4, 0, 1, 1) transform;
    .mobile-search-open & {
      transform: translateX(0);
    }
  }
  ::v-deep .bf-button {
    @media (max-width: 48em) {
      display: none;
    }
  }
  ::v-deep .dataset-search-input {
    @media (max-width: 48em) {
      margin: 0;
    }
  }
}
.dataset-search-wrap {
  overflow: hidden;
  margin: 0 24px;
  max-width: 709px;
  width: 100%;
  @media (max-width: 48em) {
    display: flex;
    margin: 0;
    max-width: none;
    position: absolute;
    top: 0;
    width: 65%;
  }
}

.btn-mobile-search {
  display: none;
  padding: 8px 12px 8px 8px;
  @media (max-width: 48em) {
    display: block;
  }

  .mobile-search-open & svg {
    box-sizing: border-box;
    padding: 4px;
  }
}
</style>
