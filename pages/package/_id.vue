<template>
  <div class="package-details">
    <bf-header :isSearchVisible="false"/>
    <package-details
      :files="packageFiles.files"
    />


    <bf-footer />
  </div>
</template>

<script>
import { propOr, pathOr } from 'ramda'

import BfFooter from '@/components/shared/BfFooter/BfFooter.vue'
import BfHeader from '@/components/shared/BfHeader/BfHeader.vue'
import PackageDetails from "~/components/PackageDetails/PackageDetails";

const getPackageFiles = (params, $axios, $cookies) => {
  try {
    const url = `${process.env.discover_api_host}/packages/${params.id}/files`

    return $axios
      .$get(url)
      .then((response) => {
        return response
      })

  } catch (error) {
    return {
      files: {}
    }
  }
}

export default {
  name: 'DatasetDetailsView',

  components: {
    BfFooter,
    BfHeader,
    PackageDetails
  },

  props: {
  },

  async asyncData({ $axios, params, error, req, $cookies }) {
    const packageFiles = await getPackageFiles(params, $axios, $cookies)

    return {
      packageFiles
    }
  },

  data() {
    return {

    }
  },

  computed: {

  },

  methods: {

  },

  head() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
