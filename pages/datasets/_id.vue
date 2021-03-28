<template>
  <div class="dataset-details">
    <bf-header />

    <dataset-details
      v-if="isTombStone === false"
      :dataset-details="datasetDetails"
      :versions="versions"
      :markdown="markdown"
      :has-agreement="hasAgreement"
      :data-use-agreement="dataUseAgreement"
      @update-embargo-access="updateEmbargoAccess"
    />

    <dataset-tombstone
      v-else
      :dataset-details="datasetDetails"
      :versions="versions"
    />

    <bf-footer />
  </div>
</template>

<script>
import { propOr, pathOr } from 'ramda'

import Cookies from 'js-cookie'
import BfFooter from '@/components/shared/BfFooter/BfFooter.vue'
import BfHeader from '@/components/shared/BfHeader/BfHeader.vue'
import DatasetDetails from '@/components/DatasetDetails/DatasetDetails.vue'
import DatasetTombstone from '@/components/DatasetTombstone/DatasetTombstone.vue'

/**
 * Get agreement for dataset
 * @param {Object} dataset
 * @param {Object} $axios
 * @returns {Promise}
 */
const getAgreement = async (dataset, $axios) => {
  try {
    const agreement = await $axios
      .get(
        `${process.env.discover_api_host}/datasets/${dataset.id}/data-use-agreement`
      )
      .then((response) => {
        const hasAgreement = response.status === 200
        const dataUseAgreement = response.status === 200 ? response.data : {}
        return {
          hasAgreement,
          dataUseAgreement
        }
      })
      .catch((error) => {
        throw error
      })

    return agreement
  } catch (error) {
    return {
      hasAgreement: false,
      dataUseAgreement: {}
    }
  }
}

/**
 * Generate the url with token from cookies
 * @param {String} url
 * @returns {String}
 */
const generateUrlWithToken = (url) => {
  const token = Cookies.get('user_token')
  return token ? `${url}?api_key=${token}` : url
}

/**
 * Get dataset
 * @param {Object} params
 * @param {Object} $axios
 * @returns {Object}
 */
const getDataset = (params, $axios) => {
  try {
    const url = `${process.env.discover_api_host}/datasets/${params.id}`
    let fullUrl = params.version ? `${url}/versions/${params.version}` : url
    fullUrl = generateUrlWithToken(fullUrl)

    return $axios
      .$get(fullUrl)
      .then((response) => {
        return { datasetDetails: response }
      })
      .catch((error) => {
        if (error.response.status === 410) {
          const dataset = error.response.data

          return {
            isTombStone: true,
            datasetDetails: dataset
          }
        }
      })
  } catch (error) {
    if (error.response.status === 410) {
      const dataset = error.response.data

      return {
        isTombStone: true,
        datasetDetails: dataset
      }
    }

    return {
      datasetDetails: {}
    }
  }
}

/**
 * Get all the versions of the datasets
 * @param {Object} params
 * @param {Object} $axios
 * @returns {Object}
 */
const getDatasetVersions = (params, $axios) => {
  try {
    const url = generateUrlWithToken(
      `${process.env.discover_api_host}/datasets/${params.id}/versions`
    )
    return $axios.$get(url).then((response) => {
      return response.sort((a, b) => a.verson - b.version)
    })
  } catch (error) {
    return []
  }
}

/**
 * Get readme for the dataset
 * @param {Object} dataset
 * @param {Object} $axios
 * @returns {Object}
 */
const getReadme = (dataset, $axios) => {
  try {
    const readme = pathOr('', ['datasetDetails', 'readme'], dataset)
    return $axios.$get(readme, {
      responseType: 'text'
    })
  } catch (error) {
    return {}
  }
}

export default {
  name: 'DatasetDetailsView',

  components: {
    BfFooter,
    BfHeader,
    DatasetDetails,
    DatasetTombstone
  },

  props: {
    showSignupFooter: {
      type: Boolean,
      default: true
    }
  },

  async asyncData({ $axios, params, error, req }) {
    const dataset = await getDataset(params, $axios)

    const versions = await getDatasetVersions(params, $axios)

    const { hasAgreement, dataUseAgreement } = await getAgreement(
      dataset.datasetDetails,
      $axios
    )

    const markdown = await getReadme(dataset, $axios)

    return {
      ...dataset,
      versions,
      markdown,
      hasAgreement,
      dataUseAgreement
    }
  },

  data() {
    return {
      datasetDetails: {},
      versions: [],
      markdown: '',
      isTombStone: false
    }
  },

  computed: {
    /**
     * Returns the dataset title
     * @returns {String}
     */
    datasetTitle() {
      return propOr('', 'name', this.datasetDetails)
    }
  },

  methods: {
    /**
     * Update embargo access
     * @param {String} access
     */
    updateEmbargoAccess(access) {
      this.datasetDetails = {
        ...this.datasetDetails,
        embargoAccess: access
      }
    }
  },

  head() {
    return {
      title: this.datasetTitle
    }
  }
}
</script>

<style lang="scss" scoped>
.dataset-details {
  background-color: #ffffff;
}
</style>
