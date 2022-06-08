import { defineStore } from 'pinia'
import { constantRouterMap, asyncRouterMap, noAuthRouter } from '@router'

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
    menus: []
  }),
  actions: {
    generateRoutes() {
      return new Promise(resolve => {
        // 应该请求server数据
        const res = {
          data: {
            list: [
              {
                url: '/userList/index',
                label: '用户列表',
                icon: 'app'
              }
            ]
          }
        }
        let apiRoutes = res.data.list;
        let accessedRouters = routerFilter(asyncRouterMap, MockServerRoute)
        this.routes = [...accessedRouters, noAuthRouter]
        this.menus = apiRoutes
        resolve()
      });
    }
  }
})
