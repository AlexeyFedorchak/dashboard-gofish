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
  },
  users: {
    listUsers: () => requestHandler(getApiUrl(['users']), 'get', null),
    currentUser: id => requestHandler(getApiUrl(['user', id]), 'get', null),
  },
}
