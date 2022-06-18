import request from '@utils/request'

export function getCommonInfo () {
  return request({
    url: '/admin/auth/getCommonInfo',
    method: 'get'
  })
}
