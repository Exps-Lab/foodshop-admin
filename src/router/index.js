import { createRouter, createWebHistory } from "vue-router";

export const constantRouterMap = [
  {
    path: "",
    redirect: "/userList"
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/login/index.vue')
  },
  {
    path: "/noAuth",
    name: 'noAuthPage',
    component: () => import("@pages/noAuth/index.vue")
  }
];

export const asyncRouterMap = [
  {
    path: '/userList',
    name: 'userList',
    component: () => import('@pages/userList/index.vue')
  },
  {
    path: '/addMenu',
    name: 'addMenu',
    component: () => import('@pages/addMenu/index.vue')
  }
];

export const noAuthRouter = { path: '/:pathMatch(.*)*', redirect: '/noAuth' }

export default createRouter({
  scrollBehavior: () => ({ top: 0 }),
  history: createWebHistory(),
  routes: constantRouterMap
})
