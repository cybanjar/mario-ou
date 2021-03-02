import { ModuleAbbr } from '~/app/constants/module.constant';
import { PageItem } from './pageList';

type ModuleAsUnion = keyof typeof ModuleAbbr;

type Pages = {
  [S in ModuleAsUnion]-?: PageItem;
};

export const SUBMODULES: Pages = {
  FOC: {
    routes: [
      { name: 'Guest Folio', pathParent: '/' },
      { name: 'Master Folio', pathParent: '/' },
      { name: 'Nonguest Folio', pathParent: '/foc/guest-folio' },
      { name: 'Closed Folio', pathParent: '/foc/guest-folio' },
      { name: 'Deposit', pathParent: '/foc/guest-folio' },
      { name: 'Group Check Out', pathParent: '/foc/guest-folio' },
      { name: 'Individual Check Out', pathParent: '/foc/guest-folio' },
    ],
    title: 'Front Office Cashier',
    reports: [
      {
        name: 'Booking Journal By User',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
      {
        name: 'Departed Unbalance Guest',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
      {
        name: 'Fo Cancellation',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
      {
        name: 'Fo Transaction',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
      {
        name: 'Outstanding Folio',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
      {
        name: 'Over Credit Limit',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
      {
        name: 'Payment Journal By User',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
      {
        name: 'Today Departed Guest',
        keyword: 'Front-Office-Cashier',
        pathParent: '/foc/guest-folio',
      },
    ],
  },
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
      {
        name: 'Guest Preference List',
        pathParent: '/hk/guest-preference-list',
      },
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
      { name: 'Confirmation Letter', pathParent: '/fr/reservation' },
      { name: 'Memo Room Number', pathParent: '/fr/reservation' },
      { name: 'Guest Preference', pathParent: '/fr/reservation' },
      { name: 'Reservation Deposit', pathParent: '/fr/reservation' },
      { name: 'Room Revenue Breakdown', pathParent: '/fr/reservation' },
      { name: 'Individual Check-out', pathParent: '/fr/reservation' },
      { name: 'Group Check-out', pathParent: '/fr/reservation' },
      { name: 'Discrepancy', pathParent: '/fr/reservation' },
      { name: 'Trace', pathParent: '/fr/reservation' },
      {
        name: 'Telephone Operator In-house Guest',
        pathParent: '/fr/reservation',
      },
    ],
    title: 'Front Office Reception',
    reports: [
      {
        name: 'Available Room',
        keyword: 'FO Reception',
        pathParent: '/fr/reservation',
      },
    ],
    extraPages: [
      {
        name: 'Guest Profile - View Rates',
        appendPath: '/:id',
        pathParent: '/fr/guest-profile',
      },
      {
        name: 'Manage Reservation',
        appendPath: '/:id',
        pathParent: '/fr/guest-profile',
      },
      {
        name: 'Guest Profile - History',
        appendPath: '/:id',
        pathParent: '/fr/guest-profile',
      },
      {
        name: 'View Allotment',
        appendPath: '/:id',
        pathParent: '/fr/guest-profile',
      },
    ],
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
      },
    ],
  },
  INV: {
    routes: [
      {
        name: 'Reorg-SOH',
        pathParent: '/',
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
        pathParent: '/',
      },
      {
        name: 'Outgoing Journalizing',
        pathParent: '/',
      },
      {
        name: 'Outlet Compliment Journalizing',
        pathParent: '/',
      },
      {
        name: 'Store Requisition',
        pathParent: '/',
      },
      {
        name: 'Recipe',
        pathParent: '/',
      },
      {
        name: 'Stock Item',
        pathParent: '/',
      },
      {
        name: 'Stored With PO',
        pathParent: '/',
      },
      {
        name: 'Incoming Stock',
        pathParent: '/',
      },
      {
        name: 'Stored Without PO',
        pathParent: '/',
      },
      {
        name: 'Incoming Stockout PO',
        pathParent: '/',
      },
      {
        name: 'Issued With PO',
        pathParent: '/',
      },
      {
        name: 'Issued Without PO',
        pathParent: '/',
      },
      {
        name: 'Incoming StockIssuedwithoutPO',
        pathParent: '/',
      },
      {
        name: 'Stored With DML',
        pathParent: '/',
      },
      {
        name: 'Issued With DML',
        pathParent: '/',
      },
      {
        name: 'Inter Kitchen Transfer',
        pathParent: '/',
      },
      {
        name: 'Stock Item Transform',
        pathParent: '/',
      },
      {
        name: 'Inter Store Transfer',
        pathParent: '/',
      },
      {
        name: 'Issuing',
        pathParent: '/',
      },
    ],
    title: 'Inventory',
    reports: [
      {
        name: 'Stock On Hand',
        keyword: 'Inventory',
        pathParent: '/',
      },
      {
        name: 'Slow Moving Stock On Hand',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Incoming',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Cancelled Incoming',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Monthly Incoming',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Yearly Issuing',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Yearly Incoming',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Meal Coupon',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'FB Outlet Flash',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'FB Reconciliation',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Material Reconciliation',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Adjustment Result',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Minimum Stock On Hand',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Maximum Stock On Hand',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Incoming Price Discrepancy',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Moving Stock',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'FB Flash',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'FB Outlet Reconciliation',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Monthly Inter-store Transfer',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Detail Moving Stock',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Cancelled Issuing',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
      {
        name: 'Incoming Return',
        keyword: 'Inventory',
        pathParent: '/inv/report/stock-on-hand',
      },
    ],
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
  IA: {
    routes: [],
    title: 'Income Audit Report',
    reports: [
      {
        name: 'Outstanding Folio',
        keyword: 'Income Audit',
        pathParent: '/',
      },
      {
        name: 'Fo Transaction',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'FO Transaction Per User',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'FO Payment Per User',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'FO Cancellation',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Outlet Turnover',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Cashier Summary',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Guest Ledger',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Today Departed Guest',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Over Credit Limit',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Departed Unbalance Guest',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Daily Report',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
      {
        name: 'Room Revenue Breakdown',
        keyword: 'Income Audit',
        pathParent: '/ia/report/outstanding-folio',
      },
    ],
  },
  NA: {
    routes: [],
    title: 'Night Audit',
    reports: [
      {
        name: 'Night Audit',
        keyword: 'Night Audit',
        pathParent: '/',
      },
      {
        name: 'Fo Transaction',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
      {
        name: 'Outstanding Folio',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
      {
        name: 'Breakfast',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
      {
        name: 'Occupied Table',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
      {
        name: 'Outlet Turnover',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
      {
        name: 'Opened Master bill',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
      {
        name: 'Check In-house Guest Profile',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
      {
        name: 'Competitor Statistic Entry',
        keyword: 'Night Audit',
        pathParent: '/na/report/night-audit',
      },
    ],
  },
  OU: {
    routes: [
      {
        name: 'Menu',
        pathParent: '/',
      },
    ],
    title: 'Outlet Reports',
    reports: [
      {
        name: 'Meal Coupon',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Breakfast',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Laundry Compliment',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Occupied Table',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Order Taker Report',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Outlet Turnover',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Outlet User Transaction',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Outlet Bill Transaction',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Outlet Article Transaction',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Outlet Shift Revenue And Cost',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Join To Guest Folio',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Drugstore Report',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Daily Sales By User',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Compliment Report',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Cancellation Journal',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Actual And Recipe Cost',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Outlet Sales And Cost',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Outlet Sold Menu',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
      {
        name: 'Summary Restaurant Report',
        keyword: 'Outlet',
        pathParent: '/ou/menu',
      },
    ],
  },
  ST: {
    routes: [
      {
        name: 'Daily Report Setup',
        pathParent: '/',
      },
      {
        name: 'Banquet',
        pathParent: '/',
      },
    ],
    title: 'System Setting',
    reports: [
      {
        name: 'Room Meeting Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Table Style Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Room Table Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Source Of Booking Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Departement Instruction Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Default Intruction Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Masterplan Status Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Masterplan Type Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Market Segment Group Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Market Segment Code Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Reservation Type Setup',
        keyword: 'System Setting',
        pathParent: '/st/banquet',
      },
      {
        name: 'Catering Setup',
        keyword: 'System Setting',
        pathParent: '/daily-report-setup',
      },
      {
        name: 'Event Package Setup',
        keyword: 'System Setting',
        pathParent: '/daily-report-setup',
      },
    ],
  },
  SC: {
    routes: [
      {
        name: 'Master Plan',
        pathParent: '/',
      },
      {
        name: 'Sales Activity',
        pathParent: '/',
      },
      {
        name: 'Banquet Plan',
        pathParent: '/',
      },
    ],
    title: 'Banquet Report',
    reports: [
      {
        name: 'Close Masterplan',
        keyword: 'Banquet Report',
        pathParent: '/',
      },
      {
        name: 'Cancel Masterplan',
        keyword: 'Banquet Report',
        pathParent: '/',
      },
      {
        name: 'Forecast By Revenue',
        keyword: 'Banquet Report',
        pathParent: '/test',
      },
      {
        name: 'Forecast By Event Type',
        keyword: 'Banquet Report',
        pathParent: '/test',
      },
      {
        name: 'Banquet Deposit List',
        keyword: 'Banquet Report',
        pathParent: '/test',
      },
      {
        name: 'Close Activity List',
        keyword: 'Banquet Report',
        pathParent: '/test',
      },
    ],
  },
};
