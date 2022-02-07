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
        <div class="button-row">
          <h3 class="package-content-title">
            {{headerContent}}
          </h3>
          <div>
            <bf-button
              key="btn-get-dataset"
              class="get-dataset-button"
              @click="onDownloadClick"
            >
              {{downloadContent}}
            </bf-button>
          </div>
        </div>


        <div class="file-info">
          <div v-for="f in files">
            <b>Name: </b><span>{{ f.name }}</span>
          </div>
        </div>

        <h3 class="package-content-title">
          Viewer
        </h3>

      </div>
    </div>
    <form id="zipForm" method="POST" :action="zipitUrl">
      <input v-model="zipData" type="hidden" name="data" />
    </form>
  </div>
</template>

<script>
import marked from 'marked'
import BfButton from '../shared/BfButton/BfButton.vue'

import { compose, head, prop, propOr, last, groupBy } from 'ramda'

import DateUtils from '@/mixins/format-date'
import {mapState} from "vuex";

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
      zipData: '',
    }
  },

  computed: {
    ...mapState(['selectedPackage', 'userToken']),

    headerContent() {
      return this.files.length > 1 ? "Package Files": "File Details"
    },
    downloadContent() {
      return this.files.length > 1 ? "Download Package": "Download File"
    },
    zipitUrl() {
      return `${process.env.zipit_host}`
    },

  },

  watch: {

  },

  methods: {
    goToPrev() {
      // Tell router to go back one
      this.$router.go(-1);
    },

    onDownloadClick() {
      this.executeDownload()
      // if (this.shouldConfirmDownload) {
      //   this.showReduceSize = this.downloadDisabled
      //   this.confirmDownloadVisible = true
      // } else {
      //   this.executeDownload()
      // }
    },

    confirmDownload() {
      this.downloadConfirmed = true
      this.onDownloadClick()
    },

    executeDownload() {
      const mainPayload = {
        // paths: this.selectedPackage.fmap((f) => {
        //   const expr = /(s3:\/\/[a-z-1]+\/[0-9]+\/[0-9]+\/)(.*)/
        //   const match = f.uri.match(expr)
        //   return match[2]
        // }),
        paths: [this.selectedPackage.package.path],
        datasetId: this.selectedPackage.datasetId,
        version: this.selectedPackage.version,
        userToken: this.userToken
      }

      // const [, ...path] = this.filePath
      const rootPathPayload = {} // path ? { rootPath: path.join('/') } : {}
      const archiveNamePayload =
        this.archiveName && this.selected.length > 1
          ? { archiveName: this.archiveName }
          : {}

      const payload = {
        ...mainPayload,
        ...rootPathPayload,
        ...archiveNamePayload
      }
      this.zipData = JSON.stringify(payload, undefined)
      this.$nextTick(() => {
        zipForm.submit() // eslint-disable-line no-undef
      })
    },

  },

  head() {
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
  flex-direction: column ;
  justify-content: space-between;

  .button-row {
    display:flex;
    flex-direction: row;
    justify-content: space-between;
  }
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
