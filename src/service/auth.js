/* eslint-disable */
import { getLocalStorageData, removeLocalStorageData, setLocalStorageData, tokenName } from '@/service/storage'
import { axiosInstance } from '@/service/request'

const tokenType = 'Bearer'

export const getToken = () => getLocalStorageData(tokenName)

export const setToken = token => setLocalStorageData(tokenName, token)

export const removeLoginData = () => removeLocalStorageData(tokenName)

export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

export const setAuthorizationHeader = (token = getToken(), request = null) => {
  const headerAuth = `${tokenType} ${token}`
  axiosInstance.defaults.headers.common.Authorization = headerAuth
  if (request) {
    request.headers.Authorization = headerAuth
  }
}

export const setupAuthorization = (token) => {
  const tokenValue = token || getToken()

  if (tokenValue) setAuthorizationHeader(tokenValue)
}
