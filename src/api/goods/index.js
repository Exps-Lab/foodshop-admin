import request from '@utils/request'

export function getCategory (params) {
  return request({
    url: '/admin/auth/foodCategory/list',
    method: 'get',
    params
  })
}

export function goodsList (params) {
  return request({
    url: '/admin/auth/food/list',
    method: 'get',
    params
  })
}

export function getDetail (params) {
  return request({
    url: '/admin/auth/food/detail',
    method: 'get',
    params
  })
}

export function addGoods (data) {
  return request({
    url: '/admin/auth/food/add',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/admin/auth/food/update',
    method: 'post',
    data
  })
}

export function deleteGoods (data) {
  return request({
    url: '/admin/auth/food/delete',
    method: 'post',
    data
  })
}
