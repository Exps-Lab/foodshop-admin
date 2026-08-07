import { defineStore } from 'pinia'
import { userStore } from '@store/user'
import { asyncRouterMap, noAuthRouter } from '@router'
import { getCommonInfo } from '@api/common/index'
import type { AuthState } from './types'
import type { MenuItem } from '@/api/types'
import type { RouteRecordRaw } from 'vue-router'

function routerFilter(
  feRouter: RouteRecordRaw[],
  ServerRouter: MenuItem[],
  res: RouteRecordRaw[],
  deepLevel: number
): RouteRecordRaw[] {
  for (const serverItem of ServerRouter) {
    for (const feItem of feRouter) {
      if (serverItem.path === feItem.path) {
        if (!serverItem.children || !serverItem.children.length) {
          res.push(feItem)
        } else {
          const { children, ...data } = feItem
          const tempData = { ...data } as RouteRecordRaw
          deepLevel++
          tempData.children = routerFilter(children as RouteRecordRaw[], serverItem.children, [], deepLevel)
          deepLevel--
          res.push(tempData)
        }
        break
      } else if (serverItem.path!.includes(feItem.path as string)) {
        if (deepLevel > 1) {
          res.push(feItem)
        } else {
          const fakeChildPath = [{
            path: serverItem.path!.slice((feItem.path as string).length + 1)
          }] as unknown as MenuItem[]
          const { path, ...data } = feItem
          const tempData = { ...data, path } as RouteRecordRaw
          deepLevel++
          tempData.children = routerFilter(feItem.children as RouteRecordRaw[], fakeChildPath, [], deepLevel)
          deepLevel--
          res.push(tempData)
        }
        break
      }
    }
  }
  return res
}

export const authStore = defineStore('auth', {
  state: (): AuthState => ({
    routes: [],
    menus: []
  }),
  actions: {
    resetRoutes() {
      this.routes = []
    },
    generateRoutes(): Promise<void> {
      const _userStore = userStore()
      return new Promise(resolve => {
        getCommonInfo().then(res => {
          const { menuList: apiRoutes, userInfo } = res.data
          const accessedRouters = routerFilter(asyncRouterMap, apiRoutes, [], 1)
          this.routes = [...accessedRouters, noAuthRouter]
          this.menus = apiRoutes.filter(menu => !menu.is_hidden)
          _userStore.setUserInfo(userInfo)
          resolve()
        })
      })
    }
  }
})
