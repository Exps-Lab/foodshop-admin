import request from '@utils/request'
import type { ShopParams, GenShopDescParams } from '../types'

export function getCategory() {
  return request({
    url: '/admin/noauth/shop/category',
    method: 'get'
  })
}

export function shopList(params?: ShopParams) {
  return request({
    url: '/admin/auth/shop/list',
    method: 'get',
    params
  })
}

export function getDetail(params: Record<string, any>) {
  return request({
    url: '/admin/auth/shop/detail',
    method: 'get',
    params
  })
}

export function addShop(data: Record<string, any>) {
  return request({
    url: '/admin/auth/shop/add',
    method: 'post',
    data
  })
}

export function updateShop(data: Record<string, any>) {
  return request({
    url: '/admin/auth/shop/update',
    method: 'post',
    data
  })
}

export function deleteShop(data: Record<string, any>) {
  return request({
    url: '/admin/auth/shop/delete',
    method: 'post',
    data
  })
}

export function genShopDesc(params: GenShopDescParams, selfConfig?: Record<string, any>) {
  return request({
    url: '/admin/auth/ai/genShopDesc',
    method: 'get',
    params,
    ...selfConfig
  })
}
