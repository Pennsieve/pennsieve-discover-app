<template>
  <div class="pennsieve-viewer">
<!--    <bf-header :has-changes="hasChanges" />-->

<!--    <div class="viewer-wrap">-->
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
        class="viewer-pane"
        v-if="showViewer"
        ref="viewerPane"
        :pkg="activeViewer"
      />
      <div
        v-else
        class="no-viewer-msg">
        {{noViewerMsg}}
      </div>

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
<!--    </div>&lt;!&ndash;/#viewer-wrap &ndash;&gt;-->

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
    }
  },
  computed: {
    ...mapState('viewer', ['activeViewer', 'viewerSidePanelOpen', 'viewerSidePanelView', 'viewerActiveTool', 'viewerErrors', 'viewerMontageScheme']),
    ...mapState(['userToken']),

    showViewer() {
      return this.pkgType == 'TimeSeries' && this.userToken
    },
    noViewerMsg() {
      if (this.pkgType == 'TimeSeries') {
        return "Login to view data"
      } else {
        return "No viewer available"
      }
    },
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

  .pennsieve-viewer {
  }
  .viewer-pane {
    background-color: white;
  }
  .no-viewer-msg {
    padding-left: 2rem;
    color: $red_2;
    font-size: 16px;
  }
</style>
