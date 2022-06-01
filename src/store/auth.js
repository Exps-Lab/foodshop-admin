import { defineStore } from 'pinia'
import { asyncRouterMap } from '@router'

const MockServerRoute = [
  {
    path: '/userList',
    name: 'userList',
  }
] 

function routerFilter (feRouter, ServerRouter) {
  let res = []
  for (const serverItem of ServerRouter) {
    for (const feItem of feRouter) {
      if (serverItem.path === feItem.path) {
        res.push(feItem)
        break
      }
    }
  }
  return res
}

export const authStore = defineStore('auth', {
  state: () => ({
    routes: [],
  }),
  actions: {
    generateRoutes() {
      return new Promise(resolve => {
        // 应该请求server数据
        let accessedRouters = routerFilter(asyncRouterMap, MockServerRoute)
        this.routes = accessedRouters
        resolve()
      });
    }
  }
})