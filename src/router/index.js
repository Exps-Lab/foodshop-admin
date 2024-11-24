import { createRouter, createWebHashHistory } from "vue-router";
import { markRaw } from 'vue'
import LayoutComponent from "../pages/layout/Layout.vue";
const Layout = markRaw(LayoutComponent)

export const constantRouterMap = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: 'dashboard',
        meta: {
          title: '首页'
        },
        component: () => import('@pages/dashboard/index.vue')
      }
    ]
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
    path: '/user',
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
    meta: {
      title: '菜单管理'
    },
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
          title: '菜单配置'
        },
        component: () => import('@pages/menu/detail.vue'),
      }
    ]
  },
  {
    path: "/shop",
    component: Layout,
    children: [
      {
        path: 'index',
        meta: {
          title: '商铺列表'
        },
        component: () => import('@pages/shop/index.vue')
      },
      {
        path: 'detail',
        meta: {
          title: '商铺配置'
        },
        component: () => import('@pages/shop/detail.vue')
      }
    ]
  },
  {
    path: "/goods",
    component: Layout,
    children: [
      {
        path: 'index',
        meta: {
          title: '商品列表'
        },
        component: () => import('@pages/goods/index.vue')
      },
      {
        path: 'detail',
        meta: {
          title: '商品配置'
        },
        component: () => import('@pages/goods/detail.vue')
      },
      {
        path: 'categoryList',
        meta: {
          title: '商铺分类列表'
        },
        component: () => import('@pages/goods/categoryList.vue')
      }
    ]
  }
];

export const noAuthRouter = { path: '/:pathMatch(.*)*', redirect: '/noAuth/index' }

export default createRouter({
  scrollBehavior: () => ({ top: 0 }),
  history: createWebHashHistory(),
  routes: constantRouterMap
})
