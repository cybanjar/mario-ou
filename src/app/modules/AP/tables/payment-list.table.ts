import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { ResPaymentList } from '../models/payment.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const paymentListColumns: TableHeader<ResPaymentList>[] = [
  {
    label: 'Supplier Name',
    field: 'supplier',
    name: 'supplier',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Voucher Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Document Number',
    field: 'docu-nr',
    name: 'docu-nr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Delivery Number',
    field: 'lscheinnr',
    name: 'lscheinnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Bill Date',
    field: (row) =>
      row.rgdatum ? date.formatDate(new Date(row.rgdatum), 'DD/MM/YYYY') : '',
    name: 'rgdatum',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Amount',
    field: (row) => formatterMoney(row.debt),
    name: 'debt',
    sortable: true,
  },
  {
    label: 'Payment Amount',
    field: (row) => formatterMoney(row.credit),
    name: 'credit',
    sortable: true,
  },
  {
    label: 'Balance',
    field: (row) => formatterMoney(row['tot-debt']),
    name: 'tot-debt',
    sortable: true,
  },
  {
    label: 'Due Date',
    field: (row) =>
      row.ziel ? date.formatDate(new Date(row.ziel), 'DD/MM/YYYY') : '',
    name: 'ziel',
    align: 'left',
    sortable: true,
  },
  {
    label: 'ID',
    field: 'user-init',
    name: 'user-init',
    align: 'left',
    sortable: true,
  },
];
