import request from '@utils/request'

export function getCommonInfo () {
  return request({
    url: '/admin/auth/getCommonInfo',
    method: 'get'
  })
}
// 获取文件上传凭证token
export function uploadToken () {
  return request({
    url: '/admin/noauth/uploadToken',
    method: 'get'
  })
}
