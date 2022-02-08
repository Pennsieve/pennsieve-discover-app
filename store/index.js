import { pathOr } from 'ramda'

// state
export const state = () => ({
  versions: [],
  tags: [],
  isLoadingTags: true,
  profile: {},
  userToken: '',
  selectedPackage: {},
})

// mutations
export const mutations = {
  setVersions(state, data) {
    state.versions = data
  },
  setTags(state, data) {
    state.tags = data
    state.isLoadingTags = false
  },
  UPDATE_USER_TOKEN(state, token) {
    state.userToken = token
  },
  UPDATE_PROFILE(state, profile) {
    state.profile = profile
  },
  CLEAR_STATE(state) {
    state.userToken = ''
    state.profile = {}
  },
  // Leveraged to get individual package state to package details route
  SELECT_PACKAGAE(state, data) {
    state.selectedPackage = data
  }
}

// actions
export const actions = {
  updateUserToken: ({ commit }, evt) => commit('UPDATE_USER_TOKEN', evt),
  updateProfile: ({ commit }, evt) => commit('UPDATE_PROFILE', evt),
  clearState: ({ commit }) => commit('CLEAR_STATE'),
  setSelectedPackage: ({commit}, evt) => commit('SELECT_PACKAGAE', evt)
}

// getters
export const getters = {
  isSignedIn: (state) => !!(state.profile && state.userToken),
  userDisplayName: (state) => {
    if (Object.keys(state.profile).length > 0) {
      const firstName = pathOr('', ['firstName'], state.profile)
      const lastName = pathOr('', ['lastName'], state.profile)
      const firstInitial = firstName ? firstName[0] : ''
      return `${firstInitial}. ${lastName}`
    } else return ''
  }
}
