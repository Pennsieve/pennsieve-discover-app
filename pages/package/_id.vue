<template>
  <div class="package-details">
    <bf-header :isSearchVisible="false"/>

    <package-details
      class="package-details-content"
      :files="packageFiles.files"
    />
    <pennsieve-viewer
      class="pennsieve-viewer"
      :pkg="sourcePackage"
      :pkgType="packageType"
    />

<!--    <bf-footer />-->
  </div>
</template>

<script>
import { propOr, pathOr } from 'ramda'

import BfFooter from '@/components/shared/BfFooter/BfFooter.vue'
import BfHeader from '@/components/shared/BfHeader/BfHeader.vue'
import PackageDetails from "~/components/PackageDetails/PackageDetails";
import PennsieveViewer from "~/components/viewers/PennsieveViewer/PennsieveViewer";

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
    PackageDetails,
    PennsieveViewer
  },

  props: {
  },

  async asyncData({ $axios, params, error, req, $cookies }) {
    const packageFiles = await getPackageFiles(params, $axios, $cookies)
    const sourcePackage = params.id

    let packageType = "None"
    if (packageFiles.files) {
      packageType = packageFiles.files[0].packageType
    }


    return {
      sourcePackage,
      packageFiles,
      packageType
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

.package-details {
  display:flex;
  flex-direction: column;
}

.package-details-content  {
}

.pennsieve-viewer {
  display: flex;
}

</style>
