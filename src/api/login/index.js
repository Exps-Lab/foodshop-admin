import request from '@utils/request'

export function login (data) {
  return request({
    url: '/admin/noauth/login',
    method: 'post',
    data
  })
}

export function logout (data) {
  return request({
    url: '/admin/noauth/logout',
    method: 'post',
    data
  })
}
