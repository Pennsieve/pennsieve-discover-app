<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import globalMessageHandler from '@/mixins/global-message-handler'

export default {
  mixins: [globalMessageHandler],

  beforeMount() {
    this.bootUp()
  },

  methods: {
    /**
     * If cookie exists on load, login user automatically
     */
    bootUp() {
      const token = this.$cookies.get('user_token')
      if (token) {
        this.getProfile(token)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/node_modules/flexboxgrid/css/flexboxgrid.min.css';

@import '@/assets/css/_variables.scss';
@import '@/assets/css/components/_el-select.scss';
@import '@/assets/css/components/_bf-menu.scss';
@import '@/assets/css/_svg-icon.scss';

html,
body {
  font-family: $system-font;
  font-size: 14px;
  line-height: 17px;
}
body {
  background-color: $white-matter;
  color: $text-color;
  margin: 0;
  min-height: 100vh;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.nuxt-link-exact-active,
    &.nuxt-link-exact-active {
      color: #42b983;
    }
  }
}
.discover-content {
  box-sizing: border-box;
  max-width: calc(936px + 4rem);
}
</style>
