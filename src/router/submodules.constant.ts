import { ModuleAbbr } from '~/app/constants/module.constant';
import { PageItem } from './pageList';

type ModuleAsUnion = keyof typeof ModuleAbbr;

type Pages = {
  [S in ModuleAsUnion]-?: PageItem;
};

export const SUBMODULES: Pages = {
  // FOC: [
  //   'Guest Folio',
  //   'Nonguest Folio',
  //   'Master Folio',
  //   'Closed Folio',
  //   'Reservation Deposit',
  //   'Individual Check Out',
  //   'Group Check Out',
  //   'Quick Posting To Guest Folio',
  //   'Money Change Posting',
  //   'Foreign Currency Exchange Rate',
  //   'Report Fo Transaction',
  //   'Report Booking Journal By User',
  //   'Report Payment Journal By User',
  //   'Report Fo Cancellation',
  //   'Report Outstanding Folio',
  //   'Report Today Departed Guest',
  //   'Report Over Credit Limit',
  //   'Report Departed Unbalance Guest',
  // ],
  GL: {
    routes: [
      {
        name: 'Chart Of Accounts',
        pathParent: '/',
      },
      {
        name: 'General Journal',
        pathParent: '/gl/chart-of-accounts',
      },
      {
        name: 'General Ledger',
        pathParent: '/gl/chart-of-accounts',
      },
      { name: 'Posting', pathParent: '/gl/chart-of-accounts' },
      { name: 'Profit And Loss Budget', pathParent: '/gl/chart-of-accounts' },
      {
        name: 'Accounting Date Parameter',
        pathParent: '/gl/chart-of-accounts',
      },
      { name: 'Closing', pathParent: '/gl/chart-of-accounts' },
    ],
    title: 'General Ledger',
    reports: [
      {
        name: 'Trial Balance',
        keyword: 'General-Ledger',
        pathParent: '/gl/chart-of-accounts',
      },
    ],
  },
  HK: {
    routes: [
      { name: 'Overview', pathParent: '/' },
      { name: 'Room Status Admin', pathParent: '/hk/overview' },
      { name: 'Out Of Order', pathParent: '/hk/overview' },
      { name: 'Rooming List', pathParent: '/hk/overview' },
      { name: 'Discrepancy', pathParent: '/hk/overview' },
      { name: 'Lost And Found', pathParent: '/hk/overview' },
      { name: 'Guest Preference List', pathParent: '/hk/overview' },
      { name: 'Trace', pathParent: '/hk/overview' },
    ],
    title: 'Housekeeping',
    reports: [
      {
        name: 'Room Attendance Report',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Auto Room Attendant Report',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Daily Room Usage List',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Room Count Sheet Report',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Reservation Room Plan Report',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Guests Birthday List',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Task Report List',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'VIP Guest List',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Guest History List',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Room Change Report',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Room Occupancy Forecast',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
      {
        name: 'Extra Bed Availability',
        keyword: 'Housekeeping',
        pathParent: '/hk/overview',
      },
    ],
  },
  PU: {
    routes: [
      {
        name: 'Purchase Requisition',
        pathParent: '/pu/purchase-order',
      },
      {
        name: 'Daily Market',
        pathParent: '/pu/purchase-order',
      },
      {
        name: 'Purchase Order',
        pathParent: '/',
      },
      {
        name: 'Supplier Quotation',
        pathParent: '/pu/purchase-order',
      },
    ],
    title: 'Purchasing',
    reports: [
      {
        name: 'Purchase Book',
        pathParent: '/pu/purchase-order',
        keyword: 'Purchasing',
      },
      {
        name: 'Stock Item Ordered',
        pathParent: '/pu/purchase-order',
        keyword: 'Purchasing',
      },
      {
        name: 'Outstanding Purchase Order',
        pathParent: '/pu/purchase-order',
        keyword: 'Purchasing',
      },
      {
        name: 'Expired Purchase Order',
        pathParent: '/pu/purchase-order',
        keyword: 'Purchasing',
      },
    ],
  },
  EG: {
    routes: [
      { name: 'Work Order', pathParent: '/' },
      { name: 'Item', pathParent: '/eg/work-order' },
      { name: 'Item Measurement', pathParent: '/eg/work-order' },
      { name: 'Maintenance Calendar', pathParent: '/eg/work-order' },
      { name: 'Resource Usage And Budget', pathParent: '/eg/work-order' },
    ],
    title: 'Engineering',
    reports: [
      {
        name: 'Finishing Of Repair Job',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'Cancelled Work Order',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'Maintenance',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'Cancelled Maintenance',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'Repaired Item',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'Moving Item',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'Detail Moving Item',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'Repair Cost By Room',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
      {
        name: 'KPI Report',
        pathParent: '/eg/work-order',
        keyword: 'Engineering',
      },
    ],
  },
  FR: {
    routes: [
      { name: 'Guest Profile', pathParent: '/fr/reservation' },
      { name: 'Reservation', pathParent: '/' },
      { name: 'Reservation By Creation Date', pathParent: '/fr/reservation' },
      {
        name: 'Reinstate Cancelled Reservation',
        pathParent: '/fr/reservation',
      },
      { name: 'Room Plan', pathParent: '/fr/reservation' },
      { name: 'Floor Plan', pathParent: '/fr/reservation' },
      { name: 'Group Check-in', pathParent: '/fr/reservation' },
    ],
    title: 'Front Office Reception',
    reports: [],
  },
  FA: {
    routes: [
      {
        name: 'Fixed Asset Item',
        pathParent: '/fa/report/fixed-asset-valuation',
      },
      {
        name: 'Fixed Asset Purchase Order',
        pathParent: '/fa/report/fixed-asset-valuation',
      },
      {
        name: 'Fixed Asset Incoming',
        pathParent: '/fa/report/fixed-asset-valuation',
      },
      {
        name: 'Depreciation Journalizing',
        pathParent: '/fa/report/fixed-asset-valuation',
      },
      { name: 'Journal', pathParent: '/fa/report/fixed-asset-valuation' },
      { name: 'Ledger', pathParent: '/fa/report/fixed-asset-valuation' },
    ],
    title: 'Fixed Asset',
    reports: [
      {
        name: 'Fixed Asset Valuation',
        keyword: 'Engineering',
        pathParent: '/',
      },
      {
        name: 'Fixed Asset Cancelled Incoming',
        keyword: 'Engineering',
        pathParent: '/fa/report/fixed-asset-valuation',
      },
    ],
  },
  AP: {
    routes: [
      { name: 'Supplier Profile', pathParent: '/ap/report/ap-aging' },
      { name: 'Purchase Order', pathParent: '/ap/report/ap-aging' },
      { name: 'Outstanding And Balance AP', pathParent: '/ap/report/ap-aging' },
      { name: 'AP Payment', pathParent: '/ap/report/ap-aging' },
      { name: 'Journal', pathParent: '/ap/report/ap-aging' },
      { name: 'Ledger', pathParent: '/ap/report/ap-aging' },
      { name: 'Journalizing', pathParent: '/ap/report/ap-aging' },
    ],
    title: 'Accounts Payable',
    reports: [
      {
        name: 'Outstanding AP',
        keyword: 'Accounts Payable',
        pathParent: '/ap/report/ap-aging',
      },
      {
        name: 'Paid AP',
        keyword: 'Accounts Payable',
        pathParent: '/ap/report/ap-aging',
      },
      { name: 'AP Aging', keyword: 'Accounts Payable', pathParent: '/' },
    ],
  },
  AR: {
    routes: [
      {
        name: 'Statement Of Account',
        pathParent: '/ar/report/ar-aging-balance',
      },
      { name: 'Reminder Letter', pathParent: '/ar/report/ar-aging-balance' },
      { name: 'Detail Transaction', pathParent: '/ar/report/ar-aging-balance' },
      { name: 'AR Outstanding', pathParent: '/ar/report/ar-aging-balance' },
      { name: 'Payment', pathParent: '/ar/report/ar-aging-balance' },
      { name: 'Journalizing', pathParent: '/ar/report/ar-aging-balance' },
      { name: 'Journal', pathParent: '/ar/report/ar-aging-balance' },
      { name: 'Ledger', pathParent: '/ar/report/ar-aging-balance' },
    ],
    title: 'Accounts Receivable',
    reports: [
      {
        name: 'AR Aging Balance',
        keyword: 'Accounts Receivable',
        pathParent: '/',
      },
      {
        name: 'Contract Rate',
        keyword: 'Accounts Receivable',
        pathParent: '/ar/report/ar-aging-balance',
      },
      {
        name: 'FO Transaction',
        keyword: 'Accounts Receivable',
        pathParent: '/ar/report/ar-aging-balance',
      },
      {
        name: 'Guest History',
        keyword: 'Accounts Receivable',
        pathParent: '/ar/report/ar-aging-balance',
      },
      {
        name: 'Outlet Transaction',
        keyword: 'Accounts Receivable',
        pathParent: '/ar/report/ar-aging-balance',
      },
      {
        name: 'Paid AR',
        keyword: 'Accounts Receivable',
        pathParent: '/ar/report/ar-aging-balance',
      },
    ],
  },
  TO: {
    routes: [
      {
        name: 'Telephone Operator',
        pathParent: '/',
      },
      {
        name: 'Call Administration',
        pathParent: '/',
      },
      {
        name: 'Department Calls',
        pathParent: '/',
      },
      {
        name: 'Phone Book',
        pathParent: '/',
      },
    ],
    title: 'Telephone Operator',
    reports: [
      {
        name: 'TO Telephone Operator',
        keyword: 'Telephone Operator',
        pathParent: '/',
      }
    ],
  },
  INV: {
    routes: [
      {
        name: 'Reorg-SOH',
        pathParent: '/'
      },
      {
        name: 'Journal',
        pathParent: '/',
      },
      {
        name: 'Ledger',
        pathParent: '/',
      },
      {
        name: 'Incoming Journalizing',
        pathParent: '/'
      },
      {
        name: 'Outgoing Journalizing',
        pathParent: '/'
      },
      {
        name: 'Outlet Compliment Journalizing',
        pathParent: '/'
      },
      {
        name: 'Store Requisition',
        pathParent: '/'
      },
      {
        name: 'Recipe',
        pathParent: '/'
      },
      {
        name: 'Stock Item',
        pathParent: '/'
      },
      {
        name: 'Stored withPO',
        pathParent: '/'
      },
      {
        name: 'Incoming Stock',
        pathParent: '/'
      },
      {
        name: 'Stored with outPO',
        pathParent: '/'
      },
      {
        name: 'Incoming StockoutPO',
        pathParent: '/'
      },
      {
        name: 'Issued withPO',
        pathParent: '/'
      },
      {
        name: 'Issued withoutPO',
        pathParent: '/'
      },
      {
        name: 'Incoming StockIssuedwithoutPO',
        pathParent: '/'
      },
      {
        name: 'Stored withDML',
        pathParent: '/'
      },
      {
        name: 'Issued withDML',
        pathParent: '/'
      },
      {
        name: 'Inter Kitchen Transfer',
        pathParent: '/'
      },
      {
        name: 'Stock Item Transform',
        pathParent: '/'
      },
      {
        name: 'Inter Store Transfer',
        pathParent: '/'
      },
      {
        name: 'Issuing',
        pathParent: '/'
      },

    ],
    title: 'Reorg-SOH',
    reports: [
      {
        name: 'INV Inventory',
        keyword: 'Inventory',
        pathParent: '/'
      }
    ]
  },
  GC: {
    routes: [
      {
        name: 'Cash Advance',
        pathParent: '/gc/report/summary-cashier',
      },
      {
        name: 'Journal',
        pathParent: '/gc/report/summary-cashier',
      },
      {
        name: 'Ledger',
        pathParent: '/gc/report/summary-cashier',
      },
    ],
    title: 'General Cashier Report List',
    reports: [
      {
        name: 'Front Office Cash Summary',
        keyword: 'General-Cashier',
        pathParent: '/gc/report/summary-cashier',
      },
      {
        name: 'Outlet Cash Summary',
        keyword: 'General-Cashier',
        pathParent: '/gc/report/summary-cashier',
      },
      {
        name: 'Summary Cashier',
        keyword: 'General-Cashier',
        pathParent: '/',
      },
    ],
  },
  OU: {
    routes: [
      {
        name: 'Main',
        pathParent: '/',
      },
    ],
    title: 'Outlet Reports',
    reports: [
      {
        name: 'Meal Coupon',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Breakfast',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Laundry Compliment',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Occupied Table',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Order Taker Report',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Outlet Turnover',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Outlet User Transaction',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Outlet Bill Transaction',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Outlet Article Transaction',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Outlet Shift Revenue And Cost',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Join To Guest Folio',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Drugstore Report',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Daily Sales By User',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Compliment Report',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Cancellation Journal',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Article Transaction',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      },
      {
        name: 'Actual And RecipeCost',
        keyword: 'Outlet',
        pathParent: '/ou/main',
      }
    ],
    
  },
};
