<template>
  <div class="dataset-details">
    <div class="discover-content container-fluid">
      <dataset-header
        :dataset-details="datasetDetails"
        :versions="versions"
        :last-updated-date="lastUpdatedDate"
        :dataset-description="datasetDescription"
        :is-dataset-embargoed="isDatasetEmbargoed"
        :has-agreement="hasAgreement"
        :data-use-agreement="dataUseAgreement"
        @update-embargo-access="$emit('update-embargo-access', $event)"
      />
    </div>
    <div class="discover-content container-fluid">
      <h3 class="discover-content-title">
        Dataset Overview
      </h3>
      <div class="row">
        <!-- eslint-disable vue/no-v-html -->
        <!-- $sanitize will sanitize the HTML injected -->
        <div
          class="col-xs-12 col-md-8 description-container"
          v-html="parsedMarkdown"
        />

        <div
          v-if="!!datasetDetails.sponsorship"
          class="col-xs-12 col-md-4 first-xs last-md"
        >
          <sponsor-card :sponsorship="datasetDetails.sponsorship" />
        </div>
      </div>
      <dataset-files
        :is-embargoed="isDatasetEmbargoed"
        :embargoed-release-date="embargoedReleaseDate"
        :version="currentVersion"
        :dataset-id="datasetId"
      />
    </div>
    <div class="dataset-info">
      <div class="discover-content container-fluid dataset-info-container">
        <div class="row">
          <div class="col-xs-12">
            <h2>
              About this dataset
            </h2>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h3>
              Publishing history
            </h3>
          </div>
        </div>
        <div class="row mb-24">
          <div class="col-xs-12 info-publishing-history">
            <div class="info-text">
              {{ firstVersionPublishedDate }}
              <div class="info-text-caps">
                Originally Published
              </div>
            </div>
            <div class="info-text">
              {{ lastUpdatedDate }} (Version {{ datasetDetails.version }})
              <div class="info-text-caps">
                Last Updated
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-24">
          <div class="col-xs-12">
            <h3>
              DOI
            </h3>
            <p class="info-text">
              <a :href="DOIlink" target="_blank">{{ DOIlink }}</a>
            </p>
          </div>
        </div>
        <div class="row share-dataset">
          <div class="col-xs-12">
            <h3>
              Share this dataset
            </h3>
          </div>
        </div>
        <div class="row mb-24">
          <div class="col-xs-12">
            <div class="info-icons">
              <social-sharing
                class="social-media-share-icons"
                aria-live="polite"
                :url="siteUrl"
                :title="datasetDetails.title"
                :description="datasetDescription"
                inline-template
              >
                <div>
                  <network network="linkedin">
                    <button title="Share on Linkedin">
                      <svg-icon
                        class="icon-linkedin"
                        name="icon-linkedin"
                        title="Linkedin Icon"
                        color="#fff"
                        height="18"
                        width="18"
                      />
                    </button>
                  </network>
                  <network network="twitter">
                    <button title="Share on Twitter">
                      <svg-icon
                        class="icon-twitter"
                        name="icon-twitter"
                        title="Twitter Icon"
                        color="#fff"
                        height="18"
                        width="18"
                      />
                    </button>
                  </network>
                </div>
              </social-sharing>
              <button
                v-clipboard:copy="siteUrl"
                v-clipboard:success="onCopySuccess"
                title="Copy URL to clipboard"
              >
                <svg-icon
                  title="Copy To Clipboard Icon"
                  class="icon-upload"
                  name="icon-upload"
                  color="#fff"
                  height="18"
                  width="18"
                />
              </button>
              <transition name="fade" @after-enter="showCopySuccess = false">
                <span v-if="showCopySuccess" class="copy-success-notification">
                  Copied URL to clipboard
                </span>
              </transition>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h3>
              Cite this dataset
            </h3>
            <div v-if="hasCitationError" class="info-citation">
              <p class="mb-0">
                Sorry, an error has occurred.
                <a
                  href="#"
                  @click.prevent="handleCitationChanged(activeCitation)"
                >
                  Try again
                </a>
              </p>
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <!-- $sanitize will sanitize the HTML injected -->
            <div
              v-else
              v-loading="citationLoading"
              class="info-citation"
              aria-live="polite"
              v-html="$sanitize(citationText, ['i'])"
            />
            <div class="info-citation-links mb-24">
              Formatted as:
              <button
                title="Format citation apa"
                :class="{ active: activeCitation === 'apa' }"
                @click="handleCitationChanged('apa')"
              >
                APA
              </button>
              |
              <button
                title="Format citation chicago"
                :class="{
                  active: activeCitation === 'chicago-note-bibliography'
                }"
                @click="handleCitationChanged('chicago-note-bibliography')"
              >
                Chicago
              </button>
              |
              <button
                title="Format citation ieee"
                :class="{ active: activeCitation === 'ieee' }"
                @click="handleCitationChanged('ieee')"
              >
                IEEE
              </button>
              |
              <a
                :href="`https://crosscite.org/?doi=${datasetDetails.doi}`"
                target="_blank"
              >
                More on Crosscite.org
              </a>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h3>Tags</h3>
            <tag-list :tags="datasetTags" />
          </div>
        </div>

        <div v-if="isDataUseAgreementVisible" class="row mt-24">
          <div class="col-xs-12">
            <h3>Data Use Agreement</h3>
            <p class="info-text sub-text">
              This dataset is not publicly available. You have access to this
              dataset under the following
              <a
                href="#"
                @click.prevent="isDataUseAgreementSignDialogVisible = true"
                >Data Use Agreement</a
              >.
            </p>

            <data-use-agreement-sign-dialog
              :visible.sync="isDataUseAgreementSignDialogVisible"
              :data-use-agreement="dataUseAgreement"
              :is-signing-agreement="false"
              @download="downloadAgreement"
            />
          </div>
        </div>

        <div
          v-if="datasetDetails.externalPublications.length"
          class="row mt-24"
        >
          <div class="col-xs-12">
            <h3>References</h3>
            <div
              v-for="referenceType in Object.keys(groupedReferences)"
              :key="referenceType"
            >
              <h4>
                {{ referenceHeading(referenceType) }}
              </h4>
              <external-publication-list-item
                v-for="pub in groupedReferences[referenceType]"
                :key="pub.doi"
                class="mb-16"
                :publication="pub"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <dataset-version-message
      v-if="!isLatestVersion || isDatasetEmbargoed"
      :current-version="currentVersion"
      :dataset-details="datasetDetails"
    />
  </div>
</template>

<script>
import marked from 'marked'
import { compose, head, prop, propOr, last, groupBy } from 'ramda'

import DatasetHeader from '@/components/DatasetHeader/DatasetHeader.vue'
import DatasetFiles from '@/components/DatasetFiles/DatasetFiles.vue'
import TagList from '@/components/TagList/TagList.vue'
import SponsorCard from '@/components/SponsorCard/SponsorCard.vue'
import DatasetVersionMessage from '@/components/DatasetVersionMessage/DatasetVersionMessage'
import DataUseAgreementSignDialog from '@/components/DataUseAgreementSignDialog/DataUseAgreementSignDialog.vue'
import ExternalPublicationListItem from '@/components/ExternalPublicationListItem/ExternalPublicationListItem'

import DateUtils from '@/mixins/format-date'

import { getLicenseLink, getLicenseAbbr } from '@/utils/license-util'
import { EMBARGO_ACCESS, referenceTypeOptions } from '@/utils/constants'

marked.setOptions({
  sanitize: true
})

export default {
  name: 'DatasetDetails',

  components: {
    DatasetHeader,
    DatasetFiles,
    TagList,
    SponsorCard,
    DatasetVersionMessage,
    DataUseAgreementSignDialog,
    ExternalPublicationListItem
  },

  mixins: [DateUtils],

  props: {
    showSignupFooter: {
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
    },
    markdown: {
      type: String,
      default: ''
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
      citationText: '',
      activeCitation: '',
      showCopySuccess: false,
      citationLoading: false,
      marked,
      isTombStone: false,
      hasCitationError: false,
      isDataUseAgreementSignDialogVisible: false,
      referenceTypeOptions
    }
  },
  computed: {
    /**
     * Compute if the dataset is embargoed, has an agreement and
     * the user has access to the dataset (signed that agreement)
     * @returns {Boolean}
     */
    isDataUseAgreementVisible() {
      return (
        this.isDatasetEmbargoed &&
        this.hasAgreement &&
        this.datasetDetails.embargoAccess === EMBARGO_ACCESS.GRANTED
      )
    },

    /**
     * Groups references
     * @returns {Array}
     */
    groupedReferences() {
      return groupBy(
        (item) => item.relationshipType,
        this.datasetDetails.externalPublications
      )
    },

    /**
     * Checks if dataset is embargoed
     * @returns {Boolean}
     */
    isDatasetEmbargoed() {
      return this.datasetDetails.embargo
    },

    /**
     * Get formatted embargoed date
     * @return {String}
     */
    embargoedReleaseDate() {
      const date = propOr('', 'embargoReleaseDate', this.datasetDetails)
      return this.formatCalendarDate(date)
    },

    /**
     * Compute the url of the site
     * This needs to be part of the Vue data so it can be passed
     * to the social-sharing vue component
     * @returns {String}
     */
    siteUrl() {
      let ShareUrl = process.env.siteUrl
      ShareUrl += '/datasets/'
      const ShareID = propOr(0, 'id', this.datasetDetails)
      const ShareVersion = prop('version', this.datasetDetails)
      const ShareVersion2 = String(ShareVersion)
      const ShareID2 = String(ShareID)
      ShareUrl += ShareID2
      ShareUrl += '/version/'
      ShareUrl += ShareVersion2
      return ShareUrl
    },

    /**
     * Compute the dataset ID
     * @returns {Number}
     */
    datasetId() {
      return propOr(0, 'id', this.datasetDetails)
    },

    /**
     * Parses the markdown text
     */
    parsedMarkdown() {
      return marked(this.markdown)
    },

    /**
     * Get formatted originally published date
     * @return {String}
     */
    originallyPublishedDate() {
      const date = propOr('', 'firstPublishedAt', this.datasetDetails)
      return this.formatDate(date)
    },

    /**
     * Gets the originally published date of the first version of the dataset
     */
    firstVersionPublishedDate() {
      const firstVersion = last(this.versions)
      const date = propOr('', 'versionPublishedAt', firstVersion)
      return this.formatDate(date)
    },

    /**
     * Get formatted last updated date
     * @return {String}
     */
    lastUpdatedDate() {
      const date =
        this.datasetDetails.revisedAt || this.datasetDetails.versionPublishedAt
      return this.formatDate(date)
    },
    /**
     * Returns list of tags for dataset
     * @returns {Array}
     */
    datasetTags() {
      return propOr([], 'tags', this.datasetDetails)
    },
    /**
     * Return DOI link
     * @returns {String}
     */
    DOIlink() {
      const doi = propOr('', 'doi', this.datasetDetails)
      return doi ? `https://doi.org/${doi}` : ''
    },

    /**
     * Compute latest version of the dataset
     * @returns {Number}
     */
    latestVersion() {
      return compose(propOr(1, 'version'), head)(this.versions)
    },

    /**
     * Compute if the dataset is the latest version
     * @returns {Boolean}
     */
    isLatestVersion() {
      if (this.versions.length) {
        return this.currentVersion === this.latestVersion
      }

      return true
    },

    /**
     * Compute current version of the dataset
     * @returns {Boolean}
     */
    currentVersion() {
      return prop('version', this.datasetDetails)
    },

    /**
     * Compute description
     * @returns {String}
     */
    datasetDescription() {
      return propOr('', 'description', this.datasetDetails)
    },

    /**
     * Compute name
     * @returns {String}
     */
    datasetName() {
      return propOr('', 'name', this.datasetDetails)
    },

    /**
     * Compute organization name
     * @returns {String}
     */
    organizationName() {
      return propOr('', 'organizationName', this.datasetDetails)
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
     * Returns the list of contributors who contributed to the dataset
     * @returns {String}
     */
    datasetContributors() {
      return propOr([], 'contributors', this.datasetDetails)
    },

    /**
     * Gets license link
     * @returns {String}
     */
    licenseLink() {
      return getLicenseLink(this.datasetLicense)
    }
  },

  watch: {
    DOIlink: {
      handler(val) {
        if (val) {
          this.handleCitationChanged('apa')
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * Get reference heading by value
     * @TODO optimize
     * @params {String} referenceType
     */
    referenceHeading(referenceType) {
      return referenceTypeOptions[referenceType] || 'References'
    },
    /**
     * Confirms that url of dataset was copied successfully
     * and sets boolean to true
     */
    onCopySuccess() {
      this.showCopySuccess = true
    },
    /**
     * gets bibiolography based on citation type for current DOI
     * @param {String} citationType
     */
    handleCitationChanged(citationType) {
      this.citationLoading = true
      this.hasCitationError = false
      this.activeCitation = citationType

      // find all citation types at https://github.com/citation-style-language/styles
      const doi = propOr('', 'doi', this.datasetDetails)
      const url = `https://citation.crosscite.org/format?doi=${doi}&style=${citationType}&lang=en-US`
      return fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            throw Error
          }
          return response.text()
        })
        .then((text) => {
          this.citationText = text
        })
        .catch(() => {
          this.hasCitationError = true
        })
        .finally(() => {
          this.citationLoading = false
        })
    },

    /**
     * Download the agreement
     */
    downloadAgreement() {
      const url = `${process.env.discover_api_host}/datasets/${this.datasetDetails.id}/data-use-agreement/download`
      this.isDataUseAgreementSignDialogVisible = false

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
    // Creator data
    const org = [
      {
        '@type': 'Organization',
        name: this.organizationName
      }
    ]
    const contributors = this.datasetContributors.map((contributor) => {
      const sameAs = contributor.orcid
        ? `http://orcid.org/${contributor.orcid}`
        : null

      return {
        '@type': 'Person',
        sameAs,
        givenName: contributor.firstName,
        familyName: contributor.lastName,
        name: `${contributor.firstName} ${contributor.lastName}`
      }
    })

    const creators = contributors.concat(org)

    return {
      meta: [
        {
          name: 'DC.creator',
          content: JSON.stringify(creators)
        },
        {
          name: 'DC.identifier',
          content: this.DOIlink,
          scheme: 'DCTERMS.URI'
        },
        {
          name: 'DC.publisher',
          content: 'Pennsieve Discover'
        },
        {
          name: 'DC.date',
          content: this.originallyPublishedDate,
          scheme: 'DCTERMS.W3CDTF'
        },
        {
          name: 'DC.version',
          content: this.currentVersion
        },
        {
          name: 'DC.identifier',
          content: process.env.siteUrl,
          scheme: 'DCTERMS.URI'
        },
        {
          property: 'og:url',
          content: process.env.siteUrl
        }
      ],
      script: [
        {
          vmid: 'ldjson-schema',
          json: {
            '@context': 'http://schema.org',
            '@type': 'Dataset',
            '@id': this.DOIlink,
            name: this.datasetName,
            creator: creators,
            datePublished: this.datasetDetails.versionPublishedAt,
            dateModified: this.lastUpdatedDate,
            description: this.datasetDescription,
            license: this.licenseLink,
            version: this.currentVersion,
            url: process.env.siteUrl,
            citation: this.citationText,
            identifier: this.DOIlink,
            isAccessibleForFree: true
          },
          type: 'application/ld+json'
        },
        {
          vmid: 'ldjson-schema',
          json: {
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            url: process.env.siteUrl,
            name: 'Pennsieve Discover'
          },
          type: 'application/ld+json'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/_variables.scss';
.dataset-details {
  background-color: #ffffff;
}

.discover-content-title {
  color: $myelin;
  font-size: 16px;
  font-weight: 500;
  line-height: 40px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 32px;
}

.copy-success-notification {
  color: #fff;
  margin-left: 5px;
}

.fade-leave-active {
  transition: opacity 0.5s ease-out 2s;
}

.fade-enter {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.dataset-details {
  width: 100%;
  overflow-x: hidden;

  .dataset-info {
    background-color: #414553;
    padding-bottom: 64px;
  }
}

// Markdown styles
.description-container {
  color: #000;
  font-size: 16px;
  line-height: 24px;
  padding-top: 32px;

  ::v-deep {
    h1,
    p,
    h2,
    h3,
    blockquote,
    h4,
    pre {
      max-width: 616px;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      margin: 0 0 8px;
    }

    h1 {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
    }

    p {
      margin-bottom: 16px;
    }

    img {
      height: auto;
      max-width: 170%;
      margin-bottom: 20px;
      flex-basis: 50%;
      margin-top: 24px;
    }

    h2 {
      font-size: 24px;
      font-weight: bold;
      line-height: 32px;
    }

    h3 {
      font-size: 20px;
      font-weight: bold;
      line-height: 24px;
      letter-spacing: 0px;
    }

    h4 {
      font-size: 16px;
      font-weight: bold;
      line-height: 24px;
      text-transform: uppercase;
      letter-spacing: 0px;
    }

    ul {
      margin: 0 0 16px;
      padding: 0 0 0 18px;
    }

    blockquote {
      font-weight: normal;
      line-height: 24px;
      font-size: 16px;
      border-left: 8px solid $dopamine-dark;
      margin-left: 0;

      p {
        margin-left: 16px;
      }
    }
    pre {
      background-color: #f1f1f3;
      line-height: 24px;
      padding: 16px;

      code {
        font-weight: normal;
        font-size: 14px;
      }
    }
  }
}

// Footer styles
h2 {
  height: 32px;
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  line-height: 32px;
  margin: 56px 0 24px;
}

h3 {
  height: 16px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  margin: 0 0 16px;
}

h4 {
  color: white;
}

.info-icons {
  .social-media-share-icons {
    display: inline-block;
  }
  ::v-deep span {
    margin-right: 24px;
  }
  // components within inline-templates do not correctly get the parent components css scope, need to use ::v-deep
  button {
    cursor: pointer;
  }
}

.info-publishing-history {
  @media (min-width: 48em) {
    display: flex;
  }
  .info-text {
    margin-right: 90px;
  }
}

.info-text {
  color: #ffffff;
  font-size: 14px;
  line-height: 24px;

  a {
    color: #ffffff;
    text-decoration: underline;
  }

  &.sub-text,
  &.sub-text a {
    color: #cfdbfc;
  }

  .info-text-caps {
    text-transform: uppercase;
    color: #cddaff;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }
}

.info-citation {
  border-radius: 4px;
  background-color: #cddaff;
  padding: 16px;
  color: $dopamine;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 8px;
}

.info-citation-links {
  font-size: 14px;
  line-height: 16px;
  padding-left: 16px;
  color: #cddaff;

  button,
  a {
    color: #cddaff;
    line-height: 16px;
    text-decoration: underline;
    font-size: 14px;
    cursor: pointer;

    &.active {
      text-decoration: none;
      color: #ffffff;
    }
  }
}
.sponsor-card {
  margin-top: 16px;
  @media only screen and (min-width: 62em) {
    margin-top: 0;
  }
}
</style>
