import request from '@utils/request'

export function getCategory () {
  return request({
    url: '/admin/noauth/shop/category',
    method: 'get'
  })
}

export function getDetail (params) {
  return request({
    url: '/admin/auth/shop/detail',
    method: 'get',
    params
  })
}

export function addShop (data) {
  return request({
    url: '/admin/auth/shop/add',
    method: 'post',
    data
  })
}

export function updateShop (data) {
  return request({
    url: '/admin/auth/shop/update',
    method: 'post',
    data
  })
}
