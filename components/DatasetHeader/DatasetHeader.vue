<template>
  <div class="dataset-header">
    <div class="row mb-8">
      <div class="col-xs-12">
        <nuxt-link :to="{ name: 'index' }" class="header-link">
          <svg-icon name="icon-arrow-left" class="header-link-icon" />
          View all Datasets
        </nuxt-link>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6">
        <h1 class="dataset-title">
          {{ datasetTitle }}
        </h1>

        <div class="dataset-owners">
          <template v-if="!isContributorListVisible">
            <contributor-item :contributor="firstContributor" />
            <button
              class="contributors-button"
              href="#"
              @click.prevent="isContributorListVisible = true"
            >
              <span class="button-text">...</span>
            </button>
          </template>

          <div
            v-for="(contributor, idx) in datasetContributorsList"
            :key="contributor.id"
            class="contributor-item-wrap"
          >
            <contributor-item :contributor="contributor" />
            <template v-if="idx < datasetContributorsList.length - 1">
              ,
            </template>
          </div>
        </div>

        <p class="dataset-description">
          {{ datasetDescription }}
        </p>
        <div class="dataset-meta">
          <div class="dataset-updated-date">
            Updated on {{ lastUpdatedDate }} (<a
              href="#"
              @click.prevent="getVersionHistory"
              >{{ versionRevisionText }}</a
            >)
          </div>
          <div class="dataset-corresponding-contributor">
            <p>Corresponding Contributor:</p>
            <contributor-item :contributor="correspondingContributor" />
          </div>
        </div>
        <div v-if="isCodeRepo" class="dataset-meta">
          <b>Code Repo</b>
          <svg-icon class="mr-8" name="icon-code-repo" height="30" width="30" />
        </div>
        <bf-button
          v-if="isGetDatasetBtnVisible"
          key="btn-get-dataset"
          :disabled="isGetDatasetBtnDisabled"
          class="get-dataset-button"
          @click="getDataset"
        >
          Get Dataset
        </bf-button>
        <bf-button
          v-if="isDatasetEmbargoed && datasetDetails.embargoAccess === null"
          key="btn-request-access"
          class="get-dataset-button"
          :disabled="!userToken"
          @click="onRequestAccessClick"
        >
          <svg-icon icon="icon-lock" />
          Request Access
        </bf-button>

        <p
          v-if="
            isDatasetEmbargoed &&
              datasetDetails.embargoAccess === EMBARGO_ACCESS.REQUESTED
          "
          key="request-access-pending"
          class="requested-label"
        >
          Your request for access is pending.
        </p>
      </div>
      <div class="col-xs-12 col-sm-6 first-xs last-sm">
        <div class="header-image-section">
          <dataset-banner-image class="dataset-image" :src="getDatasetImage" />
        </div>
      </div>
    </div>

    <div class="header-stats-section">
      <div class="row">
        <div class="col-xs-6 col-sm-3">
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-files" height="20" width="20" />
            <div>
              <template v-if="datasetFiles > 0">
                <strong>{{ formatNumber(datasetFiles) }}</strong> Files
              </template>

              <template v-else>
                No Files
              </template>
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-3">
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-storage" height="20" width="20" />
            <div>
              <strong>{{ datasetStorage.number }}</strong>
              {{ datasetStorage.unit }}
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-3">
          <div class="header-stats-block">
            <svg-icon
              class="mr-8"
              name="icon-document"
              height="20"
              width="20"
            />
            <div>
              <template v-if="datasetRecords > 0">
                <strong>{{ formatNumber(datasetRecords) }}</strong> Records
              </template>

              <template v-else>
                No Records
              </template>
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-3">
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-license" height="20" width="20" />
            <div>
              <template v-if="datasetLicense">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="datasetLicenseName"
                  placement="top"
                  :visible-arrow="false"
                >
                  <a :href="licenseLink" target="_blank">
                    {{ datasetLicense }}
                  </a>
                </el-tooltip>
              </template>

              <template v-else>
                No License Selected
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <download-dataset
      :visible.sync="isDownloadModalVisible"
      :dataset-details="datasetDetails"
      :versions="versions"
      :download-size="getDownloadSize"
      @close-download-dialog="isDownloadModalVisible = false"
    />
    <version-history
      :visible.sync="isVersionModalVisible"
      :dataset-id="datasetId"
      :latest-version="latestVersion"
      :versions="versions"
      @close-version-dialog="closeVersionModal"
    />

    <data-use-agreement-sign-dialog
      :visible.sync="isDataUseAgreementSignDialogVisible"
      :data-use-agreement="dataUseAgreement"
      :is-signing-agreement.sync="isSigningAgreement"
      @submit="requestAccess"
      @download="downloadAgreement"
    />
  </div>
</template>

<script>
import { compose, head, split, propOr, last } from 'ramda'
import { mapState } from 'vuex'

import BfButton from '../shared/BfButton/BfButton.vue'
import DownloadDataset from '@/components/DownloadDataset/DownloadDataset.vue'
import VersionHistory from '@/components/VersionHistory/VersionHistory.vue'
import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'
import ContributorItem from '@/components/ContributorItem/ContributorItem.vue'
import DataUseAgreementSignDialog from '@/components/DataUseAgreementSignDialog/DataUseAgreementSignDialog.vue'

import FormatDate from '@/mixins/format-date'
import EventBus from '@/utils/event-bus'
import FormatStorage from '@/mixins/bf-storage-metrics'
import { getLicenseLink, getLicenseAbbr } from '@/utils/license-util'
import { EMBARGO_ACCESS } from '@/utils/constants'

export default {
  name: 'DatasetHeader',

  components: {
    BfButton,
    ContributorItem,
    DownloadDataset,
    VersionHistory,
    DatasetBannerImage,
    DataUseAgreementSignDialog
  },

  mixins: [FormatDate, FormatStorage],

  props: {
    datasetDetails: {
      type: Object,
      default: () => {}
    },
    versions: {
      type: Array,
      default: () => []
    },
    lastUpdatedDate: {
      type: String,
      default: ''
    },
    datasetDescription: {
      type: String,
      default: ''
    },
    isDatasetEmbargoed: {
      type: Boolean,
      default: false
    },
    hasAgreement: {
      type: Boolean,
      default: false
    },
    dataUseAgreement: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      isDownloadModalVisible: false,
      isVersionModalVisible: false,
      isContributorListVisible: true,
      isSigningAgreement: false,
      isDataUseAgreementSignDialogVisible: false,
    }
  },
  computed: {
    ...mapState(['userToken']),

    /**
     * Compute EMBARGO_ACCESS to get it into the Vue model
     * @returns {Object}
     */
    EMBARGO_ACCESS() {
      return EMBARGO_ACCESS
    },

    /**
     * Compute if the get dataset button should be visible
     * based on if the dataset is embargoed, and the user's
     * access to the dataset
     * @returns {Boolean}
     */
    isGetDatasetBtnVisible() {
      return this.isDatasetEmbargoed
        ? this.datasetDetails.embargoAccess === EMBARGO_ACCESS.GRANTED
        : true
    },

    /**
     * Compute if the get dataset button is disabled
     * Public datasets, users who are logged in and non-logged-in users
     * should be able to download datasets as a zip up to 5GB. and see
     * the S3 info otherwise
     * Embargoed datasets. Only users who are logged in and have access
     * to the dataset should be able to download the dataset.
     * @returns {Boolean}
     */
    isGetDatasetBtnDisabled() {
      return this.isDatasetEmbargoed ? !this.userToken : false
    },

    datasetContributorsList() {
      return this.isContributorListVisible
        ? this.datasetContributors
        : [last(this.datasetContributors)]
    },

    /**
     * Gets dataset size for download
     * @returns {Number}
     */
    getDownloadSize() {
      return propOr(0, 'size', this.datasetDetails)
    },

    /**
     * computes if type of dataset is code repo/github repo
     * @returns {bool}
     */
    isCodeRepo(){
      return this.datasetDetails.type==="release"?true:false;
    },
    /**
     * Gets dataset ID
     * @returns {Number}
     */
    datasetId() {
      return propOr(0, 'id', this.datasetDetails)
    },

    /**
     * Gets latest version number of dataset
     * @returns {Number}
     */
    latestVersion() {
      return propOr(1, 'version', this.datasetDetails)
    },

    /**
     * dataset revision property
     * @returns {Number | null}
     */
    revision() {
      return propOr(null, 'revision', this.datasetDetails)
    },

    /**
     * computes the right text based on the version and revision
     * @returns {String}
     */
    versionRevisionText() {
      const versionText = `Version ${this.latestVersion}`
      const revisionText = this.revision ? `, Revision ${this.revision}` : ''
      return versionText + revisionText
    },

    /**
     * Gets license link
     * @returns {String}
     */
    licenseLink() {
      return getLicenseLink(this.datasetLicense)
    },

    /**
     * Returns the dataset title
     * @returns {String}
     */
    datasetTitle() {
      return propOr('', 'name', this.datasetDetails)
    },

    /**
     * Checks if a banner image exists or not
     * @returns {Boolean}
     */
    datasetImage() {
      const banner = propOr('', 'banner', this.datasetDetails)
      if (!banner.includes('banner.jpg') || banner === '') {
        return true
      }
      return false
    },

    /**
     * Returns dataset banner
     * @returns {String}
     */
    getDatasetImage() {
      return propOr('', 'banner', this.datasetDetails)
    },

    /**
     * Returns the files associated with the dataset
     * @returns {String}
     */
    datasetFiles() {
      return propOr('', 'fileCount', this.datasetDetails)
    },

    /**
     * Returns the dataset storage count
     * @returns {Object}
     */
    datasetStorage() {
      const storage = compose(
        split(' '),
        this.formatMetric,
        propOr(0, 'size')
      )(this.datasetDetails)

      return storage.reduce((number, unit) => {
        return {
          number,
          unit
        }
      })
    },

    /**
     * Returns the dataset record count
     * @returns {String}
     */
    datasetRecords() {
      return propOr('', 'recordCount', this.datasetDetails)
    },

    /**
     * Returns the license abbr associated with the dataset
     * @returns {String}
     */
    datasetLicense() {
      const licenseKey = propOr('', 'license', this.datasetDetails)
      return getLicenseAbbr(licenseKey)
    },

    /**
     * Returns the license name associated with the dataset
     * @returns {String}
     */
    datasetLicenseName() {
      return propOr('', 'license', this.datasetDetails)
    },

    /**
     * Returns the list of contributors who contributed to the dataset
     * @returns {String}
     */
    datasetContributors() {
      return propOr([], 'contributors', this.datasetDetails)
    },

    /**
     * Gets the first contributor from the list
     * @returns {String}
     */
    firstContributor() {
      return head(this.datasetContributors)
    },

    /**
     * Gets the last contributor from the list
     * @returns {String}
     */
    lastContributor() {
      return last(this.datasetContributors)
    },

    /**
     * Compute dataset owner
     * @returns {String}
     */
    datasetOwner() {
      return propOr('', 'ownerName', this.datasetDetails)
    },

    /**
     * Return corresponding contributor details
     * @returns {Object}
     */
    correspondingContributor() {
      const firstName = propOr('', 'ownerFirstName', this.datasetDetails)
      const lastName = propOr('', 'ownerLastName', this.datasetDetails)
      const orcid = propOr('', 'ownerOrcid', this.datasetDetails)
      return {
        firstName,
        lastName,
        orcid
      }
    }
  },

  mounted() {
    EventBus.$on('close-version-dialog', this.closeVersionModal.bind(this))
    console.log(this.datasetDetails)
    /**
     * Sets the contributors list to collapsed
     * if there are more than five contributors
     */
    this.isContributorListVisible = this.datasetContributors.length < 5
  },

  methods: {
    /**
     * Formats the number to include commas
     * @param {String} number
     */
    formatNumber(number) {
      return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
    /**
     * Opens the Get Dataset modal
     */
    getDataset() {
      this.isDownloadModalVisible = true
    },

    /**
     * Opens the version history modal
     */
    getVersionHistory() {
      this.isVersionModalVisible = true
    },

    /**
     * Closes the version history modal
     */
    closeVersionModal() {
      this.isVersionModalVisible = false
    },

    /**
     * If has agreement, open dialog and prompt user to sign
     * Otherwise, request access
     */
    onRequestAccessClick() {
      if (this.hasAgreement) {
        this.isSigningAgreement = true
        this.isDataUseAgreementSignDialogVisible = true
      } else {
        this.requestAccess()
      }
    },

    /**
     * Opens Data Use Agreement Modal
     * @param {Number} dataUseAgreementId
     */
    requestAccess(dataUseAgreementId) {
      const url = `${process.env.discover_api_host}/datasets/${this.datasetDetails.id}/preview?api_key=${this.userToken}`

      this.$axios
        .$post(url, {
          datasetId: this.datasetDetails.id,
          dataUseAgreementId
        })
        .then(() => {
          this.isDataUseAgreementSignDialogVisible = false
          this.isSigningAgreement = false
          this.$emit('update-embargo-access', EMBARGO_ACCESS.REQUESTED)

          EventBus.$emit('toast', {
            detail: {
              msg: `Your request has been successfully submitted.`,
              type: 'success',
              class: 'request-submitted'
            }
          })
        })
        .catch((error) => {
          throw error
        })
    },
    /**
     * Download the agreement
     */
    downloadAgreement() {
      const url = `${process.env.discover_api_host}/datasets/${this.dataset.id}/data-use-agreement/download`
      this.isDataUseAgreementSignDialogVisible = false
      this.isSigningAgreement = false

      const downloadEl = document.createElement('a')
      downloadEl.setAttribute('href', url)
      downloadEl.setAttribute('download', 'download')

      if (document.createEvent) {
        const event = document.createEvent('MouseEvents')
        event.initEvent('click', true, true)
        downloadEl.dispatchEvent(event)
      } else {
        downloadEl.click()
      }
    }
  },

  head() {
    return {
      title: `${this.datasetTitle} - Blackfynn Discover`,
      meta: [
        {
          name: 'DC.type',
          content: 'Dataset'
        },
        {
          name: 'DC.title',
          content: this.datasetTitle
        },
        {
          name: 'DC.description',
          content: this.datasetDescription
        },
        {
          name: 'DCTERMS.license',
          content: this.licenseLink
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:title',
          content: this.datasetTitle
        },
        {
          property: 'og:description',
          content: this.datasetDescription
        },
        {
          property: 'og:image',
          content: this.getDatasetImage
        },
        {
          property: 'og:image:alt',
          content: `${this.datasetTitle} Banner Image`
        },
        {
          property: 'og:site_name',
          content: 'Pennsieve Discover'
        },

        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:site',
          content: '@pennsieve1'
        },
        {
          name: 'twitter:description',
          content: this.datasetDescription
        },
        {
          name: 'twitter:image',
          content: this.getDatasetImage
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.header-image-section {
  .dataset-image {
    display: block;
    height: auto;
    width: 100%;
    @media (max-width: 48em) {
      max-width: 400px;
    }
    @media (min-width: 48em) {
      width: 100%;
    }
  }
}

.header-stats-section {
  border-top: 1px solid #dadada;
  border-bottom: 1px solid #dadada;
  margin: 26px 0 10px;
  padding: 10px 16px;
}

.header-stats-block {
  align-items: center;
  display: flex;
  a {
    &:focus {
      color: #1c46bd;
    }
  }
}

.dataset-header {
  padding-top: 56px;
  h1 {
    font-size: 32px;
    color: #000;
    font-weight: bold;
    margin-bottom: 24px;
    line-height: 40px;
    word-break: break-word;
    @media (min-width: 48em) {
      margin-top: 32px;
    }
  }
}
.dataset-description {
  color: #000;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 24px;
}

.dataset-owners {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  color: #404554;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 13px;
  .contributor-item-wrap {
    display: inline-flex;
    margin-right: 4px;
  }
}

.dataset-corresponding-contributor {
  display: inline-flex;
  flex-direction: row;

  p {
    margin-right: 3px;
  }
}

.dataset-updated-date {
  height: 24px;
  color: #404554;
  font-size: 14px;
  line-height: 24px;

  a {
    color: #404554;
    text-decoration: underline;
    &:hover,
    &:active,
    &:visited {
      color: #404554;
    }
    &:focus {
      color: black;
    }
  }
}

.get-dataset-button {
  font-weight: 600;
  line-height: 16px;
  font-size: 14px;
  background-color: #1f53e4;
  margin-top: 19px;

  &:focus {
    background-color: #1c46bd;
  }
  .svg-icon {
    margin-right: 8px;
  }
}
.header-link {
  color: #2760ff;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;

  &:focus {
    color: #1c46bd;
  }

  .header-link-icon {
    color: #2760ff;
    height: 10px;
    width: 10px;
    margin-bottom: 3px;
    margin-right: 8px;
  }
}

.contributors-button {
  height: 16px;
  width: 16px;
  border-radius: 2px;
  background-color: #dadada;
  margin: 0 6px;

  &:focus {
    background-color: #b6b7ba;
  }

  .button-text {
    position: relative;
    bottom: 5px;
  }
}
.requested-label {
  font-size: 16px;
  font-weight: 700;
  margin-top: 32px;
}
</style>
