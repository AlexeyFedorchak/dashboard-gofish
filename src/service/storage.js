export const tokenName = 'gofish-api-token'

export const setLocalStorageData = (key, value, json = false) => {
  if (!localStorage) return
  // eslint-disable-next-line no-param-reassign
  value = json ? JSON.stringify(value) : value
  localStorage.setItem(key, value)
}
export const removeLocalStorageData = key => {
  if (!localStorage) return
  localStorage.removeItem(key)
}

export const getLocalStorageData = (key, json = false) => {
  if (!localStorage) return null
  let data = localStorage.getItem(key)
  data = data && json ? JSON.parse(data) : data

  return data
}
