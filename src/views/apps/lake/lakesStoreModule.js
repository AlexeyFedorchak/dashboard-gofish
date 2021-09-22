import { entityRequests } from '@/service/entityRequest'

const GET_LAKES = 'GET_LAKES'

export default {
  namespaced: true,
  state: {
    lakes: [],
  },
  getters: {
    updateLakes: state => state.lakes,
  },
  mutations: {
    [GET_LAKES](state, date) {
      state.lakes = date
    },
  },
  actions: {
    async fetchLakes({ commit }) {
      const { lakes } = await entityRequests.lakes.listLakes()
      commit('GET_LAKES', lakes)
    },

    // async fetchLake(ctx, { id }) {
    //   const res = await entityRequests.lakes.currentLakes(id)
    //   return res
    // },
  },
}
