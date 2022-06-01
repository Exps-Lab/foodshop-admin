import { createRouter, createWebHistory } from "vue-router";

export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/login/index.vue')
  },
  {
    path: "/noAuth",
    name: 'noAuthPage',
    component: () => import("@pages/noAuthPage/index.vue")
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

export default createRouter({
  history: createWebHistory(),
  routes: constantRouterMap
})