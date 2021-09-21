import axios from '@axios'

const { VUE_APP_USERS } = process.env

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUsers(ctx, queryParams) {
      console.log(queryParams)
      return new Promise((resolve, reject) => {
        axios
          .get(`${VUE_APP_USERS}/users`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${VUE_APP_USERS}/user/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addUser(ctx, userData) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${VUE_APP_USERS}/users`, { user: userData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
