// eslint-disable-next-line import/no-cycle
import { requestHandler } from '@/service/request'
import { getApiUrl } from '@/service/url'

const indexRequest = (entity, args = [], initParms = {}) => params => requestHandler(
  getApiUrl([entity, ...args]),
  'get',
  { ...initParms, ...params },
  null,
)

const createRequest = (entity, args) => data => requestHandler(getApiUrl([entity]), 'post', args, data)

const showRequest = (entity, args) => id => requestHandler(getApiUrl([entity, id]), 'get', args, null)

const updateRequest = (entity, args) => (id, data) => requestHandler(getApiUrl([entity, id]), 'put', args, data)

const deleteRequest = entity => id => requestHandler(getApiUrl([entity, id]), 'delete', null, null)

// eslint-disable-next-line import/prefer-default-export
export const crud = entity => ({
  index: indexRequest(entity),
  create: createRequest(entity),
  show: showRequest(entity),
  update: updateRequest(entity),
  delete: deleteRequest(entity),
})
