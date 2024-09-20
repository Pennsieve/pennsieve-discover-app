<template>
  <div class="dataset-card">
    <div class="dataset-content">
      <div class="image mr-16">
        <dataset-banner-image :src="dataset.banner" />
      </div>
      <div class="dataset-content-wrap">
        <h3>
          <nuxt-link :to="{ name: 'datasets-id', params: { id: dataset.id } }">
            {{ dataset.name }}
          </nuxt-link>
        </h3>
        <div class="subtitle">
          {{ dataset.description }}
        </div>
        <div class="dataset-details-wrap mt-16">
          <div class="details">
            <div class="detail">
              <svg-icon name="icon-files" height="16" width="16" />
              <span v-if="dataset.fileCount > 0 && dataset.fileCount !== 1">
                <strong>{{ formatNumber(dataset.fileCount) }}</strong> Files
              </span>
              <span v-else-if="dataset.fileCount === 1">
                <strong>{{ dataset.fileCount }}</strong> File
              </span>
              <span v-else>No Files</span>
            </div>
            <div class="detail">
              <svg-icon name="icon-storage" height="16" width="16" />
              <strong>{{ formatMetric(dataset.size) }}</strong>
            </div>
            <div class="detail">
              <svg-icon name="icon-document" height="16" width="16" />
              <span v-if="dataset.recordCount > 0 && dataset.recordCount !== 1">
                <strong>{{ formatNumber(dataset.recordCount) }}</strong> Records
              </span>
              <span v-else-if="dataset.recordCount === 1">
                <strong>{{ dataset.recordCount }}</strong> Record
              </span>
              <span v-else>No Records</span>
            </div>
            <div class="detail">
              <svg-icon name="icon-license" height="16" width="16" />
              <span v-if="dataset.license === ''">No License</span>
              <el-tooltip
                v-else
                class="item"
                effect="dark"
                :content="dataset.license"
                placement="top"
                :visible-arrow="false"
              >
                <span>{{ licenseAbbreviation }}</span>
              </el-tooltip>
            </div>
            <div v-if="isCodeRepo" class="detail">
              <svg-icon name="icon-code-repo" height="16" width="16" />
              <span>
                <strong>Code Repo</strong> 
              </span>
            </div>
          </div>
          <div v-if="hasSponsor" class="dataset-sponsor">
            <h4>Sponsored{{ dataset.sponsorship.title ? ' by' : '' }}</h4>
            <p>{{ dataset.sponsorship.title }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="meta">
      <div v-if="!dataset.embargo" class="author">
        <strong>{{ datasetOwnerName }}</strong>
        updated on {{ lastUpdatedDate }}
      </div>
      <div v-else class="author">
        <strong>Dataset will be released on</strong> {{ getEmbargoReleaseDate }}
      </div>
      <div>github icon</div>
      <div v-if="dataset.tags.length > 3" class="tags">
        <strong>{{ firstThreeTags.join(', ') }}</strong>
        <nuxt-link
          :to="{
            name: 'datasets-id',
            params: {
              id: dataset.id
            }
          }"
        >
          +{{ firstThreeTags.count }}
          More
        </nuxt-link>
      </div>
      <div v-else class="tags">
        <strong>{{ dataset.tags.join(', ') }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import { propOr, take } from 'ramda'

import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'

import { getLicenseAbbr } from '@/utils/license-util'
import FormatMetric from '@/mixins/bf-storage-metrics'
import FormatDate from '@/mixins/format-date'

export default {
  name: 'DatasetCard',

  components: {
    DatasetBannerImage
  },

  mixins: [FormatDate, FormatMetric],

  props: {
    dataset: {
      type: Object,
      default: () => {
        return {
          arn: '',
          banner: '',
          contributors: [],
          createdAt: '',
          description: '',
          doi: '',
          embargo: false,
          embargoReleaseDate: null,
          fileCount: null,
          firstPublishedAt: '',
          id: null,
          license: '',
          modelCount: [],
          name: '',
          organizationName: '',
          ownerFirstName: '',
          ownerLastName: '',
          ownerOrcid: '',
          readme: '',
          recordCount: null,
          revisedAt: '',
          size: null,
          status: '',
          tags: [],
          type: 'release',
          updatedAt: '',
          uri: '',
          version: null,
          versionPublishedAt: ''
        }
      }
    }
  },
  computed: {
    /** Formats the embargoed release date
     * @returns {String}
     */
    getEmbargoReleaseDate() {
      return this.formatDate(this.dataset.embargoReleaseDate)
    },
    /**
     * Compute sponsor status for dataset
     * @returns {boolean}
     */
    hasSponsor() {
      return !!this.dataset.sponsorship
    },

    /**
     * Compute first three tags
     * @returns {Array}
     */
    firstThreeTags() {
      const tags = propOr([], 'tags', this.dataset)
      return take(3, tags)
    },

    /**
     * Compute abbreviation for license
     * @returns {String}
     */
    licenseAbbreviation() {
      const license = propOr('', 'license', this.dataset)
      return getLicenseAbbr(license)
    },

    /**
     * Compute the dataset owner's name
     * @returns {String}
     */
    datasetOwnerName() {
      const firstName = propOr('', 'ownerFirstName', this.dataset)
      const lastName = propOr('', 'ownerLastName', this.dataset)
      return `${firstName} ${lastName}`
    },

    /**
     * Get formatted last updated date
     * @return {String}
     */
    lastUpdatedDate() {
      const date = this.dataset.revisedAt || this.dataset.versionPublishedAt
      return this.formatDate(date)
    },

    isCodeRepo(){
      return this.dataset.type==="release"?true:false;
    }
    
  },

  methods: {
    /**
     * Formats the number to include commas
     * @param {String} number
     */
    formatNumber(number) {
      return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/_variables.scss';

.dataset-card {
  border: solid 1px $cortex;
  border-radius: 3px 3px 0 0;

}

.dataset-content-wrap {
  flex: 1;
}
h3 {
  color: #2760ff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 8px;
  word-break: break-word;
}

.subtitle {
  color: #000;
  font-size: 14px;
  font-weight: normal;
  line-height: 24px;
  margin-bottom: 16px;
}
.dataset-details-wrap {
  display: flex;
  flex-direction: column;
  @media (min-width: 992px) {
    align-items: flex-end;
    flex-direction: row;
  }
}
.details {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 11px;
  @media (min-width: 992px) {
    margin-bottom: 0;
  }
  .detail {
    align-items: center;
    display: flex;
    padding-right: 24px;
    color: #404554;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 16px;
    .svg-icon {
      margin-right: 8px;
    }
  }
}

.dataset-content {
  display: flex;
  flex-direction: row;
  padding: 24px 16px;

  img {
    display: block;
    width: 86px;
    height: 86px;
  }
}

.meta {
  border-top: solid 1px $cortex;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 16px;
  .author {
    font-size: 12px;
    line-height: 14px;
  }
  .tags {
    font-size: 12px;
    line-height: 14px;
  }
}

a {
  &:focus {
    color: #1c46bd;
  }
}
</style>
<style lang="scss">
.dataset-card {
  .dataset-sponsor {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    flex: .2;
    @media (min-width: 992px) {
      display: block;
    }
    h4 {
      color: #000;
      font-size: 12px;
      font-weight: 500;
      margin: 0 4px 0 0;
      @media (min-width: 992px) {
        margin: 0;
      }
    }
    p {
      margin: 0;
    }
  }
}
</style>
