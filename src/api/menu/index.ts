import request from '@utils/request'
import type { MenuParams } from '../types'

export function getMenuList(params?: Record<string, any>) {
  return request({
    url: '/admin/auth/getMenuList',
    method: 'get',
    params
  })
}

export function getMenuDetail(params: MenuParams) {
  return request({
    url: '/admin/auth/getMenuDetail',
    method: 'get',
    params
  })
}

export function addMenu(data: Record<string, any>) {
  return request({
    url: '/admin/auth/addMenu',
    method: 'post',
    data
  })
}

export function updateMenu(data: Record<string, any>) {
  return request({
    url: '/admin/auth/updateMenu',
    method: 'post',
    data
  })
}

export function deleteMenu(data: Record<string, any>) {
  return request({
    url: '/admin/auth/deleteMenu',
    method: 'post',
    data
  })
}

export function getRoleList(params?: Record<string, any>) {
  return request({
    url: '/admin/noauth/getRoleList',
    method: 'get',
    params
  })
}
