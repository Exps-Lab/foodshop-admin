import request from '@utils/request'
import type { CouponParams } from '../types'

export function getCouponList(params?: CouponParams) {
  return request({
    url: '/admin/auth/coupon/list',
    method: 'get',
    params
  })
}

export function getCouponDetail(params: Record<string, any>) {
  return request({
    url: '/admin/auth/coupon/detail',
    method: 'get',
    params
  })
}

export function addCoupon(data: Record<string, any>) {
  return request({
    url: '/admin/auth/coupon/add',
    method: 'post',
    data
  })
}

export function updateCoupon(data: Record<string, any>) {
  return request({
    url: '/admin/auth/coupon/update',
    method: 'post',
    data
  })
}

export function deleteCoupon(data: Record<string, any>) {
  return request({
    url: '/admin/auth/coupon/delete',
    method: 'post',
    data
  })
}
