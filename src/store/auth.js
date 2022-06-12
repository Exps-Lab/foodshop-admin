import { defineStore } from 'pinia'
import { userStore } from '@store/user'
import { asyncRouterMap, noAuthRouter } from '@router'

const MockServerRoute = [
  {
    path: '/userList',
    children: [{
      path: '/userList/index',
    }]
  },
  {
    path: '/addMenu/index',
    children: []
  }
]

let walkLevel = 1
function routerFilter (feRouter, ServerRouter, res) {
  for (const serverItem of ServerRouter) {
    for (const feItem of feRouter) {
      if (serverItem.path === feItem.path) {
        if (!serverItem.children || !serverItem.children.length) {
          res.push(feItem)
        } else {
          const { children, ...data } = feItem
          const tempData = { ...data }
          walkLevel++
          tempData.children = routerFilter(feItem.children, serverItem.children, [])
          res.push(tempData)
        }
        break
      } else if (serverItem.path.includes(feItem.path)) {
        if (walkLevel > 1) {
          res.push(feItem)
        } else {
          const fakeChildPath = [{
            path: serverItem.path.slice(feItem.path.length + 1)
          }]
          const { path, ...data } = feItem
          const tempData = { ...data, path: feItem.path }
          walkLevel++
          tempData.children = routerFilter(feItem.children, fakeChildPath, [])
          res.push(tempData)
        }
        break
      } else {}
    }
  }
  walkLevel--
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
        // 应该请求server数据
        const res = {
          data: {
            list: [
              {
                path: '/userList',
                label: '用户管理',
                icon: 'app',
                children: [
                  {
                    path: '/userList/index',
                    label: '用户列表'
                  }
                ]
              },
              {
                path: '/addMenu/index',
                label: '添加菜单',
                icon: 'bug'
              }
            ],
            userInfo: {
              "username": '写死的用户名',
              "role" : 2,
              "role_name" : "普通用户",
              "c_time" : 1654857757527.0,
            }
          }
        }
        let apiRoutes = res.data.list;
        let accessedRouters = routerFilter(asyncRouterMap, MockServerRoute, [])
        this.routes = [...accessedRouters, noAuthRouter]
        this.menus = apiRoutes
        _userStore.setUserInfo(res.data.userInfo)
        resolve()
      });
    }
  }
})
