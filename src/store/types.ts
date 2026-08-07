import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/api/types'

// ========== Auth Store ==========
export interface AuthState {
  routes: RouteRecordRaw[]
  menus: MenuItem[]
}

// ========== User Store ==========
export interface UserInfo {
  username?: string
  role?: string | number
  role_name?: string
  c_time?: string | number
  [key: string]: any
}

export interface UserState {
  userInfo: UserInfo
}

export interface LoginFormData {
  username: string
  password: string
}
