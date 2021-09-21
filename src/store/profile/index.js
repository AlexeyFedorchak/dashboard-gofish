import { entityRequests } from '@/service/entityRequest'

const SET_PROFILE = 'SET_PROFILE'
const profileRequest = entityRequests.auth

export default {
  namespaced: true,
  state: {
    profile: {},
  },
  getters: {
    profile: state => state.profile,
  },
  mutations: {
    [SET_PROFILE](state, profile) {
      state.profile = profile
    },
  },
  actions: {
    async getProfile({ commit }) {
      const { user } = await profileRequest.me()
      commit(SET_PROFILE, user)
    },
  },
}
