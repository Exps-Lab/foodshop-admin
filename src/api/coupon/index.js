import request from '@utils/request'

export function getCouponList (params) {
  return request({
    url: '/admin/auth/coupon/list',
    method: 'get',
    params
  })
}

export function getCouponDetail (params) {
  return request({
    url: '/admin/auth/coupon/detail',
    method: 'get',
    params
  })
}

export function addCoupon (data) {
  return request({
    url: '/admin/auth/coupon/add',
    method: 'post',
    data
  })
}

export function updateCoupon (data) {
  return request({
    url: '/admin/auth/coupon/update',
    method: 'post',
    data
  })
}

export function deleteCoupon (data) {
  return request({
    url: '/admin/auth/coupon/delete',
    method: 'post',
    data
  })
}
