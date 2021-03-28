<template>
  <div class="sponsor-card">
    <img v-if="sponsorship.imageUrl" :src="sponsorship.imageUrl" alt="" />
    <div class="sponsor-card-body">
      <!-- eslint-disable vue/no-v-html -->
      <!-- $sanitize will sanitize the HTML injected -->
      <h3 v-if="sponsorship.title">Sponsored by {{ sponsorship.title }}</h3>
      <div
        v-if="sponsorship.markup"
        v-html="$sanitize(sponsorship.markup, ['a', 'br'])"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SponsorCard',

  props: {
    sponsorship: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/_variables.scss';
.sponsor-card {
  border: 1px solid $cortex;
  color: $myelin;
  display: flex;
  flex-direction: column;
  line-height: 20px;
  padding: 16px;
  @media only screen and (max-width: 62em) and (min-width: 48em) {
    flex-direction: row;
  }
}
h3 {
  color: #000;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  margin: 0 0 6px;
}
// @TODO remove
img {
  display: block;
  flex-shrink: 0;
  height: auto;
  margin: 0 24px 8px 0;
  width: 80px;
  @media only screen and (min-width: 62em) {
    margin-right: 0;
  }
}
</style>
