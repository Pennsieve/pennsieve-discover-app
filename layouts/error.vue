<template>
  <div class="search-results body-wrap">
    <bf-header />
    <div class="body-content-wrap">
      <div class="discover-content container-fluid error-content">
        <div class="row">
          <div class="col-xs-12">
            <h1 v-if="error.statusCode === 404">Page not found</h1>
            <h1 v-else>An error occurred</h1>
            <nuxt-link to="/">Home page</nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <bf-footer :show-signup-footer="false" />
  </div>
</template>

<script>
import BfHeader from '@/components/shared/BfHeader/BfHeader.vue'
import BfFooter from '@/components/shared/BfFooter/BfFooter.vue'

export default {
  components: {
    BfHeader,
    BfFooter
  },

  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },

  head() {
    return {
      title: 'Pennsieve Discover'
    }
  }
}
</script>

<style lang="scss">
.error-content {
  padding: 2rem;
}
</style>
