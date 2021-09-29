// eslint-disable-next-line import/no-cycle
import { requestHandler } from '@/service/request'
import { getApiUrl } from '@/service/url'
// eslint-disable-next-line import/no-cycle

// eslint-disable-next-line import/prefer-default-export
export const entityRequests = {
  auth: {
    register: data => requestHandler(getApiUrl(['auth', 'sign-up', 'fisher']), 'post', null, data),
    refresh: () => requestHandler(getApiUrl(['auth', 'refresh']), 'post', null),
    me: () => requestHandler(getApiUrl(['profile']), 'get', null),
    code: data => requestHandler(getApiUrl(['auth', 'code']), 'post', null, data),
    login: data => requestHandler(getApiUrl(['auth', 'login']), 'post', null, data),
    logout: () => requestHandler(getApiUrl(['auth', 'logout']), 'post', null),
  },
  users: {
    listUsers: () => requestHandler(getApiUrl(['users']), 'get', null),
    currentUser: id => requestHandler(getApiUrl(['user', id]), 'get', null),
    addUser: data => requestHandler(getApiUrl(['user/create']), 'post', null, data),
    deleteUser: id => requestHandler(getApiUrl(['user/delete', id]), 'delete', null),
    updateUser: data => requestHandler(getApiUrl(['user/update?_method=PATCH']), 'post', data),
  },
  lakes: {
    listLakes: () => requestHandler(getApiUrl(['lakes']), 'get', null),
    currentLake: slug => requestHandler(getApiUrl(['lake', slug]), 'get', null),
    addLake: data => requestHandler(getApiUrl(['lake/create']), 'post', null, data),
    addLakeGet: () => requestHandler(getApiUrl(['lake/create']), 'get', null),
    deleteLake: id => requestHandler(getApiUrl([`lake/delete/${id}`]), 'delete', null),
    editLake: data => requestHandler(getApiUrl(['lake/update']), 'post', data),
  },
}
