import NProgress from "nprogress";
import "nprogress/nprogress.css";
import routerInstance from '@router'
import { getToken } from "@utils/login_token"
import { authStore } from '@store/auth'

accessControl(routerInstance)

function accessControl (router) {
  NProgress.configure({
    showSpinner: false
  });

  const whiteList = ["/login"];
  router.beforeEach((to, from, next) => {
    NProgress.start();

    if (getToken()) {
      if (to.path === "/login") {
        next('/');
      } else {
        dealUsrAuth(to, from, next, router);
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next("/login");
      }
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

// 处理不同权限用户可访问的路由
function dealUsrAuth (to, from, next, router) {
  const store = authStore()
  if (store.routes.length === 0) {
    store.generateRoutes().then(() => {
      store.routes.forEach(item => {
        router.addRoute(item)
      });

      next({...to, replace: true})
    });
  } else {
    next()
  }
}
