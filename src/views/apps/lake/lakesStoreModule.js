import { entityRequests } from '@/service/entityRequest'

const GET_LAKES = 'GET_LAKES'
const GET_LAKE_INFO = 'GET_LAKE_INFO'
const GET_LAKE = 'GET_LAKE'

export default {
  namespaced: true,
  state: {
    lakes: [],
    lakeInfo: [],
    currentLake: {},
  },
  getters: {
    updateLakes: state => state.lakes,
    updateLakeInfo: state => state.lakeInfo,
    updateLake: state => state.lake,
  },
  mutations: {
    [GET_LAKES](state, date) {
      state.lakes = date
    },
    [GET_LAKE_INFO](state, date) {
      state.lakeInfo = date
    },
    [GET_LAKE](state, date) {
      state.currentLake = date
    },
  },
  actions: {
    async fetchLakes({ commit }) {
      const { lakes } = await entityRequests.lakes.listLakes()
      commit('GET_LAKES', lakes)
    },

    async fetchLake({ commit }, { slug }) {
      const lake = await entityRequests.lakes.currentLake(slug)
      commit('GET_LAKE', lake.lake)
      return lake
    },

    async deleteLake(ctx, id) {
      await entityRequests.lakes.deleteLake(id)
    },

    async addLake(ctx, lakeData) {
      await entityRequests.lakes.addLake(lakeData)
    },

    async addLakeGet({ commit }) {
      const res = await entityRequests.lakes.addLakeGet()
      commit('GET_LAKE_INFO', res)
    },

    async editLake(ctx, lakeData) {
      await entityRequests.lakes.editLake(lakeData).then(res => console.log(res))
    },
  },
}
