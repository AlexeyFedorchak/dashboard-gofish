export const apiBaseUrl = process.env.VUE_APP_API_URL
if (!apiBaseUrl) {
  console.warn('VUE_APP_API_URL not defined!')
}

export const urlParser = (path, full = false, prefix) => {
  if (!path) return '/'

  if (Array.isArray(path)) {
    // eslint-disable-next-line no-param-reassign
    path = path.filter(Boolean).join('/')
  }

  const fullPath = path.substring(0, 1) === '/' ? path.substring(1) : path

  if (!full) {
    return [prefix, fullPath].join('/')
  }

  return [apiBaseUrl, prefix, fullPath].filter(Boolean).join('/')
}

export const getApiUrl = (path, full = true) => urlParser(path, full)
