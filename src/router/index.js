import { createRouter, createWebHistory } from "vue-router";
import { markRaw } from 'vue'
import LayoutComponent from "../pages/layout/Layout.vue";
const Layout = markRaw(LayoutComponent)

export const constantRouterMap = [
  {
    path: "/",
    component: Layout,
    redirect: "/userList/index"
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/login/index.vue')
  },
  {
    path: "/noAuth",
    name: 'noAuth',
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@pages/noAuth/index.vue")
      }
    ]
  }
];

export const asyncRouterMap = [
  {
    path: '/userList',
    component: Layout,
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: 'index',
        meta: {
          title: '用户列表'
        },
        component: () => import('@pages/userList/index.vue'),
      }
    ]
  },
  {
    path: "/menu",
    component: Layout,
    children: [
      {
        path: 'index',
        meta: {
          title: '菜单列表'
        },
        component: () => import('@pages/menu/index.vue')
      },
      {
        path: 'detail',
        meta: {
          title: '添加菜单'
        },
        component: () => import('@pages/menu/detail.vue'),
      }
    ]
  },
  {
    path: "/addShop",
    component: Layout,
    children: [
      {
        path: 'index',
        meta: {
          title: '添加商铺'
        },
        component: () => import('@pages/addShop/index.vue')
      }
    ]
  }
];

export const noAuthRouter = { path: '/:pathMatch(.*)*', redirect: '/noAuth/index' }

export default createRouter({
  scrollBehavior: () => ({ top: 0 }),
  history: createWebHistory(),
  routes: constantRouterMap
})
