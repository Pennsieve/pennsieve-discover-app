<template>
  <div class="dataset-details">
    <div class="discover-content container-fluid">
      <div class="file-info">
        <div v-for="f in files">
          <b>Name:</b><span>{{ f.name }}</span>
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
    <div class="discover-content container-fluid">
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
import { compose, head, prop, propOr, last, groupBy } from 'ramda'

import DateUtils from '@/mixins/format-date'

marked.setOptions({
  sanitize: true
})

export default {
  name: 'PackageDetails',

  components: {

  },

  mixins: [DateUtils],

  props: {
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

  },

  watch: {

  },

  methods: {

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

</style>
