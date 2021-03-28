<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    class="version-history-dialog"
    width="772px"
    height="600px"
    @close="closeDialog"
  >
    <bf-dialog-header slot="title" title="Version History" />

    <div class="version-history-container">
      <div class="row table-header">
        <div class="col-xs-3">
          Version
        </div>
        <div class="col-xs-3">
          Date Published
        </div>
        <div class="col-xs-5 col-xs-offset-1">
          DOI
        </div>
      </div>
      <div
        v-for="version in versions"
        :key="version.doi"
        :gutter="20"
        class="row table-rows"
      >
        <div :span="6" class="col-xs-3">
          <nuxt-link
            :to="{
              name: 'version',
              params: {
                version: version.version,
                datasetId
              }
            }"
            @click.native="$emit('update:visible', false)"
          >
            Version {{ version.version }}
          </nuxt-link>
        </div>
        <div class="col-xs-3">
          {{ formatDate(version.versionPublishedAt) }}
        </div>
        <div class="col-xs-5 col-xs-offset-1">
          {{ version.doi }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import BfDialogHeader from '../shared/BfDialogHeader/BfDialogHeader.vue'

import FormatDate from '../../mixins/format-date'

export default {
  name: 'VersionHistory',

  components: {
    BfDialogHeader
  },

  mixins: [FormatDate],

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    datasetId: {
      type: Number,
      default: 0
    },

    latestVersion: {
      type: Number,
      default: 0
    },
    versions: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    /**
     * Closes the dialog
     */
    closeDialog() {
      this.$emit('close-version-dialog')
      // scroll version history list to top
      const scrollEl = this.$el.querySelector('.el-dialog__body')
      scrollEl.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.version-history-dialog {
  .version-history-container {
    height: 290px;

    .table-header {
      background-color: #f9f9f9;
      height: 40px;
      width: 616px;
      padding-left: 24px;
      color: #404554;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      padding-top: 12px;
      margin-left: 0px !important;
    }

    .table-rows {
      height: 40px;
      width: 616px;
      padding-left: 24px;
      color: #000000;
      font-size: 14px;
      line-height: 16px;
      padding-top: 14px;
      border-top: solid 1px #dadada;
      margin-left: 0px !important;

      a {
        text-decoration: underline;

        &:focus {
          color: #1c46bd;
        }
      }

      .doi-column {
        padding-left: 10px !important;
      }
    }
  }

  ::v-deep .el-dialog {
    width: 616px !important;
    height: 350px;
    .el-dialog__header {
      background-color: #f1f1f3;
      padding-top: 16px;
      border-radius: 4px 4px 0px 0px;
      padding-bottom: 8px;

      .bf-dialog-header {
        .bf-dialog-header-title {
          font-size: 14px;
          font-weight: bold;
          line-height: 16px;
        }

        .icon-close {
          margin-bottom: 5px;
          .svg-icon {
            width: 16px !important;
            height: 16px !important;
          }
        }
      }
    }
    .el-dialog__body {
      padding: 0px 0px;
      overflow: scroll;
    }
  }
}
</style>
