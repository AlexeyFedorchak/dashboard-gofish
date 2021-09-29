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
    async addUser(ctx, userData) {
      await entityRequests.users.addUser(userData)
    },
    async deleteUser(ctx, id) {
      await entityRequests.users.deleteUser(id)
    },
    async updateUser(ctx, userData) {
      await entityRequests.users.updateUser(userData)
    },
  },
}
