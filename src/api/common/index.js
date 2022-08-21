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

export function getNowCity () {
  return request({
    url: '/admin/noauth/place/getCityInfo',
    method: 'get'
  })
}

export function placeSearch (params) {
  return request({
    url: '/admin/noauth/place/search',
    method: 'get',
    params,
  })
}

