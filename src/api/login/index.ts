import request from '@utils/request'
import type { LoginParams } from '../types'

export function login(data: LoginParams) {
  return request({
    url: '/admin/noauth/login',
    method: 'post',
    data
  })
}

export function logout(data?: Record<string, any>) {
  return request({
    url: '/admin/noauth/logout',
    method: 'post',
    data
  })
}
