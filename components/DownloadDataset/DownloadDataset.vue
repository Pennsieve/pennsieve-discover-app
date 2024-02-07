<template>
  <div>
    <el-dialog
      :visible="visible"
      :show-close="false"
      class="download-dataset-dialog"
      :width="width"
      height="448px"
      @close="closeDialog"
    >
      <div class="download-dataset-container">
        <div v-if="!isDatasetSizeLarge" class="download-block">
          <h1>Direct Download</h1>
          <p>
            You can download the raw files and metadata directly to your
            computer as a zip archive.
          </p>
          <a :href="downloadUrl">
            <bf-button class="download-button">Download Dataset</bf-button>
          </a>

          <div class="size">
            {{ formatMetric(datasetDetails.size) }}
          </div>
          <img
            src="~/assets/images/illustrations/illo-data-management.svg"
            alt="illustration of data management"
          />
        </div>
        <div :class="[isDatasetSizeLarge ? 'aws-container' : 'aws-block']">
          <button class="close-dialog" @click="closeDialog">
            <svg-icon
              name="icon-remove"
              width="16"
              height="16"
              color="#71747c"
              class="close-icon"
            />
          </button>
          <h1>Download from AWS</h1>
          <p>
            Raw files and metadata are stored in an AWS S3 Requester Pays
            bucket. You can learn more about
            <a
              href="https://docs.pennsieve.io/docs/downloading-a-public-dataset"
              target="_blank"
            >
              downloading data from AWS
            </a>
            in the Help Center.
          </p>
          <h2>Resource Type</h2>
          <p>Amazon S3 Bucket (Requester Pays)</p>
          <h2>Amazon S3 Bucket</h2>
          <div class="text-block">
            {{ datasetArn }}
          </div>
          <h2>AWS Region</h2>
          <div class="text-block">
            us-east-1
          </div>
        </div>
        <div class="rehydration-btn-container">
          <bf-button
            v-if="!isLatestVersion"
            key="btn-request-rehydration"
            class="rehydration-btn"
            @click="openRehydrationModal"
          >
            Request Rehydration
          </bf-button>
        </div>
      </div>
    </el-dialog>
    <rehydration-modal
      :visible.sync="isRehydrationModalVisible"
      @close-rehydration-dialog="isRehydrationModalVisible = false"
    />
  </div>
</template>

<script>
import { compose, head, propOr } from 'ramda'

import BfButton from '../shared/BfButton/BfButton.vue'
import FormatMetric from '../../mixins/bf-storage-metrics'

import Request from '@/mixins/request'
import RehydrationModal from '@/components/RehydrationModal/RehydrationModal.vue'

export default {
  name: 'DownloadDataset',

  components: {
    BfButton,
    RehydrationModal
  },

  mixins: [FormatMetric, Request],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    datasetDetails: {
      type: Object,
      default: () => {}
    },
    versions: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      isRehydrationModalVisible: false
    }
  },

  computed: {
    /**
     * Indicates whether the version being viewed is the latest version
     * @returns {Boolean}
     */
    isLatestVersion() {
      const currentVersion = propOr(0, 'version', this.datasetDetails)
      const latestVersion = compose(propOr(1, 'version'), head)(this.versions)
      return currentVersion === latestVersion
    },
    /**
     * Checks whether the dataset download size is larger or smaller than 1GB
     * @returns {Boolean}
     */
    isDatasetSizeLarge() {
      const datasetSize = propOr(0, 'size', this.datasetDetails)
      return datasetSize > process.env.max_download_size
    },

    /**
     * Compute width based on isDatasetSizeLarge
     * @returns {String}
     */
    width() {
      return this.isDatasetSizeLarge ? '490px' : '772px'
    },

    /**
     * Gets dataset id
     * @returns {Number}
     */
    datasetId() {
      return propOr(0, 'id', this.datasetDetails)
    },

    /**
     * Gets dataset version
     * @returns {Number}
     */
    version() {
      return propOr(0, 'version', this.datasetDetails)
    },

    /**
     * Gets dataset ARN
     * @returns {String}
     */
    datasetArn() {
      return propOr('', 'uri', this.datasetDetails)
    },

    /**
     * Computes the API url for downloading a dataset
     * @returns {String}
     */
    downloadUrl() {
      return this.generateUrlWithToken(
        `${process.env.discover_api_host}/datasets/${this.datasetId}/versions/${this.version}/download?downloadOrigin=Discover`
      )
    }
  },

  mounted() {},

  methods: {
    /**
     * Closes dialog
     */
    closeDialog() {
      this.$emit('close-download-dialog')
    },
    /**
     * Opens the version history modal
     */
    openRehydrationModal() {
      this.isRehydrationModalVisible = true

      this.$emit('close-download-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.download-dataset-dialog {
  .download-dataset-container {
    display: flex;
    flex-direction: column;
    word-break: normal;
  }
  .download-block {
    box-sizing: border-box;
    flex-shrink: 0;
    height: 100%;
    width: 316px;
    overflow: hidden;
    position: relative;
    background-color: #1c46bd;
    padding: 40px 40px 0px 40px;

    img {
      position: absolute;
      top: 245px;
      left: -102px;
      opacity: 0.3;
      width: 413px;
      height: 402px;
    }

    h1 {
      line-height: 32px;
      color: #ffffff;
      font-size: 24px;
      font-weight: 500;
      margin: 0;
    }

    p {
      line-height: 24px;
      color: #cddaff;
      font-size: 16px;
      margin-top: 8px;
    }

    .size {
      text-align: center;
      line-height: 24px;
      color: #ffffff;
      font-size: 14px;
      margin-top: 2px;
    }

    .download-button {
      height: 60px;
      width: 236px;
      border-radius: 3px;
      background-color: #071540;
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      margin-top: 5px;
    }
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }

    &:focus {
      color: #1c46bd;
    }
  }

  .aws-container {
    margin: 21px 48px;
    margin-top: 47px;
  }

  .close-dialog {
    float: right;
    margin-top: -21px;
  }

  .close-icon {
    margin-top: 26px;
    margin-right: -12px;
  }

  h1 {
    color: #000000;
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    margin-bottom: 8px;
  }

  p {
    color: #000000;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 16px;
  }

  h2 {
    color: #000000;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px;
  }

  .text-block {
    border-radius: 2px;
    background-color: #f1f1f3;
    padding: 8px 8px 8px 8px;
    margin-bottom: 16px;
    font-family: 'FiraCode';
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .aws-block {
    box-sizing: border-box;
    padding: 40px 40px 0;
  }

  ::v-deep .el-dialog {
    border-radius: 0;
    width: var(--widthSmaller);
    .el-dialog__body {
      padding: 0;
    }

    .el-dialog__header {
      padding: 0;
      border-bottom: none;
    }
  }

  ::v-deep .bf-button {
    &:focus {
      background-color: #11369c;
    }
  }
}
.rehydration-btn-container {
  display: flex;
  justify-content: flex-start;
}
.rehydration-btn {
  margin-left: 47px;
  margin-bottom: 25px;
  font-weight: 600;
  line-height: 16px;
  font-size: 14px;
}
</style>
