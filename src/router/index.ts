import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import routes from './routes';
import { store } from '~/store';
import { PAGE_META, PAGE_MENU } from './pageList';
import { LayoutState } from '~/layouts/models/storeModel';

Vue.use(VueRouter);

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
});

// this function is to change the contents of the submodule menu
const changeModule = (to: Route) => {
  let currentModule: LayoutState['currentModule'] = null;

  if (to.meta.module) {
    currentModule = {
      subModules: PAGE_MENU[to.meta.module],
      ...PAGE_META[to.name],
    };
  }

  store.commit.layout.SET_CURRENT_MODULE(currentModule);
};

router.beforeEach((to, _, next) => {
  changeModule(to);
  next();
});

export default router;
