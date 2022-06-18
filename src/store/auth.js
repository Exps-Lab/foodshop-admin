import { defineStore } from 'pinia'
import { userStore } from '@store/user'
import { asyncRouterMap, noAuthRouter } from '@router'
import { getCommonInfo } from '@api/common/index'

function routerFilter (feRouter, ServerRouter, res, deepLevel) {
  for (const serverItem of ServerRouter) {
    for (const feItem of feRouter) {
      if (serverItem.path === feItem.path) {
        if (!serverItem.children || !serverItem.children.length) {
          res.push(feItem)
        } else {
          const { children, ...data } = feItem
          const tempData = { ...data }
          deepLevel++
          tempData.children = routerFilter(feItem.children, serverItem.children, [], deepLevel)
          deepLevel--
          res.push(tempData)
        }
        break
      } else if (serverItem.path.includes(feItem.path)) {
        if (deepLevel > 1) {
          res.push(feItem)
        } else {
          const fakeChildPath = [{
            path: serverItem.path.slice(feItem.path.length + 1)
          }]
          const { path, ...data } = feItem
          const tempData = { ...data, path: feItem.path }
          deepLevel++
          tempData.children = routerFilter(feItem.children, fakeChildPath, [], deepLevel)
          deepLevel--
          res.push(tempData)
        }
        break
      } else {}
    }
  }
  return res
}

export const authStore = defineStore('auth', {
  state: () => ({
    routes: [],
    menus: []
  }),
  actions: {
    resetRoutes () {
      this.routes = []
    },
    generateRoutes() {
      const _userStore = userStore()
      return new Promise(resolve => {
        getCommonInfo().then(res => {
          const { menuList: apiRoutes, userInfo } = res.data
          let accessedRouters = routerFilter(asyncRouterMap, apiRoutes, [], 1)
          this.routes = [...accessedRouters, noAuthRouter]
          this.menus = apiRoutes
          _userStore.setUserInfo(userInfo)
          resolve()
        })
      });
    }
  }
})
