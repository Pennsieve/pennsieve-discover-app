<template>
  <div class="dataset-details">
    <div class="container-fluid">
      <div class="row between-mb">
        <div class="col-xs-8 header-link">
          <nuxt-link :to="{ name: 'datasets-id', params: { id: this.selectedPackage.datasetId } }">
            <svg-icon name="icon-arrow-left" class="header-link-icon" />
            Back to dataset
          </nuxt-link>
        </div>
        <div class="col-xs row end-xs">
          <bf-button
            key="btn-get-dataset"
            class="get-dataset-button"
            @click="onDownloadClick"
          >
            {{downloadContent}}
          </bf-button>
        </div>

      </div>
      <div class="package-content">
<!--        <div class="button-row">-->
<!--          <h3 class="package-content-title">-->
<!--            {{headerContent}}-->
<!--          </h3>-->



        <div class="file-info">
          <el-table
            ref="table"
            class="table"
            :data="selectedPackage.files"
            :highlight-current-row="false"
            border
            header-row-class-name="header-class"
          >
            <el-table-column label="File Name">
              <template slot-scope="scope">
                <div class="file-name-container">
                  <img :src="fileIcon(scope.row.icon, scope.row.type)" alt="Icon" />
                  <div class="name">
                      {{ scope.row.name }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :formatter="formatType" label="Type" />
            <el-table-column prop="size" label="Size" :formatter="formatStorage" />
            <el-table-column prop="uri" label="URI" min-width="200px" align="right"/>

          </el-table>
        </div>

        <h3 class="package-content-title">
          Viewer
        </h3>

      </div>
    </div>
    <form id="zipForm" method="POST" :action="zipitUrl">
      <input v-model="zipData" type="hidden" name="data" />
    </form>
  </div>
</template>

<script>
import marked from 'marked'
import BfButton from '../shared/BfButton/BfButton.vue'

import { compose, head, prop, propOr, last, groupBy } from 'ramda'

import DateUtils from '@/mixins/format-date'
import {mapState} from "vuex";
import FormatStorage from "~/mixins/bf-storage-metrics";
import FileIcon from "~/mixins/file-icon";
import Request from "~/mixins/request";

marked.setOptions({
  sanitize: true
})

export default {
  name: 'PackageDetails',

  components: {
    BfButton

  },
  mixins: [FormatStorage, FileIcon, DateUtils],

  props: {

  },

  data() {
    return {
      zipData: '',
    }
  },

  computed: {
    ...mapState(['selectedPackage', 'userToken']),

    headerContent() {
      const files = propOr(this.selectedPackage,'files',[])
      return files.length > 1 ? "Package Files": "File Details"
    },
    downloadContent() {
      const files = propOr(this.selectedPackage,'files',[])
      return files.length > 1 ? "Download Package": "Download File"
    },
    zipitUrl() {
      return `${process.env.zipit_host}`
    },
  },

  watch: {

  },

  methods: {
    /**
     * Formats file/folder type for table
     * @param {Object} row
     * @returns {String}
     */
    formatType(row) {
      return row.fileType
    },
    formatHeader(row, index) {
      return "background-color: red;"
    },
    formatStorage(row, column, cellValue) {
      return this.formatMetric(cellValue)
    },
    sizeString(sizeInBytes) {
      return this.formatMetric(sizeInBytes)
    },
    onDownloadClick() {
      this.executeDownload()
    },

    executeDownload() {
      const mainPayload = {
        paths: this.selectedPackage.files.map((f) => {
          return f.path
        }),
        datasetId: this.selectedPackage.datasetId,
        version: this.selectedPackage.version,
        userToken: this.userToken
      }

      const rootPathPayload = {} // path ? { rootPath: path.join('/') } : {}
      const archiveNamePayload =
        this.archiveName && this.selected.length > 1
          ? { archiveName: this.archiveName }
          : {}

      const payload = {
        ...mainPayload,
        ...rootPathPayload,
        ...archiveNamePayload
      }
      this.zipData = JSON.stringify(payload, undefined)
      this.$nextTick(() => {
        zipForm.submit() // eslint-disable-line no-undef
      })
    },

  },

  head() {
  }
}
</script>

<style lang="scss">
@import '../../assets/css/_variables.scss';
.el-table .header-class {
  background: $gray_1;
}

.el-table th {
  background: inherit;
}
</style>

<style lang="scss" scoped>
@import '../../assets/css/_variables.scss';

.file-info {
  margin-top: 24px;
}
.el-table--border {
  border: 1px solid $gray_2;
}



.table {

  .file-name-container {
    display: flex;

    img {
      height: 20px;
      width: 20px;
      margin: 2px 5px 0px 0px;
    }

    .name {
      margin-top: 0px;
    }
  }
}

::v-deep .el-table {
  .el-table--border {
    border:none
  }
  .el-table__header-wrapper {
    height: 40px;

    .el-table__header {
    }
  }

}

.dataset-details {
  margin-top: 24px;
}

.header-link {
  color: $purple_1;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;

  &:focus {
    color: $purple_2;

  }
  &:hover {
    text-decoration: underline;
  }

  .header-link-icon {
    color: $purple_1;
    height: 10px;
    width: 10px;
    margin-bottom: 3px;
    margin-right: 8px;
  }
}

.package-content {
  display:flex;
  flex-direction: column ;
  justify-content: space-between;

  .button-row {
    display:flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.package-content-title {
  color: $gray_4;
  font-size: 16px;
  font-weight: 500;
  line-height: 40px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}


</style>
