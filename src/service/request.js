/* eslint-disable */
import axios from 'axios'
import { apiBaseUrl, getApiUrl } from '@/service/url'
import {
  getToken,
  isAuthenticated,
  removeLoginData,
  setAuthorizationHeader,
  setToken,
  setupAuthorization
} from '@/service/auth'
import { entityRequests } from '@/service/entityRequest'


let isTokenRefreshed = false
const subscribers = []

const errorHandler = async error => {
  const { response, config } = error
  const originalRequest = config

  let shouldRefreshToken =
      getToken() &&
      response &&
      (response.status === 401 || response.status === 402) &&
      !originalRequest._retry

  if (
      [getApiUrl('/auth/refresh'), getApiUrl('/auth/login')].includes(
          originalRequest.url
      )
  ) {
    shouldRefreshToken = false
  }

  if (response && response.status === 429) {
    console.error('Too many API requests!')
  }

  if (
      getApiUrl('/auth/refresh') === originalRequest.url &&
      response &&
      [401, 402, 500].includes(response.status)
  ) {
    removeLoginData()
  }

  if (shouldRefreshToken) {
    console.log('Should refresh')
    // Mark this request as one who's refreshing token

    originalRequest._retry = true

    if (!isTokenRefreshed) {
      isTokenRefreshed = true

      entityRequests.auth.refresh()
          .then(response => {
            console.log('response', response)
            const accessToken = response.access_token
            const tokenType = response.token_type
            setToken(response.access_token)
            isTokenRefreshed = false
            setupAuthorization(accessToken)
            onTokenRefreshed({ accessToken, tokenType })
          })
          .catch(error => {
            console.warn("can't refresh token", error)
          })
    }
    // Subscribe to token refresh
    return new Promise(resolve => {
      subscribeTokenRefresh(({ accessToken, tokenType }) => {
        if (originalRequest.headers.Authorization) {
          setAuthorizationHeader(accessToken, originalRequest)
        }

        return resolve(axiosInstance.request(originalRequest))
      })
    })
  } else {
    console.info('shouldRefresh false')

  }

  return Promise.reject(error)
}

const subscribeTokenRefresh = (callback) => {
  subscribers.push(callback)
}

const onTokenRefreshed = ({ accessToken, tokenType }) => {
  // eslint-disable-next-line standard/no-callback-literal
  subscribers.map(callback => callback({ accessToken, tokenType }))
}

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl
})

axiosInstance.defaults.headers.common['Accept-Language'] = 'en'

/**
 * Overwrite axios response handler to use custom error handler method
 */
axiosInstance.interceptors.response.use(
    response => response,
    error => errorHandler(error)
)

export const getRequestHandler = async (url, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance.get(url, data)
    return response.data
  } catch (err) {
    throw err
  }
}

export const postRequestHandler = async (url, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance.post(url, data)
    return response.data
  } catch (err) {
    throw err
  }
}

export const requestHandler = async (
    requestUrl,
    method = 'get',
    params,
    data,
    responseType
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (isAuthenticated()) {
      setAuthorizationHeader()
    }
    const response = await axiosInstance.request({
      method,
      url: requestUrl,
      ...(data && { data }),
      ...(params && { params }),
      ...(responseType && { responseType })
    })
    return response.data
  } catch (err) {
    throw err
  }
}
