import { TableHeader } from '~/components/VhpUI/typings';
import { date } from 'quasar';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Order Date',
    name: 'bestelldatum',
    align: 'left',
    field: (row) => date.formatDate(row.bestelldatum, 'DD/MM/YY'),
  },
  {
    label: 'Department',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
  },
  {
    label: 'Supplier Name',
    field: 'firma',
    name: 'firma',
    align: 'left',
  },
  {
    label: 'Purchase Order Number',
    field: 'docu-nr',
    name: 'docu-nr',
    align: 'left',
  },
  {
    label: 'Delivery Date',
    name: 'l-orderhdr-lieferdatum',
    align: 'left',
    field: (row) => date.formatDate(row['l-orderhdr-lieferdatum'], 'DD/MM/YY'),
  },
  {
    label: 'Currency',
    field: 'wabkurz',
    name: 'wabkurz',
    align: 'left',
  },
  {
    label: 'Type of Order',
    field: 'bestellart',
    name: 'bestellart',
    align: 'left',
  },
  {
    label: 'Released Date',
    name: 'gedruckt',
    align: 'left',
    field: (row) => date.formatDate(row.gedruckt, 'DD/MM/YY'),
  },
  {
    label: 'Created By',
    field: 'l-orderhdr-besteller',
    name: 'l-orderhdr-besteller',
    align: 'left',
  },
  {
    label: 'Printed Date',
    field: (row) => date.formatDate(row['l-order-gedruckt'], 'DD/MM/YY'),
    name: 'l-order-gedruckt',
    align: 'left',
  },
  {
    label: 'Time',
    name: 'zeit',
    align: 'left',
    field: (row) =>
      date.formatDate(date.buildDate({ milliseconds: row.zeit }), 'HH:MM:SS'),
  },
  {
    label: 'Changed By',
    field: 'lief-fax-2',
    name: 'lief-fax-2',
    align: 'left',
  },
  {
    label: 'Closed Date',
    name: 'lieferdatum-eff',
    align: 'left',
    field: (row) => date.formatDate(row['lieferdatum-eff'], 'DD/MM/YY'),
  },
  {
    label: 'Order Instruction',
    field: 'lief-fax-3',
    name: 'lief-fax-3',
    align: 'left',
  },
  {
    label: 'Purchase Request Number',
    field: 'lief-fax-1',
    name: 'lief-fax-1',
    align: 'left',
  },
  { name: 'actions', field: 'actions' },
];

export const newPOHeaders: TableHeader[] = [
  {
    label: 'Item Number',
    field: 'artnr',
    name: 'artnr',
    align: 'left',
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
  },
  {
    label: 'Content',
    field: 'einheit',
    name: 'einheit',
  },
  {
    label: 'Quantity',
    field: 'anzahl',
    name: 'anzahl',
    align: 'right',
  },
  {
    label: 'Unit Price',
    field: 'einzelpreis',
    name: 'einzelpreis',
  },
  {
    label: 'Gross Amount',
    field: 'warenwert',
    name: 'warenwert',
  },
  {
    label: 'Discount %',
    field: 'disc',
    name: 'disc',
  },
  {
    label: 'Discount Value',
    field: 'discVal',
    name: 'discVal',
  },
  {
    label: 'Discount % 2',
    field: 'disc2',
    name: 'disc2',
  },
  {
    label: 'Discount Value 2',
    field: 'disc2Val',
    name: 'disc2Val',
  },
  {
    label: 'VAT',
    field: 'vat',
    name: 'vat',
  },
  {
    label: 'Nett Price',
    field: 'nettPrice',
    name: 'nettPrice',
  },
  {
    label: 'Amount',
    field: 'amount',
    name: 'amount',
  },
  {
    label: 'Delivery Unit Price',
    field: 'deliveryUnit',
    name: 'deliveryUnit',
  },
  {
    label: 'Account Number',
    field: 'accountNumber',
    name: 'accountNumber',
  },
  {
    label: 'Item Remark',
    field: 'besteller',
    name: 'besteller',
  },
  { name: 'actions', field: 'actions' },
];
