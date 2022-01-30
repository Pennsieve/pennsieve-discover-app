<template>
  <div class="pennsieve-viewer">
<!--    <bf-header :has-changes="hasChanges" />-->

    <div id="viewer-wrap">
<!--      <viewer-toolbar-->
<!--        v-show="!hideToolbars"-->
<!--        class="left"-->
<!--      >-->
<!--        <el-tooltip-->
<!--          v-for="tool in availableTools"-->
<!--          :key="tool.eventName"-->
<!--          placement="right"-->
<!--          :content="tool.tooltip"-->
<!--        >-->
<!--          <button-->
<!--            class="btn-icon"-->
<!--            :class="[-->
<!--              tool.eventName === viewerActiveTool ? `selected ${tool.icon}` : `${tool.icon}`-->
<!--            ]"-->
<!--            @click="setActiveTool(tool.eventName)"-->
<!--          >-->
<!--            <svg-icon-->
<!--              :name="tool.icon"-->
<!--              height="20"-->
<!--              width="20"-->
<!--            />-->
<!--          </button>-->
<!--        </el-tooltip>-->
<!--      </viewer-toolbar>-->
<!---->
<!--      <div-->
<!--        v-if="!hasItems"-->
<!--        id="empty"-->
<!--      >-->
<!--        <svg-icon-->
<!--          name="icon-neural"-->
<!--          height="50"-->
<!--          width="50"-->
<!--          :original="true"-->
<!--        />-->
<!--        <h2 class="sharp-sans">-->
<!--          No package selected-->
<!--        </h2>-->
<!--        <p>-->
<!--          Select a package that you want to view from your <router-link :to="{name: 'datasets-list'}">-->
<!--            Datasets-->
<!--          </router-link>.-->
<!--        </p>-->
<!--      </div>-->

      <viewer-pane
        ref="viewerPane"
        :pkg="activeViewer"
      />

<!--      <viewer-toolbar-->
<!--        v-show="!hideToolbars"-->
<!--        class="right"-->
<!--      >-->
<!--        <el-tooltip-->
<!--          v-for="palette in availablePalettes"-->
<!--          :key="palette.eventName"-->
<!--          placement="left"-->
<!--          :content="palette.tooltip"-->
<!--        >-->
<!--          <button-->
<!--            class="btn-icon"-->
<!--            :class="computePaletteClass(palette.eventName)"-->
<!--            @click="togglePanel(palette)"-->
<!--          >-->
<!--            <svg-icon-->
<!--              :name="palette.icon"-->
<!--              height="20"-->
<!--              width="20"-->
<!--            />-->
<!--          </button>-->
<!--        </el-tooltip>-->
<!--      </viewer-toolbar>-->

<!--      <bf-viewer-side-panel-->
<!--        :side-panel-open="viewerSidePanelOpen"-->
<!--        :side-panel-view="viewerSidePanelView"-->
<!--      />-->
    </div><!--/#viewer-wrap -->

<!--    <montage-error-dialog-->
<!--      :is-open="isMontageDialogOpen"-->
<!--      :viewer-errors="viewerErrors"-->
<!--      @close="onMontageDialogClose"-->
<!--    />-->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { propOr, pathOr, path, defaultTo, prop, find, propEq } from 'ramda'

import ViewerPane from '../ViewerPane/ViewerPane.vue'

export default {
  name: 'pennsieveViewer',
  components: {
    ViewerPane
  },
  mixins: [
  ],
  props: {
    pkg: {
      type: String,
      default: () => ""
    },
    pkgType: {
      type: String,
      default: () => ""
    },
  },
  data: function() {
    return {
      channels: [
        {
          "content": {
            "id": "N:channel:6587ba3b-acb3-4171-8ae7-1fc1c47afb02",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "ramp",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T18:59:42.441172Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:857aa377-8179-47e5-837b-898fb64ac688",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "pulse",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T18:59:42.628489Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:8580578e-7045-43dd-8a1a-1ee05a517cbc",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "noise",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:00:25.119243Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:8bc29a43-9624-428c-92ff-a57ad80d6753",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "sine 1 Hz",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:00:27.008624Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:9bcc73d7-574c-40cb-bf7e-0ddf6d4e0d3c",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "sine 8.1777 Hz",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:00:59.086478Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:4414f836-ba49-4e44-a1db-2c89bee836e2",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "sine 8 Hz",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:00:59.292772Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:18ef952f-f97c-4cbb-95f3-806a67d4665a",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "sine 15 Hz",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:02:40.21106Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:51132de6-7432-42ef-b78c-58fa1238def9",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "sine 50 Hz",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:02:41.289992Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:6faf8f60-3a07-4ab6-b6d9-ef9891520d4a",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "sine 8.5 Hz",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:02:41.543665Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:52779a70-5963-4b7c-9086-b841bae45126",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "sine 17 Hz",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:02:41.503821Z"
          },
          "properties": []
        },
        {
          "content": {
            "id": "N:channel:40761a8e-e35d-4fb8-8123-21b298fe7f21",
            "packageId": "N:package:311c0f93-f1cf-4527-922d-80b61de81d5e",
            "name": "squarewave",
            "start": 1301921822000000,
            "end": 1301922421990000,
            "unit": "uV",
            "rate": 200,
            "channelType": "CONTINUOUS",
            "group": "default",
            "lastAnnotation": 0,
            "createdAt": "2021-12-21T19:03:26.680259Z"
          },
          "properties": []
        }
      ]
    }
  },
  computed: {
    ...mapState('viewer', ['activeViewer', 'viewerSidePanelOpen', 'viewerSidePanelView', 'viewerActiveTool', 'viewerErrors', 'viewerMontageScheme']),
    // ...mapState([
    //   'config',
    // ]),
    // /**
    //  * Compute the GET file URL
    //  * @returns {String}
    //  */
    // fileUrl: function() {
    //   const apiUrl = propOr('', 'apiUrl', this.config)
    //   if (apiUrl && this.userToken) {
    //     const id = pathOr('', ['params', 'fileId'], this.$route)
    //     return `${apiUrl}/packages/${id}?api_key=${this.userToken}`
    //   }
    // },
    // /**
    //  * Compute if left and right toolbars should be visible
    //  * @returns {Boolean}
    //  */
    // hideToolbars: function() {
    //   const viewer = defaultTo({}, this.activeViewer)
    //   return Object.keys(viewer).length <= 0
    // },
    // /**
    //  * Compute if there are any items open
    //  * @returns {Boolean]}
    //  */
    // hasItems: function() {
    //   const queryParams = propOr({}, 'query', this.$route)
    //   const viewer = defaultTo({}, this.activeViewer)
    //   return Object.keys(viewer).length > 0 || this.isPackageLoading || (Object.keys(queryParams).length && queryParams.p)
    // },
    // /**
    //  * Compute viewer error type
    //  * @returns {String}
    //  */
    // viewerErrorType: function() {
    //   return propOr('', 'error', this.viewerErrors)
    // }
  },
  watch: {
    // /**
    //   * Trigger API request when URL is changed
    //   */
    pkg: {
      handler: function(pkg) {
        if (pkg) {
          this.openViewer({
            package: pkg,
            type: this.pkgType,
            channels: this.channels
          })
        }
      },
      immediate: true
    },

    // /**
    //  * Trigger montage error dialog to open for PackageCannotBeMontaged error type
    //  */
    // viewerErrorType: {
    //   handler: function(error) {
    //     if (error === 'PackageCannotBeMontaged') {
    //       this.isMontageDialogOpen = true
    //     }
    //   }
    // }
  },
  /**
   * Vue lifecycle method
   */
  mounted: function() {
  },
  beforeDestroy() {
  },
  methods: {
    ...mapActions('viewer', ['openViewer', 'setSidePanel', 'closeViewer', 'setActiveTool', 'setViewerErrors', 'setViewerMontageScheme']),
    // ...mapActions(['setDatasetRole']),
  },
}
</script>

<style lang="scss" scoped>
  @import '../../../assets/css/_variables.scss';

</style>
<style lang="scss">
  .pennsieve-viewer {
  }
</style>
