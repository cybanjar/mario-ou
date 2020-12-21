import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { ResPurchaseOrderDetail } from '../models/purchase-order.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const purchaseOrderDetailColumns: TableHeader<
  ResPurchaseOrderDetail
>[] = [
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Delivery Unit',
    field: (row) => row['lief-fax'][2],
    name: 'delivery-unit',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Content',
    field: 'txtnr',
    name: 'txtnr',
    sortable: true,
  },
  {
    label: 'Ordered Quantity',
    field: 'anzahl',
    name: 'anzahl',
    sortable: true,
  },
  {
    label: 'Delivered Delivery Unit',
    field: (row) => formatterMoney(row.geliefert),
    name: 'geliefert',
    sortable: true,
  },
  {
    label: 'Unit Price',
    field: (row) => formatterMoney(row.einzelpreis),
    name: 'einzelpreis',
    sortable: true,
  },
  {
    label: 'Amount',
    field: (row) => formatterMoney(row.warenwert),
    name: 'warenwert',
    sortable: true,
  },
  {
    label: 'Delivery Date',
    field: (row) =>
      row['lieferdatum-eff']
        ? date.formatDate(row['lieferdatum-eff'], 'DD/MM/YYYY')
        : '',
    name: 'lieferdatum-eff',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Mess Unit Quantity',
    field: (row) => formatterMoney(row['angebot-lief'][0]),
    name: 'angebot-lief',
    sortable: true,
  },
  {
    label: 'Unit',
    field: 'masseinheit',
    name: 'masseinheit',
    align: 'left',
    sortable: true,
  },
  {
    label: 'User Receive',
    field: (row) => row['lief-fax'][1],
    name: 'user-receive',
    align: 'left',
    sortable: true,
  },
];
