<template>
  <div
    class="discover-home body-wrap"
    :class="{ 'filters-visible': isFiltersVisible }"
  >
    <bf-header :is-search-visible="false" />
    <div class="body-content-wrap">
      <div class="header-feature">
        <div class="discover-content container-fluid">
          <div class="row">
            <div class="col-xs-12">
              <h1>Find and access public scientific datasets.</h1>
              <p>
                Explore scientific data from the world's leading institutions
                and researchers with Pennsieve Discover.
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-10">
              <dataset-search />
            </div>
          </div>
        </div>
        <img
          src="~/assets/images/illustrations/illo-neuron-mural.svg"
          alt="Nueron Mural Image"
        />
      </div>
      <div class="discover-content container-fluid">
        <div class="row">
          <div class="col-md-2 dataset-filters-wrap">
            <div class="dataset-filters">
              <p>Refine datasets by:</p>
              <h2>Status</h2>
              <div class="dataset-filters__checkbox">
                <el-checkbox v-model="publicFilter" @change="getDatasets"
                  >Public</el-checkbox
                >
                <el-checkbox v-model="embargoedFilter" @change="getDatasets"
                  >Embargoed</el-checkbox
                >
              </div>
              <hr />
              <h2>Tags</h2>
              <div class="tags-filter-input-wrap mb-16">
                <el-select
                  ref="select"
                  v-model="selectedTag"
                  filterable
                  class="mr-19 add-tag"
                  :default-first-option="true"
                  :visible-arrow="false"
                  placeholder="Search"
                  @change="onSelectTags"
                >
                  <svg-icon
                    slot="prefix"
                    icon="icon-magnifying-glass"
                    class="search-icon"
                    height="24"
                    width="24"
                  />
                  <el-option
                    v-for="(tag, index) in tags"
                    :key="`${tag}-${index}`"
                    :label="tag.tag"
                    :value="tag.tag"
                  >
                  </el-option>
                </el-select>
              </div>
              <div
                v-for="(tag, index) in filteredTags"
                :key="`${tag}-${index}`"
                class="selected-tag"
              >
                {{ tag }}
                <button @click="removeTag(tag)">
                  <svg-icon
                    icon="icon-remove"
                    class="remove-icon"
                    height="8"
                    width="8"
                  />
                </button>
              </div>
              <hr />
              <a
                :class="{
                  'not-active':
                    !publicFilter &&
                    !embargoedFilter &&
                    filteredTags.length === 0
                }"
                href="#"
                @click.prevent="clearFilters"
              >
                Clear all filters
              </a>
              <button
                class="btn-close-dataset-filters hidden-md-and-up"
                @click="isFiltersVisible = false"
              >
                <svg-icon
                  name="icon-remove"
                  width="15"
                  height="15"
                  color="#71747c"
                  class="close-icon"
                />
              </button>
            </div>
          </div>
          <div class="col-xs-12 col-md-10">
            <div
              v-if="datasets.length > 0"
              class="dataset-list-controls-wrap mb-24"
            >
              <dataset-list-controls
                :total="totalDatasetCount"
                :page-size.sync="pageSize"
                @set-list-options="setListOptions"
              />

              <div class="hidden-sm-and-down">
                <el-pagination
                  v-show="totalDatasetCount > pageSize"
                  :page-size="pageSize"
                  :pager-count="5"
                  :current-page.sync="page"
                  layout="prev, pager, next"
                  :total="totalDatasetCount"
                  @current-change="getDatasets()"
                />
              </div>

              <button
                class="btn-filters hidden-md-and-up"
                @click="isFiltersVisible = true"
              >
                <svg-icon icon="icon-filter-filled" height="13" width="13" />
                Filters
                <template v-if="totalFilterCount > 0">
                  ({{ totalFilterCount }})
                </template>
              </button>
            </div>

            <template v-if="isLoading">
              <dataset-list-item-loader v-for="n in pageSize" :key="n" />
            </template>

            <div v-else class="dataset-list">
              <template v-if="datasets.length > 0">
                <dataset-card
                  v-for="dataset in datasets"
                  :key="dataset.id"
                  class="mb-16"
                  :dataset="dataset"
                />
              </template>

              <no-search-results v-else @back="clearFilters" />
            </div>

            <div class="bottom-pagination-wrap hidden-md-and-up">
              <el-pagination
                v-show="totalDatasetCount > pageSize"
                :page-size="pageSize"
                :pager-count="5"
                :current-page.sync="page"
                layout="prev, pager, next"
                :total="totalDatasetCount"
                @current-change="getDatasets()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <bf-footer :show-signup-footer="showSignupFooter" />
    <div class="filters-overlay" @click="isFiltersVisible = false" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { propOr, pathOr } from 'ramda'
import Auth from '@aws-amplify/auth'
import Request from '@/mixins/request'
import BfHeader from '@/components/shared/BfHeader/BfHeader.vue'
import BfFooter from '@/components/shared/BfFooter/BfFooter.vue'
import DatasetListItemLoader from '@/components/DatasetListItemLoader/DatasetListItemLoader.vue'
import DatasetSearch from '@/components/DatasetSearch/DatasetSearch.vue'
import DatasetListControls from '@/components/DatasetListControls/DatasetListControls.vue'
import DatasetCard from '@/components/DatasetCard/DatasetCard.vue'
import NoSearchResults from '@/components/NoSearchResults/NoSearchResults.vue'

const pageSize = 25

export default {
  name: 'Home',

  components: {
    BfHeader,
    BfFooter,
    DatasetListItemLoader,
    DatasetSearch,
    DatasetListControls,
    DatasetCard,
    NoSearchResults
  },

  mixins: [Request],

  props: {
    showSignupFooter: {
      type: Boolean,
      default: false
    }
  },

  async asyncData({ $axios, error, $cookies }) {
    try {
      let url = `${process.env.discover_api_host}/datasets?limit=${pageSize}&offset=0`
      const tagsUrl = `${process.env.discover_api_host}/tags`
      const token = $cookies.get('user_token')
      if (token) {
        url = `${url}&api_key=${token}`
        // @TODO add back in when endpoint issue has been resolved.
        // tagsUrl = `${tagsUrl}&api_key=${token}`
      }

      const datasetRes = await $axios.$get(url)
      const tagsRes = await $axios.$get(tagsUrl)
      return {
        datasets: datasetRes.datasets,
        totalDatasetCount: datasetRes.totalCount,
        tags: tagsRes,
        resetTags: tagsRes.map((tag) => ({ ...tag })) // this is for when we reset the tags on clear
      }
    } catch (err) {
      error({ message: err.message })
    }
  },

  data() {
    return {
      datasets: [],
      filteredTags: [],
      selectedTag: '',
      remainingTagsCount: 0,
      showAllTags: false,
      remainingTagCount: 0,
      pageSize,
      page: 1,
      offset: 0,
      totalDatasetCount: 0,
      publicFilter: false,
      embargoedFilter: false,
      isFiltersVisible: false
    }
  },

  computed: {
    ...mapState(['isLoadingTags']),

    /**
     * Compute url to get all discover datasets
     * @returns {String}
     */
    getDatasetsUrl() {
      const url = `${process.env.discover_api_host}/datasets?limit=${this.pageSize}&offset=${this.offset}`

      return url
    },

    /**
     * Compute total filter count
     * @returns {Number}
     */
    totalFilterCount() {
      const publicFilterCount = this.publicFilter ? 1 : 0
      const embargoedFilterCount = this.embargoedFilter ? 1 : 0

      return publicFilterCount + embargoedFilterCount + this.filteredTags.length
    },

    /**
     * User api url
     * @returns {String}
     */
    userUrl() {
      return `${process.env.api_host}/user`
    }
  },

  mounted() {
    this.doneMounting()
  },

  methods: {
    ...mapActions(['updateUserToken', 'updateProfile']),

    /**
     * Removes tag filter
     */
    removeTag(removedTag) {
      const index = this.filteredTags.indexOf(removedTag)
      if (index > -1) {
        this.filteredTags.splice(index, 1)
      }
      this.tags.push({ tag: removedTag, count: 1 })
      this.getDatasets()
    },

    /**
     * Logic to add and filter tags once a tag is selected
     * @param {String} tag
     */
    onSelectTags(tag) {
      this.filteredTags.push(tag)
      // remove selected tag from tags list
      this.tags.forEach((tagObj) => {
        if (tagObj.tag === tag) {
          const index = this.tags.indexOf(tagObj)
          if (index > -1) {
            this.tags.splice(index, 1)
          }
        }
      })
      this.selectedTag = ''
      this.getDatasets()
    },
    /**
     * Clears all selected filters
     */
    clearFilters() {
      this.publicFilter = false
      this.embargoedFilter = false
      this.filteredTags = []
      this.tags = this.resetTags
      this.getDatasets()
    },

    /**
     * API call to get all Discover datasets
     */
    getDatasets() {
      if (!this.getDatasetsUrl) {
        return
      }
      this.offset = (this.page - 1) * this.pageSize

      let url = ''
      if (
        (this.publicFilter && this.embargoedFilter) ||
        (!this.publicFilter && !this.embargoedFilter)
      ) {
        // if both are checked, apply no filters
        url = this.getDatasetsUrl
      } else {
        // if either filter is checked, apply url with filters
        let filter = false
        if (this.embargoedFilter) {
          filter = this.embargoedFilter
        }
        url = this.getDatasetsUrl + `&embargo=${filter}`
      }

      if (this.filteredTags.length !== 0) {
        url = url + `&tags=${this.filteredTags}`
      }

      this.sendXhr(url).then((response) => {
        this.totalDatasetCount = response.totalCount
        this.datasets = response.datasets
      })
    },

    /**
     * Set options for the list
     * @param {Object} options
     */
    setListOptions(options) {
      this.page = 1
      this.getDatasets()
    },
/* eslint-disable */
    getFragmentParameterByName: function(pname) {
        console.log("getFragmentParameterByName() pname: " + pname)
        console.log(window.location)
        var name = pname.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
            results = regex.exec(window.location.hash);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    async doneMounting() {
      console.log("doneMounting()")
      console.log(window.location)
      const accessToken = this.getFragmentParameterByName('access_token')
      console.log(accessToken)
      if (accessToken) {
        const user = await Auth.currentAuthenticatedUser()
        this.handleLoginSuccess(user)
      }
      const error = this.getFragmentParameterByName('error_description')
      if (error) {
        // this.showOrcidError = true
      }
    },

    /**
     * Handle a successful login: set vuex state
     * and cookies, close login dialog
     */
    handleLoginSuccess(user) {
      console.log("handleLoginSuccess()")
      console.log(user)
      const token = pathOr(
        '',
        ['signInUserSession', 'accessToken', 'jwtToken'],
        user
      )
      const userAttributes = propOr({}, 'attributes', user)
      this.setLogin(token, userAttributes)
    },

    /**
     * Log the user in and set the state
     * @param {String} token
     * @param {Object} profile
     */
    setLogin(token, userAttributes) {
      console.log("setLogin()")
      console.log(token)
      console.log(userAttributes)
      this.$cookies.set('user_token', token)
      this.updateUserToken(token)

      const url = `${this.userUrl}` + `?api_key=${token}`
      this.$axios.$get(url).then((response) => {
        console.log(response)
        this.updateProfile(response)
      })
    }
  },

  head() {
    return {
      title: 'Pennsieve Discover - Find and access public scientific datasets',
      titleTemplate: '%s - Pennsieve Discover',
      meta: [
        {
          name: 'description',
          content: 'Find and access public scientific datasets.'
        },
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:title',
          content: 'Pennsieve Discover'
        },
        {
          name: 'og:description',
          content: 'Find and access public scientific datasets.'
        },
        // {
        //   name: 'og:url',
        //   content: window.location.href
        // },
        {
          name: 'og:site_name',
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
          content: 'Find and access public scientific datasets.'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/_variables.scss';

.search-icon {
  margin-top: 5px;
  color: $glial;
}

.tags-filter-input-wrap {
  display: flex;
  justify-content: space-between;
}

.add-tag {
  flex: 1;
  max-width: 475px;
  /deep/ .el-input__prefix {
    display: flex;
    .svg-icon {
      align-self: center;
    }
  }
}

.selected-tag {
  background-color: $cortex;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  color: #000;
  line-height: 14px;
  width: fit-content;
  padding: 5px 10px 5px 8px;
  margin-bottom: 4px;
}

.remove-icon {
  padding-left: 5px;
}

.discover-home {
  overflow-x: hidden;
}

.header-feature {
  width: 100%;
  background-color: #404554;
  box-sizing: border-box;
  padding: 88px 0 96px;
  position: relative;
  overflow: hidden;
  @media only screen and (max-width: 550px) {
    padding-top: 40px;
  }

  .discover-content {
    position: relative;
    z-index: 2;
  }

  h1 {
    color: #ffffff;
    font-size: 48px;
    font-weight: 200;
    margin-bottom: 16px;
    max-width: 456px;
    line-height: 56px;
  }

  p {
    color: #ffffff;
    font-size: 24px;
    font-weight: 200;
    line-height: 32px;
    margin-bottom: 24px;
    max-width: 616px;
  }

  a {
    text-decoration: none;
    color: #fafafa;
    button {
      border-radius: 3px;
      border: 2px solid #fafafa;
      height: 48px;
      width: 252px;
      font-size: 16px;
      font-weight: bold;
      line-height: 32px;
      color: #fafafa;

      &:hover {
        background-color: #2760ff;
        border: 2px solid #2760ff;
      }

      &:focus {
        background-color: #1c46bd;
        border: 2px solid #1c46bd;
      }
    }
  }

  .copy {
    z-index: 1;
  }

  img {
    position: absolute;
    top: -381px;
    right: -575px;
    width: 1397px;
    z-index: 1;
  }

  @media only screen and (min-width: 1024px) and (max-width: 1430px) {
    img {
      right: -787px;
    }
  }

  @media only screen and (min-width: 320px) and (max-width: 1020px) {
    img {
      right: -998px;
    }
  }
}

.dataset-filters {
  margin-top: 90px;
  margin-bottom: 30px;

  a {
    &.not-active {
      color: $dopamine-disabled;
      pointer-events: none;
      cursor: pointer;
      text-decoration: none;
    }
  }

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    margin-bottom: 17px;
  }

  h2 {
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    text-transform: uppercase;
    color: $myelin;
  }

  &__checkbox {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;

    /deep/ .el-checkbox__label {
      color: #000;
      font-weight: normal;
    }

    /deep/ .el-checkbox__input {
      .el-checkbox__inner {
        &:hover {
          border-color: $dopamine;
        }
      }
      &.is-focus {
        .el-checkbox__inner {
          border-color: $dopamine;
        }
      }
      &.is-checked {
        .el-checkbox__inner {
          border-color: $dopamine;
          background-color: $dopamine;
        }
      }
    }
  }
}

.dataset-header {
  color: #000000;
  font-size: 24px;
  font-weight: 500;
  height: 32px;
  line-height: 32px;
  margin: 40px 0 32px;
}

.svg-icon {
  margin-bottom: 2px;
}

.bottom-pagination-wrap {
  text-align: center;
}

.dataset-list-controls-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 37px;
}

.no-search-results {
  margin-top: 91px;
}
.btn-filters {
  align-items: center;
  color: $app-primary-color;
  display: flex;
  .svg-icon {
    margin-right: 0.375rem;
  }
}
</style>

<style lang="scss">
.dataset-filters-wrap {
  display: block;
  @media (max-width: 62em) {
    display: none;
  }
}
@media (max-width: 62em) {
  .filters-overlay {
    background: rgba(0, 0, 0, 0.5);
    display: none;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 2000;
    .filters-visible & {
      display: block;
    }
  }

  .filters-visible {
    .dataset-filters-wrap {
      display: block;
      bottom: 0;
      left: 0;
      pointer-events: none;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 2001;
    }
    .dataset-filters {
      background: #fff;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 6px;
      margin: 5.5rem 1.5rem 0;
      padding: 1.75rem 2rem 1.75rem;
      pointer-events: all;
      position: relative;
      z-index: 2002;
    }
    .btn-close-dataset-filters {
      position: absolute;
      top: 0.6875rem;
      right: 0.6875rem;
    }
  }
}
</style>
