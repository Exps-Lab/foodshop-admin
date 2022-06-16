import request from '@utils/request'

export function getMenuList (params) {
  return request({
    url: '/admin/auth/getMenuList',
    method: 'get',
    params
  })
}
export function getMenuDetail (params) {
  return request({
    url: '/admin/auth/getMenuDetail',
    method: 'get',
    params
  })
}
export function addMenu (data) {
  return request({
    url: '/admin/auth/addMenu',
    method: 'post',
    data
  })
}
export function updateMenu (data) {
  return request({
    url: '/admin/auth/updateMenu',
    method: 'post',
    data
  })
}
export function deleteMenu (data) {
  return request({
    url: '/admin/auth/deleteMenu',
    method: 'post',
    data
  })
}