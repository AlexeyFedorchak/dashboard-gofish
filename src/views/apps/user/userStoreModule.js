import { entityRequests } from '@/service/entityRequest'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async fetchUsers() {
      const res = await entityRequests.users.listUsers()
      return res
    },
    async fetchUser(ctx, { id }) {
      const res = await entityRequests.users.currentUser(id)
      return res
    },
    // addUser(ctx, userData) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post(`${VUE_APP_API_URL}/users`, { user: userData })
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
  },
}
