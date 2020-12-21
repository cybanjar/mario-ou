import { RouteConfig } from 'vue-router';
import { PAGE_ROUTES } from './pageList';

const MODULE_ROUTES: RouteConfig[] = Object.values(PAGE_ROUTES)
  .flat()
  .map(({ path, name, componentName, meta }) => ({
    path,
    name,
    component: () => import(`../app/modules/${componentName}`),
    meta,
  }));

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('~/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'PageHome',
        component: () => import('~/app/home/PageHome.vue'),
        meta: {
          pathParent: '/',
        },
      },
      ...MODULE_ROUTES,
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('~/app/auth/PageAuthLogin.vue'),
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

// const pages = [];

// routes[0].children.forEach((r) => {
//   if (r.path.includes('/fa/')) {
//     const name = r.name;
//     if (r.path.includes('/fa/report')) {
//       const file = `PageFAReport${name}`;
//       pages.push(file);
//     } else {
//       const file = `PageFA${name}`;
//       pages.push(file);
//     }
//   }
// });

// console.log('reports', JSON.stringify(pages));
export default routes;
