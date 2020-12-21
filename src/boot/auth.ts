import { boot } from 'quasar/wrappers';
import { Cookies } from 'quasar';
import { store } from '~/store';

export default boot(({ router }) => {
  const authCookie = Cookies.get('userAuth');

  if (authCookie) {
    store.commit.auth.SET_AUTH(authCookie);
  }

  router.beforeEach((to, _, next) => {
    const { user } = store.state.auth;

    if (to.path === '/login') {
      if (user) {
        next('/');
      } else {
        next();
      }
    } else {
      if (user) {
        next();
      } else {
        next('/login');
      }
    }
  });
});
