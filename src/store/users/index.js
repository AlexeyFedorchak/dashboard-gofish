import axios from 'axios'

export const GET_USERS = 'GET_USERS'

export default {
  state: {
    users: [],
  },
  getters: {
    getNewUsersInfo: state => state.users,
  },
  mutations: {
    [GET_USERS]: (state, data) => {
      state.users = data
    },
  },
  actions: {
    async getUsers({ commit }) {
      try {
        const res = await axios.get('http://api.reallyfish.com/api/users')

        commit('GET_USERS', res.data)
      } catch (e) {
        commit('GET_USERS', false)
      }
    },
  },
}
