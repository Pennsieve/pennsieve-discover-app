<template>
  <el-dialog
    :visible.sync="visible"
    class=""
    :show-close="false"
    @close="closeDialog"
    >I am the modal, the mighty mighty modal</el-dialog
  >
</template>

<script>
import { compose, head, propOr } from 'ramda'

import BfButton from '../shared/BfButton/BfButton.vue'

import FormatMetric from '../../mixins/bf-storage-metrics'
import Request from '@/mixins/request'
export default {
  name: 'DownloadDataset',

  components: {
    BfButton
  },

  mixins: [FormatMetric, Request],

  props: {
    visible: {
      type: Boolean,
      default: false
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
