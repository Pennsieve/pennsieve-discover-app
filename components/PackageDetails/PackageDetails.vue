<template>
  <div class="dataset-details">
    <div class="container-fluid">
      <div class="row mb-8">
        <div class="col-xs-12 header-link" @click="goToPrev()">
            <svg-icon name="icon-arrow-left" class="header-link-icon" />
            Back to dataset
        </div>
      </div>
      <div class="package-content">
        <div>
          <h3 class="package-content-title">
            {{headerContent}}
          </h3>
        </div>
<!--        <div>-->
<!--          <bf-button-->
<!--            key="btn-get-dataset"-->
<!--            class="get-dataset-button"-->
<!--            @click="getDataset"-->
<!--          >-->
<!--            {{downloadContent}}-->
<!--          </bf-button>-->
<!--        </div>-->

      </div>
      <div class="file-info">
        <div v-for="f in files">
          <b>Name: </b><span>{{ f.name }}</span>
        </div>

      </div>



      <!--      <dataset-header-->
<!--        :dataset-details="datasetDetails"-->
<!--        :versions="versions"-->
<!--        :last-updated-date="lastUpdatedDate"-->
<!--        :dataset-description="datasetDescription"-->
<!--        :is-dataset-embargoed="isDatasetEmbargoed"-->
<!--        :has-agreement="hasAgreement"-->
<!--        :data-use-agreement="dataUseAgreement"-->
<!--        @update-embargo-access="$emit('update-embargo-access', $event)"-->
<!--      />-->
    </div>
    <div class="container-fluid">
<!--      <h3 class="discover-content-title">-->
<!--        Dataset Overview-->
<!--      </h3>-->
<!--      <div class="row">-->
<!--        &lt;!&ndash; eslint-disable vue/no-v-html &ndash;&gt;-->
<!--        &lt;!&ndash; $sanitize will sanitize the HTML injected &ndash;&gt;-->
<!--        <div-->
<!--          class="col-xs-12 col-md-8 description-container"-->
<!--          v-html="parsedMarkdown"-->
<!--        />-->

<!--        <div-->
<!--          v-if="!!datasetDetails.sponsorship"-->
<!--          class="col-xs-12 col-md-4 first-xs last-md"-->
<!--        >-->
<!--          <sponsor-card :sponsorship="datasetDetails.sponsorship" />-->
<!--        </div>-->
<!--      </div>-->
<!--      <dataset-files-->
<!--        :is-embargoed="isDatasetEmbargoed"-->
<!--        :embargoed-release-date="embargoedReleaseDate"-->
<!--        :version="currentVersion"-->
<!--        :dataset-id="datasetId"-->
<!--      />-->
    </div>

<!--    <dataset-version-message-->
<!--      v-if="!isLatestVersion || isDatasetEmbargoed"-->
<!--      :current-version="currentVersion"-->
<!--      :dataset-details="datasetDetails"-->
<!--    />-->
  </div>
</template>

<script>
import marked from 'marked'
import BfButton from '../shared/BfButton/BfButton.vue'

import { compose, head, prop, propOr, last, groupBy } from 'ramda'

import DateUtils from '@/mixins/format-date'

marked.setOptions({
  sanitize: true
})

export default {
  name: 'PackageDetails',

  components: {
    BfButton

  },

  mixins: [DateUtils],

  props: {
    datasetId: {
      type: Number,
      default: 0
    },
    files: {
      type: Array,
      default: () => []
    },

  },

  data() {
    return {


    }
  },

  computed: {
    headerContent() {
      return this.files.length > 1 ? "Package Files": "File Details"
    },
    downloadContent() {
      return this.files.length > 1 ? "Download Package": "Download File"
    }

  },

  watch: {

  },

  methods: {
    goToPrev() {

      // ...
      // Do other logic like logging, etc.
      // ...

      // Tell router to go back one
      this.$router.go(-1);
    },

  },

  head() {
    // // Creator data
    // const org = [
    //   {
    //     '@type': 'Organization',
    //     name: this.organizationName
    //   }
    // ]
    // const contributors = this.datasetContributors.map((contributor) => {
    //   const sameAs = contributor.orcid
    //     ? `http://orcid.org/${contributor.orcid}`
    //     : null
    //
    //   return {
    //     '@type': 'Person',
    //     sameAs,
    //     givenName: contributor.firstName,
    //     familyName: contributor.lastName,
    //     name: `${contributor.firstName} ${contributor.lastName}`
    //   }
    // })
    //
    // const creators = contributors.concat(org)
    //
    // return {
    //   meta: [
    //     {
    //       name: 'DC.creator',
    //       content: JSON.stringify(creators)
    //     },
    //     {
    //       name: 'DC.identifier',
    //       content: this.DOIlink,
    //       scheme: 'DCTERMS.URI'
    //     },
    //     {
    //       name: 'DC.publisher',
    //       content: 'Pennsieve Discover'
    //     },
    //     {
    //       name: 'DC.date',
    //       content: this.originallyPublishedDate,
    //       scheme: 'DCTERMS.W3CDTF'
    //     },
    //     {
    //       name: 'DC.version',
    //       content: this.currentVersion
    //     },
    //     {
    //       name: 'DC.identifier',
    //       content: process.env.siteUrl,
    //       scheme: 'DCTERMS.URI'
    //     },
    //     {
    //       property: 'og:url',
    //       content: process.env.siteUrl
    //     }
    //   ],
    //   script: [
    //     {
    //       vmid: 'ldjson-schema',
    //       json: {
    //         '@context': 'http://schema.org',
    //         '@type': 'Dataset',
    //         '@id': this.DOIlink,
    //         name: this.datasetName,
    //         creator: creators,
    //         datePublished: this.datasetDetails.versionPublishedAt,
    //         dateModified: this.lastUpdatedDate,
    //         description: this.datasetDescription,
    //         license: this.licenseLink,
    //         version: this.currentVersion,
    //         url: process.env.siteUrl,
    //         citation: this.citationText,
    //         identifier: this.DOIlink,
    //         isAccessibleForFree: true
    //       },
    //       type: 'application/ld+json'
    //     },
    //     {
    //       vmid: 'ldjson-schema',
    //       json: {
    //         '@context': 'http://schema.org',
    //         '@type': 'WebSite',
    //         url: process.env.siteUrl,
    //         name: 'Pennsieve Discover'
    //       },
    //       type: 'application/ld+json'
    //     }
    //   ]
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/_variables.scss';

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
  flex-direction: row ;
  justify-content: space-between;
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
