<!--prettier-ignore-->
<template>
<div id="viewer-wrap">
    <bf-header />
      <viewer-pane
        ref="viewerPane"
        :pkg="activeViewer"
      />
    <bf-footer />
</div>
</template>

<script>
import BfFooter from '@/components/shared/BfFooter/BfFooter.vue'
import BfHeader from '@/components/shared/BfHeader/BfHeader.vue'
import ViewerPane from '@/components/viewer/ViewerPane/ViewerPane.vue'
import EventBus from '@components/event-bus.js'

/**
 * Generate the url with token from cookies
 * @param {String} url
 * @param {Object} $cookies
 * @returns {String}
 
const generateUrlWithToken = (url, $cookies) => {
  const token = $cookies.get('user_token')
  return token ? `${url}?api_key=${token}` : url
}
*/

export default {
  name: 'TsvId',

  components: {
    ViewerPane,
    BfFooter,
    BfHeader
  },

  props: {
    showSignupFooter: {
      type: Boolean,
      default: true
    }
  },
  mounted(){
      EventBus.$on("tsvpackage", fileDataTsv=> {
          //need to view data before I can use
          console.log(${fileDataTsv});
      });
  }
}
</script>


<style lang="scss" scoped>
.dataset-details {
  background-color: #ffffff;
}
 #viewer-wrap {
    flex: 1;
    display: flex;
  }
</style>
