import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory()
    : createWebHashHistory();

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory,
    linkActiveClass: 'active-menu-item',
  });

  router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !useAuthStore().token) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }

    //and to.name !== 'order.dashboard' seguro estoy vamos
    if (from.name === 'orders.dashboard') {
      const answer = window.confirm(
        '¿Realmente desea abandonar la venta actual?'
      );
      if (!answer) {
        return false;
      }
    }
    if (from.name === 'clients.create' && to.name !== 'clients.list') {
      const answer = window.confirm(
        'Perderas los datos del formulario al salir, ¿está seguro?'
      );
      if (!answer) {
        return false;
      }
    }
  });

  return router;
});
