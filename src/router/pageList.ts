import { ModuleAbbr } from '~/app/constants/module.constant';
import { SUBMODULES } from './submodules.constant';
type ModuleAsUnion = keyof typeof ModuleAbbr;
type RouteItem = {
  name: string;
  path?: string;
  pathParent?: string;
  componentName?: string;
  meta?: {
    module: string;
    pathParent: string;
    name: string;
  };
};

type ReportItem = {
  name: string;
  keyword: string;
  pathParent: string;
};

export type PageItem = {
  routes: RouteItem[];
  title: string;
  reports: ReportItem[];
};

export type StoreItem = {
  title: string;
  reports: ReportItem[];
};
type PageMeta = {
  [key: string]: StoreItem;
};

export type MenuItem = {
  icon: string;
  name: string;
  path: string;
};
type PageMenu = {
  [S in ModuleAsUnion]?: MenuItem[];
};

export const PAGE_META: PageMeta = {};
export const PAGE_MENU: PageMenu = {};
export const PAGE_ROUTES: RouteItem[] = [];

function generatePath(
  moduleAbbr: ModuleAsUnion,
  name: string,
  isReport = false
) {
  const pageName = name.replace(/ /g, '');
  const pathName = name.replace(/\s+/g, '-').toLowerCase();
  const modulePath = moduleAbbr.toLowerCase();
  const reportPath = isReport ? '/report/' : '/';
  const path = '/' + modulePath + reportPath + pathName;
  return { pageName, path };
}

export const generatePageItem = (
  moduleAbbr: ModuleAsUnion,
  pageItem: PageItem
) => {
  const { routes, title, reports } = pageItem;
  PAGE_MENU[moduleAbbr] = [];
  const reportItems = reports.map((report) => {
    const { path } = generatePath(moduleAbbr, report.name, true);
    
    return {
      ...report,
      path,
    };
  });

  routes.forEach(({ name, pathParent }) => {
    const { pageName, path } = generatePath(moduleAbbr, name);
    PAGE_ROUTES.push({
      name: `${moduleAbbr}${pageName}`,
      path,
      componentName: `${moduleAbbr}/Page${moduleAbbr}${pageName}.vue`,
      meta: {
        module: moduleAbbr,
        pathParent,
        name,
      },
    });

    PAGE_MENU[moduleAbbr].push({
      icon: `${moduleAbbr}/Icon-${pageName}`,
      name,
      path,
    });

    const storeItem: StoreItem = {
      reports: reportItems,
      title,
    };

    PAGE_META[path] = storeItem;
  });

  reportItems.forEach(({ name, pathParent }) => {
    const { pageName, path } = generatePath(moduleAbbr, name, true);

    PAGE_ROUTES.push({
      name: `${moduleAbbr}${pageName}`,
      path,
      componentName: `${moduleAbbr}/Page${moduleAbbr}Report${pageName}.vue`,
      meta: {
        module: moduleAbbr,
        pathParent: pathParent,
        name: name,
      },
    });

    const storeItem: StoreItem = {
      reports: reportItems,
      title,
    };

    PAGE_META[path] = storeItem;
  });
};

(Object.keys(SUBMODULES) as ModuleAsUnion[]).forEach((moduleName) => {
  generatePageItem(moduleName, SUBMODULES[moduleName]);
});
