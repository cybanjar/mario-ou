interface HomeModule {
  path: string;
  name: string;
  logo: string;
}

export const moduleList: HomeModule[] = [
  {
    path: '/fr/reservation',
    name: 'Front Office Reception',
    logo: 'FOR',
  },
  {
    path: '/foc/guest-folio',
    name: 'Front Office Cashier',
    logo: 'FOC',
  },
  {
    path: '/to/telephone-operator',
    name: 'Telephone Operator',
    logo: 'TO',
  },
  {
    path: '/hk/overview',
    name: 'Housekeeping',
    logo: 'HK',
  },
  {
    path: '/sales-marketing',
    name: 'Sales Marketing',
    logo: 'SM',
  },
  {
    path: '/point-of-sales',
    name: 'Point Of Sales',
    logo: 'POS',
  },
  {
    path: '/banquet',
    name: 'Banquet',
    logo: 'Banquet',
  },
  {
    path: '/ou/menu',
    name: 'Outlet',
    logo: 'Outlet',
  },
  {
    path: '/ar/report/ar-aging-balance',
    name: 'Accounts Receivable',
    logo: 'AR',
  },
  {
    path: '/pu/purchase-order',
    name: 'Purchasing',
    logo: 'Purchasing',
  },
  {
    path: '/inv/incoming-journalizing',
    name: 'Inventory',
    logo: 'Inventory',
  },
  {
    path: '/ap/report/ap-aging',
    name: 'Accounts Payable',
    logo: 'AP',
  },
  {
    path: '/gc/report/summary-cashier',
    name: 'General Cashier',
    logo: 'GC',
  },
  {
    path: '/gl/chart-of-accounts',
    name: 'General Ledger',
    logo: 'GL',
  },
  {
    path: '/fa/report/fixed-asset-valuation',
    name: 'Fixed Assets',
    logo: 'FixedAssets',
  },
  {
    path: '/eg/work-order',
    name: 'Engineering',
    logo: 'Engineering',
  },
  {
    path: '/system-tools',
    name: 'System Tools',
    logo: 'SettingTools',
  },
  {
    path: '/setting',
    name: 'Setting',
    logo: 'Setting',
  },
  {
    path: '/night-audit',
    name: 'Night Audit',
    logo: 'NightAudit',
  },
  {
    path: '/income-audit',
    name: 'Income Audit',
    logo: 'IncomeAudit',
  },
];
