<template>
  <div class="dataset-files">
    <h3>Files</h3>
    <p v-if="isEmbargoed && userToken" class="dataset-files__message">
      This dataset is currently under embargo. Files are only visible to those
      with access to this dataset.
    </p>
    <p v-if="isEmbargoed && !userToken" class="dataset-files__message">
      This dataset is currently under embargo. Files will be made publicly
      available on {{ embargoedReleaseDate }}.
    </p>
    <dataset-files-header
      v-if="!isEmbargoed || (isEmbargoed && userToken)"
      :file-path="filePath"
      :file-count="totalFileCount"
      :files="results"
      :limit="limit"
      :loaded-count="loadedFileCount"
      @load-more-files="loadMore"
      @get-path-dataset-files="getDatasetFiles"
    />
    <div v-if="selected.length > 0" class="selection-menu-wrap mb-16">
      <el-checkbox
        id="check-all"
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="onCheckAllChange"
      />

      <span id="selection-count-label">
        {{ selectionCountLabel }}
      </span>
      <ul class="selection-actions unstyled">
        <li>
          <button class="linked btn-selection-action" @click="onDownloadClick">
            <svg-icon
              class="mr-8"
              icon="icon-upload"
              dir="down"
              height="16"
              width="16"
            />
            <span>Download</span>
          </button>
        </li>
      </ul>
    </div>
    <el-table
      v-if="!hasError"
      ref="table"
      class="table"
      :v-loading="isLoading"
      :data="results"
      @selection-change="handleTableSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="File Name">
        <template slot-scope="scope">
          <div class="file-name-container">
            <img :src="fileIcon(scope.row.icon, scope.row.type)" alt="Icon" />
            <div v-if="formatType(scope.row) === 'Folder'" class="name">
              <a
                href="#"
                @click.prevent="getDatasetFiles(scope.row.path, scope.row.name)"
              >
                {{ scope.row.name }}
              </a>
            </div>
            <div v-else class="name">
              <nuxt-link :to="{ name: 'package-id', params: { id: scope.row.sourcePackageId } }">
                {{ scope.row.name }}
              </nuxt-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatType" label="Type" />
      <el-table-column prop="size" label="Size" :formatter="formatStorage" />
      <div slot="empty" class="empty-table">
        No files found.
      </div>
    </el-table>
    <div v-if="hasError && !isEmbargoed">
      <p>Sorry, an error has occured</p>
      <bf-button @click="getDatasetFiles">
        Try again
      </bf-button>
    </div>
    <dataset-files-footer
      v-if="!isEmbargoed || (isEmbargoed && userToken)"
      :limit="limit"
      :file-count="totalFileCount"
      :loaded-count="loadedFileCount"
      :files="results"
      @load-more-files="loadMore"
    />
    <form id="zipForm" method="POST" :action="zipitUrl">
      <input v-model="zipData" type="hidden" name="data" />
    </form>
    <el-dialog
      :visible.sync="confirmDownloadVisible"
      :show-close="false"
      @close="closeConfirmDownload"
    >
      <div slot="title" class="bf-dialog-header">
        <span class="bf-dialog-header-title">Confirm Download</span>
        <button class="icon-close" @click="closeConfirmDownload">
          <svg-icon icon="icon-remove" height="12" width="12" />
        </button>
      </div>

      <div class="bf-dialog-body">
        <div v-if="showReduceSize" class="mb-24">
          <p>
            The file(s) you are trying to download exceed the limit of
            {{ maxDownloadSize }}. Please reduce the number of files selected
            and try again.
          </p>
          <el-table :show-header="false" :border="false" :data="selected">
            <el-table-column prop="name" />
            <el-table-column align="right">
              <template slot-scope="scope">
                {{ formatMetric(scope.row.size) }}
                <button>
                  <svg-icon
                    color="#bdbdbd #404554"
                    icon="icon-x-circle"
                    height="28"
                    width="28"
                    @click="removeSelection(scope.row)"
                  />
                </button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="selected.length > 1" class="download-name">
          <label for="downloadName">
            File Name
          </label>
          <el-input id="downloadName" v-model="archiveName" />
          <span>.zip</span>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <bf-button class="secondary" @click="closeConfirmDownload">
          Cancel
        </bf-button>
        <bf-button :disabled="downloadDisabled" @click="confirmDownload">
          Download
        </bf-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DatasetFilesFooter from '../DatasetFilesFooter/DatasetFilesFooter.vue'
import DatasetFilesHeader from '../DatasetFilesHeader/DatasetFilesHeader.vue'
import BfButton from '../shared/BfButton/BfButton.vue'
import Request from '@/mixins/request'
import FileIcon from '@/mixins/file-icon/index'
import FormatStorage from '@/mixins/bf-storage-metrics/index'

const ROOT_PATH_NAME = 'Root Directory'
const DEFAULT_ARCHIVE_NAME = 'blackfynn-discover-data'

export default {
  name: 'DatasetFiles',

  components: {
    DatasetFilesFooter,
    DatasetFilesHeader,
    BfButton
  },
  mixins: [FormatStorage, FileIcon, Request],

  props: {
    datasetId: {
      type: Number,
      default: 0
    },

    version: {
      type: Number,
      default: 0
    },

    isEmbargoed: {
      type: Boolean,
      default: false
    },

    embargoedReleaseDate: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      results: [],
      limit: 100,
      offset: 0,
      filePath: [ROOT_PATH_NAME],
      totalFileCount: 0,
      isLoading: false,
      filePathLimit: 4,
      hasError: false,
      selected: [],
      checkAll: false,
      zipData: '',
      confirmDownloadVisible: false,
      archiveName: DEFAULT_ARCHIVE_NAME,
      showReduceSize: false,
      downloadConfirmed: false
    }
  },

  computed: {
    ...mapState(['userToken']),

    /**
     * Compute dataset files endpoint
     * @returns {String}
     */
    getFilesUrl() {
      return this.version === 0
        ? ''
        : `${process.env.discover_api_host}/datasets/${this.datasetId}/versions/${this.version}/files/browse`
    },

    zipitUrl() {
      return `${process.env.zipit_host}`
    },

    /**
     * Displays pagination count for currently
     * loaded files in table
     * @returns {String}
     */
    loadedFileCount() {
      // cases:
      // if the total file count is < 100, just display 1 - 10 of 10 files
      // if the file count is > 100, just display 1 - 100 of 300 files
      // when loading more, it becomes 1 - 200 of 300 files etc
      // if there are no files show as 0 - 0 of 0 files unless directed otherwise
      let msg = ''
      if (this.results.length === 0) {
        msg = '0 - 0'
      } else if (
        (this.totalFileCount < this.limit && this.totalFileCount > 0) ||
        this.results.length === this.totalFileCount
      ) {
        msg = `1 - ${this.totalFileCount}`
      } else {
        msg = this.returnLengthOrLimit
      }
      return msg
    },

    /**
     * Checks to see if string should return
     * length of number of files in list
     * or limit of files displayed
     * @returns {String}
     */
    returnLengthOrLimit() {
      if (this.results.length > 0) {
        return `1 - ${this.results.length}`
      }
      return `1 - ${this.limit}`
    },

    isIndeterminate() {
      return (
        this.selected.length > 0 && this.selected.length < this.results.length
      )
    },

    selectionCountLabel() {
      return `${this.selected.length} row${
        this.selected.length > 1 ? 's' : ''
      } selected`
    },

    /**
     * download is disabled if the total size is greater than the threshold, or no rows are selected
     */
    downloadDisabled() {
      if (this.selected.length === 0) return true
      const totalSize = this.selected.reduce(
        (total, node) => total + node.size || 0,
        0
      )

      return totalSize > process.env.max_download_size
    },

    /**
     * determines whether the confirm download dialog should open
     */
    shouldConfirmDownload() {
      return (
        this.downloadDisabled ||
        (this.selected.length > 1 && !this.downloadConfirmed)
      )
    },

    maxDownloadSize() {
      return this.formatMetric(process.env.max_download_size)
    }
  },

  watch: {
    /**
     * Checks if getFilesUrl is populated before calling endpoint
     */
    getFilesUrl: {
      handler(val) {
        if (val) {
          this.getDatasetFiles()
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * Formats file/folder type for table
     * @param {Object} row
     * @returns {String}
     */
    formatType(row) {
      return row.type === 'Directory' ? 'Folder' : row.fileType
    },

    /**
     * Loads more dataset files
     */
    loadMore() {
      this.offset = this.offset + this.limit
      const [, ...filePathCopy] = this.filePath
      const loadMorePath = filePathCopy.join('/')
      this.getDatasetFiles(loadMorePath, '', '', true)
    },

    /**
     * Gets files associated with dataset to display in the table
     * @param {String} directoryName
     * @param {Number} index
     * @param {Boolean} loadMoreFiles
     * @param {Array} breadcrumbList
     */
    getDatasetFiles(
      directoryPath = '',
      directoryName = '',
      index = null,
      loadMoreFiles = false,
      breadcrumbList = []
    ) {
      this.selected = []
      if (!loadMoreFiles) {
        this.offset = 0
      }
      if (directoryPath === ROOT_PATH_NAME) {
        // this is when going back to the root folder
        // need to reset everything
        this.filePath = [ROOT_PATH_NAME]
        directoryPath = '' // overwriting this for the endpoint call
      } else if (directoryName !== '' && !loadMoreFiles) {
        // this is when clicking a new folder
        this.buildDirectoryPath(directoryName, index, breadcrumbList)
      }
      const url = `${this.getFilesUrl}?path=${directoryPath}&limit=${this.limit}&offset=${this.offset}`

      this.sendXhr(url)
        .then((response) => {
          if (this.offset > 0) {
            response.files.forEach((resp) => {
              this.results.push(resp)
            })
          } else {
            this.totalFileCount = response.totalCount
            this.results = response.files
          }
        })
        .catch(() => {
          this.hasError = true
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    handleTableSelectionChange(selection) {
      this.checkAll = selection.length === this.results.length
      this.selected = selection
    },

    /**
     * Check all, or clear the selection
     * @param {Boolean} shouldCheckAll
     */
    onCheckAllChange(shouldCheckAll) {
      if (shouldCheckAll) {
        this.$refs.table.toggleAllSelection()
      } else {
        this.$refs.table.clearSelection()
      }
    },

    onDownloadClick() {
      if (this.shouldConfirmDownload) {
        this.showReduceSize = this.downloadDisabled
        this.confirmDownloadVisible = true
      } else {
        this.executeDownload()
      }
    },

    confirmDownload() {
      this.downloadConfirmed = true
      this.onDownloadClick()
    },

    executeDownload() {
      const mainPayload = {
        paths: this.selected.map((f) => {
          const expr = /(s3:\/\/[a-z-1]+\/[0-9]+\/[0-9]+\/)(.*)/
          const match = f.uri.match(expr)
          return match[2]
        }),
        datasetId: this.datasetId,
        version: this.version,
        userToken: this.userToken
      }

      const [, ...path] = this.filePath
      const rootPathPayload = path ? { rootPath: path.join('/') } : {}
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
      this.closeConfirmDownload()
    },

    closeConfirmDownload() {
      this.archiveName = DEFAULT_ARCHIVE_NAME
      this.downloadConfirmed = false
      this.showReduceSize = false
      this.confirmDownloadVisible = false
    },

    removeSelection(row) {
      this.selected = this.selected.filter((f) => f.path !== row.path)

      const selectedPaths = this.selected.map((s) => s.path)
      this.results.forEach((r) => {
        this.$refs.table.toggleRowSelection(r, selectedPaths.includes(r.path))
      })
    },

    /**
     * Helps build the directory path based on
     * selection in the file route
     * @param {String} pathName
     * @param {Number} index
     * @param {Array} breadcrumbList
     */
    buildDirectoryPath(pathName, index, breadcrumbList) {
      if (index === null) {
        this.filePath.push(pathName)
        return
      }

      // this means we clicked on an item already in the array path
      if (breadcrumbList.length > 0) {
        if (!breadcrumbList.includes(ROOT_PATH_NAME)) {
          if (index === 0) {
            // this means this was the first item in that path
            // and we need to tack on Root to it
            this.filePath = [ROOT_PATH_NAME, ...breadcrumbList]
          } else {
            const currentDirectory = this.filePath.indexOf(pathName)
            this.filePath = this.filePath.slice(0, currentDirectory + 1)
          }
        } else {
          // this is coming from the dropdwon list
          this.filePath = breadcrumbList.slice(index, breadcrumbList.length)
          this.filePath.reverse()
        }
      } else {
        this.filePath = this.filePath.slice(0, index + 1)
      }
    },

    /**
     * Format storage column
     * @param {Object} row
     * @param {Object} column
     * @param {Number} cellValue
     * @returns {String}
     */
    formatStorage(row, column, cellValue) {
      return this.formatMetric(cellValue)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/_variables.scss';

.dataset-files {
  position: relative;
  margin-bottom: 94px;

  &__message {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    margin-top: 14px;
  }

  h3 {
    color: $myelin;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0px;
  }

  ::v-deep .el-table {
    .el-table__empty-block {
      border-left: solid 1px $cortex;
      border-right: solid 1px $cortex;
      border-bottom: solid 1px $cortex;
    }

    .el-table__header-wrapper {
      height: 40px;
      .el-table__header {
        border-right: solid 2px $axon;
        .el-table_1_column_1 {
          /deep/ .el-checkbox__input {
            margin-left: 1px;
          }
        }
        .el-table_1_column_2 {
          .cell {
            text-align: left;
          }
        }
        .el-table_1_column_3 {
          text-align: right;
        }
      }
    }

    .el-table__row {
      .el-table_1_column_2 {
        .cell {
          text-align: center;
        }
      }

      .el-table_1_column_3 {
        .cell {
          text-align: right;
        }
      }
    }

    th {
      padding: 9px 0;
    }

    .el-table__body-wrapper {
      border-bottom: none;

      .el-table__body {
        border: solid 1px $cortex;
        border-bottom: none;
      }

      .el-table__row {
        border-right: solid 1px $cortex;
      }
    }

    .el-table__header {
      .el-table_1_column_2 {
        text-align: center;
      }
    }

    th.is-leaf {
      background-color: $axon;
      color: #000;
      font-size: 14px;
      font-weight: 500;
      margin-top: 16px;
    }

    ::before {
      height: 0;
    }

    td {
      padding: 5px 0px 5px 0px;
      border-color: $cortex;
    }

    .el-table__empty-block {
      width: 99% !important;
      padding-right: 7px;
      margin-top: -1px;
      border-top: solid 1px $cortex;
    }
  }

  ::v-deep .el-table .el-table__body-wrapper .el-table__body {
    width: auto !important;
    min-width: 0;
  }

  ::v-deep .el-table::before,
  .el-table--group::after,
  .el-table--border::after {
    background-color: $cortex;
    width: 0px;
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

  .selection-menu-wrap {
    background: #e9edf6;
    border: 1px solid $cortex;
    box-sizing: border-box;
    border-radius: 3px 3px 0 0;
    display: flex;
    padding: 11px 15px 10px;
    position: absolute;
    width: 100%;
    justify-content: space-between;
    z-index: 10;
  }

  .selection-actions {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }

  #check-all {
    margin-left: 2px;
    margin-right: 26px;
  }

  #selection-count-label {
    font-size: 12px;
    font-weight: 700;
    transform: translateY(1px);
  }

  .btn-selection-action {
    align-items: center;
    display: flex;
    font-size: 14px;
  }

  .bf-dialog-header {
    align-items: center;
    display: flex;
    position: relative;
    .icon-close {
      color: $glial;
      cursor: pointer;
    }
  }

  .bf-dialog-header-title {
    flex: 1;
    font-size: 18px;
    font-weight: 400;
    line-height: 1;
    margin-right: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000;
  }

  .bf-dialog-body {
    word-break: normal;
  }

  .download-name {
    display: flex;
    align-items: center;
    label {
      min-width: 64px;
    }
    ::v-deep .el-input {
      margin: 0 8px;
    }
  }
}
</style>
