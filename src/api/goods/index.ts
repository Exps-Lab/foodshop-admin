import request from '@utils/request'
import type { GoodsCategoryParams, GoodsParams } from '../types'

export function getCategory(params?: GoodsCategoryParams) {
  return request({
    url: '/admin/auth/foodCategory/list',
    method: 'get',
    params
  })
}

export function deleteCategory(data: Record<string, any>) {
  return request({
    url: '/admin/auth/foodCategory/delete',
    method: 'post',
    data
  })
}

export function goodsList(params?: GoodsParams) {
  return request({
    url: '/admin/auth/food/list',
    method: 'get',
    params
  })
}

export function getDetail(params: Record<string, any>) {
  return request({
    url: '/admin/auth/food/detail',
    method: 'get',
    params
  })
}

export function addGoods(data: Record<string, any>) {
  return request({
    url: '/admin/auth/food/add',
    method: 'post',
    data
  })
}

export function updateGoods(data: Record<string, any>) {
  return request({
    url: '/admin/auth/food/update',
    method: 'post',
    data
  })
}

export function deleteGoods(data: Record<string, any>) {
  return request({
    url: '/admin/auth/food/delete',
    method: 'post',
    data
  })
}
