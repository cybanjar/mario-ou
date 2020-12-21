import { date } from 'quasar';
import { TableActionHeader } from '~/components/VhpUI/typings';
import { ResPurchaseOrderList } from '../models/purchase-order.model';
import { displayTime } from '~/app/helpers/displayTime.helper';

export const purchaseOrderListColumns: TableActionHeader<
  ResPurchaseOrderList
>[] = [
  {
    label: 'Order Date',
    field: (row) => date.formatDate(row.bestelldatum, 'DD/MM/YYYY'),
    name: 'bestelldatum',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Department',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Supplier Name',
    field: 'firma',
    name: 'firma',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Purchase Order Number',
    field: 'docu-nr',
    name: 'docu-nr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Delivery Date',
    field: (row) => date.formatDate(row['l-orderhdr-lieferdatum'], 'DD/MM/YYYY'),
    name: 'l-orderhdr-lieferdatum',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Currency',
    field: 'wabkurz',
    name: 'wabkurz',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Type Of Order',
    field: 'bestellart',
    name: 'bestellart',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Released Date',
    field: (row) =>
      row.gedruckt ? date.formatDate(row.gedruckt, 'DD/MM/YYYY') : '',
    name: 'gedruckt',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Created By',
    field: 'l-orderhdr-besteller',
    name: 'l-orderhdr-besteller',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Printed Date',
    field: (row) =>
      row['l-order-gedruckt']
        ? date.formatDate(row['l-order-gedruckt'], 'DD/MM/YYYY')
        : '',
    name: 'l-order-gedruckt',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Printed Time',
    field: (row) => displayTime(row.zeit),
    name: 'zeit',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Changed By',
    field: 'lief-fax-2',
    name: 'lief-fax-2',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Close Date',
    field: (row) =>
      row['lieferdatum-eff']
        ? date.formatDate(row['lieferdatum-eff'], 'DD/MM/YYYY')
        : '',
    name: 'lieferdatum-eff',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Order Instruction',
    field: 'lief-fax-3',
    name: 'lief-fax-3',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Purchase Request Number',
    field: 'lief-fax-1',
    name: 'lief-fax-1',
    align: 'left',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
