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

type ExtraPageItem = {
  name: string;
  pathParent: string;

  /** Append path to base path. For example, it can be used to add params to the path */
  appendPath?: string;
};

export type PageItem = {
  routes: RouteItem[];
  title: string;
  reports: ReportItem[];
  extraPages?: ExtraPageItem[];
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

const pageListFOC = ['FoTransaction', 'OutstandingFolio'];
const pageListOU = ['Breakfast', 'OccupiedTable', 'OutletTurnover'];

const pageListIA = [
  'OutstandingFolio',
  'FoTransaction',
  'OverCreditLimit',
  'DepartedUnbalanceGuest',
];
function generateComponent(moduleAbbr, pageName) {
  if (moduleAbbr == 'NA') {
    if (pageListFOC.includes(pageName)) {
      return 'FOC';
    }
    if (pageListOU.includes(pageName)) {
      return 'OU';
    }
    return moduleAbbr;
  }

  if (moduleAbbr == 'IA') {
    if (pageListIA.includes(pageName)) {
      return 'FOC';
    }
    return moduleAbbr;
  }
  return moduleAbbr;
}

export const generatePageItem = (
  moduleAbbr: ModuleAsUnion,
  pageItem: PageItem
) => {
  const { routes, title, reports, extraPages } = pageItem;
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
    const routeName = `${moduleAbbr}${pageName}`;
    PAGE_ROUTES.push({
      name: routeName,
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
    PAGE_META[routeName] = storeItem;
  });

  reportItems.forEach(({ name, pathParent }) => {
    const { pageName, path } = generatePath(moduleAbbr, name, true);
    const moduleAbbr1 = generateComponent(moduleAbbr, pageName);
    const routeName = `${moduleAbbr}${pageName}`;
    PAGE_ROUTES.push({
      name: routeName,
      path,
      componentName: `${moduleAbbr1}/Page${moduleAbbr1}Report${pageName}.vue`,
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

    PAGE_META[routeName] = storeItem;
  });

  extraPages?.forEach(({ name, pathParent, appendPath = '' }) => {
    // Can't use `generatePath` because needs some customization
    const pageName = name.replace(/ /g, '');

    // Ref: https://gist.github.com/codeguy/6684588
    const pathName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const modulePath = moduleAbbr.toLowerCase();
    const path = '/' + modulePath + '/extra/' + pathName + appendPath;

    const routeName = `${moduleAbbr}${pageName}`;

    PAGE_ROUTES.push({
      name: routeName,
      path,
      componentName: `${moduleAbbr}/Page${moduleAbbr}Extra${pageName}.vue`,
      meta: {
        module: moduleAbbr,
        pathParent,
        name,
      },
    });

    const storeItem: StoreItem = {
      reports: reportItems,
      title,
    };
    PAGE_META[routeName] = storeItem;
  });
};

(Object.keys(SUBMODULES) as ModuleAsUnion[]).forEach((moduleName) => {
  generatePageItem(moduleName, SUBMODULES[moduleName]);
});
