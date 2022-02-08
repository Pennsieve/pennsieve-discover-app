<template>
  <div class="package-details">
    <bf-header :isSearchVisible="false"/>

    <package-details
      class="package-details-content"
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
import { mapState,mapActions } from 'vuex'
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
    ...mapState['selectedPackage']
  },

  async asyncData({ $axios, params, error, req, $cookies }) {
    const sourcePackage = params.id
    let packageFiles = {files:[]}
    let packageType = "None"
    if (params.id !== 'details') {
      packageFiles = await getPackageFiles(params, $axios, $cookies)

      if (packageFiles.files) {
        packageType = packageFiles.files[0].packageType
      }
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

  mounted() {
    this.$nextTick(function () {
      if (this.packageFiles.files.length > 0) {
        // Get DatasetId and version from first file in package
        const expr = /s3:\/\/[a-z-1]+\/([0-9]+)\/([0-9]+)\/(.*)/
        const match = this.packageFiles.files[0].uri.match(expr)
        const datasetId = match[1]
        const version = match[2]
        this.setSelectedPackage({
          datasetId: datasetId,
          version: version,
          files: this.packageFiles.files})
      }
    })
  },

  methods: {
    ...mapActions(['setSelectedPackage'])

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
