import { date } from 'quasar';
import { TableActionHeader } from '~/components/VhpUI/typings';
import { APList } from '../models/outstanding-and-balance.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const apListColumns: TableActionHeader<APList>[] = [
  {
    label: 'Supplier Name',
    field: 'firma',
    name: 'firma',
    align: 'left',
  },
  {
    label: 'Bill Date',
    field: (row) =>
      row.billdate ? date.formatDate(row.billdate, 'DD/MM/YYYYYY') : '',
    name: 'billdate',
    align: 'left',
  },
  {
    label: 'Document Number',
    field: 'docunr',
    name: 'docunr',
    align: 'left',
  },
  {
    label: 'Delivery Number',
    field: 'lscheinnr',
    name: 'lscheinnr',
    align: 'left',
  },
  {
    label: 'Amount',
    field: (row) => formatterMoney(row.amount),
    name: 'amount',
  },
  {
    label: 'Payment Amount',
    field: (row) => formatterMoney(row['paid-amount']),
    name: 'paid-amount',
  },
  {
    label: 'Payment Date',
    field: (row) => date.formatDate(row.paiddate, 'DD/MM/YYYYYY'),
    name: 'paiddate',
    align: 'left',
  },
  {
    label: 'Balance',
    field: (row) => formatterMoney(row.balance),
    name: 'balance',
  },
  {
    label: 'Due Date',
    field: (row) =>
      row.duedate ? date.formatDate(row.duedate, 'DD/MM/YYYYYY') : '',
    name: 'duedate',
    align: 'left',
  },
  {
    label: 'Remark',
    field: 'desc1',
    name: 'desc1',
    align: 'left',
  },
  { name: 'actions', field: 'actions' },
];
