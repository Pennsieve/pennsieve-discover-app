<template>
  <div v-if="!isDismissed">
    <div v-if="showBanner" class="banner">
      <span />
      <div>
        {{ copy }}
        <a :href="getUrl" target="_blank">{{ linkText }}</a>
      </div>

      <button class="close-btn" @click="handleClose">
        <svg-icon
          name="icon-remove"
          width="12"
          height="12"
          color="#71747c"
          class="close-icon"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";

export default {
  name: "AnnouncementBanner",
  props: {
    copy: {
      type: String,
      default: "",
    },
    linkText: {
      type: String,
      default: "",
    },
    /**
     * Please pass a unique cookie name to each instance of the Announcment Banner Component.
     * **/
    cookieName: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showBanner: true,
      isDismissed: Cookies.get(this.cookieName) === "true"
    };
  },
  computed: {
    ...mapState(["config"]),
    getUrl() {
      return this.url;
    }
  },
  methods: {
    handleClose() {
      this.showBanner = false;
      Cookies.set(this.cookieName, "true");
    },
    toggleVisible(val) {
      this.visible = val;
    }
  },
};
</script>

<style scoped lang="scss">
@import '../../../assets/css/_variables.scss';

.banner {
  background-color: $purple_tint;
  border: 5px solid $purple_2;
  padding: 8px 5px 8px 5px;
  color: $purple_2;
  display: flex;
  font-weight: bold;
  justify-content: space-between;
  text-align: center;
  a {
    color: $purple_2;
    text-decoration: underline;
  }
}

.close-btn {
  margin-right: 20px;
}
</style>
