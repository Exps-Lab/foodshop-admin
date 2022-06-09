import { defineStore } from 'pinia'
import { constantRouterMap, asyncRouterMap, noAuthRouter } from '@router'

const MockServerRoute = [
  {
    path: '/userList',
    children: [{
      path: 'index',
    }]
  },
  {
    path: '/addMenu/index',
    children: []
  }
]

function routerFilter (feRouter, ServerRouter, res) {
  for (const serverItem of ServerRouter) {
    for (const feItem of feRouter) {
      if (serverItem.path === feItem.path) {
        if (!serverItem.children || !serverItem.children.length) {
          res.push(feItem)
        } else {
          const { children, ...data } = feItem
          const tempData = { ...data }
          tempData.children = routerFilter(feItem.children, serverItem.children, [])
          res.push(tempData)
        }
        break
      } else if (serverItem.path.includes(feItem.path)) {
        const fakeChildPath = [{
          path: serverItem.path.slice(feItem.path.length + 1)
        }]
        const { path, ...data } = feItem
        const tempData = { ...data, path: feItem.path }
        tempData.children = routerFilter(feItem.children, fakeChildPath, [])
        res.push(tempData)
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
        let accessedRouters = routerFilter(asyncRouterMap, MockServerRoute, [])
        this.routes = [...accessedRouters, noAuthRouter]
        this.menus = apiRoutes
        resolve()
      });
    }
  }
})
