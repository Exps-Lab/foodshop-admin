import { createRouter, createWebHistory } from "vue-router";
import Layout from "../pages/layout/Layout.vue";

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
    path: "/userList",
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@pages/userList/index.vue')
      }
    ]
  },
  {
    path: "/addMenu",
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@pages/addMenu/index.vue')
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
