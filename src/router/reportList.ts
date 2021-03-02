// import { ModuleAbbr } from '~/app/constants/module.constant';

// type ModuleAsUnion = keyof typeof ModuleAbbr;
// type ReportList = {
//   [S in ModuleAsUnion]-?: {
//     title: string;
//     reports: {
//       path: string;
//       name: string;
//       keyword: string;
//     }[];
//   };
// };

export const reportList: any = {
  GL: {
    title: 'General Ledger',
    reports: [
      {
        path: 'report/trial-balance',
        name: 'Trial Balance',
        keyword: 'General-Ledger',
      },
    ],
  },
  HK: {
    title: 'Housekeeping',
    reports: [],
  },
  FOC: {
    title: 'Front Office Cashier',
    reports: [
      {
        path: 'report/fo-transaction',
        name: 'FO Transaction',
        keyword: 'FrontOfficeCashier',
      },
      {
        path: 'report/booking-journal-by-user',
        name: 'Booking Journal By User',
        keyword: 'FrontOfficeCashier',
      },
      {
        path: 'report/fo-payment-by-user',
        name: 'FO Payment By User',
        keyword: 'FrontOfficeCashier',
      },
      {
        path: 'report/fo-cancellation',
        name: 'FO Cancellation',
        keyword: 'FrontOfficeCashier',
      },
      {
        path: 'report/outstanding-folio',
        name: 'Outstanding Folio',
        keyword: 'FrontOfficeCashier',
      },
      {
        path: 'report/today-departed-guest',
        name: 'Today Departed Guest',
        keyword: 'FrontOfficeCashier',
      },
      {
        path: 'report/over-credit-limit',
        name: 'Over Credit Limit',
        keyword: 'FrontOfficeCashier',
      },
      {
        path: 'report/departed-unbalance-guest',
        name: 'Departed Unbalance Guest',
        keyword: 'FrontOfficeCashier',
      },
    ],
  },
  AP: {
    title: 'Accounts Payable',
    reports: [],
  },
  AR: {
    title: 'Accounts Receiviable',
    reports: [
      {
        path: 'report/aging-balance',
        name: 'Aging Balance',
        keyword: 'Accounts Receiviable',
      },
      {
        path: 'report/fo-transaction',
        name: 'FO Transaction',
        keyword: 'Accounts Receiviable',
      },
    ],
  },
  PU: {
    title: 'Purchasing',
    reports: [
      {
        path: 'report/purchase-book',
        name: 'Purchase Book',
        keyword: 'Purchasing',
      },
      {
        path: 'report/stock-item-ordered',
        name: 'Stock Item Ordered',
        keyword: 'Purchasing',
      },
      {
        path: 'report/outstanding-purchase-order',
        name: 'Outstanding Purchase Order',
        keyword: 'Purchasing',
      },
      {
        path: 'report/expired-purchase-order',
        name: 'Expired Purchase Order',
        keyword: 'Purchasing',
      },
    ],
  },
};
