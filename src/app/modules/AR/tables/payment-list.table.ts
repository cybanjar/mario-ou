import { date } from 'quasar';
import { TableActionHeader } from '~/components/VhpUI/typings';
import { ResPaymentDebtPayList } from '../models/payment.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const paymentListColumns: TableActionHeader<ResPaymentDebtPayList>[] = [
  {
    label: 'Bill Receiver',
    field: 'billname',
    name: 'billname',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'By Date',
    field: (row) =>
      row.rgdatum ? date.formatDate(new Date(row.rgdatum), 'DD-MM-YY') : '',
    name: 'rgdatum',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Debt Amount',
    field: 'debt',
    name: 'debt',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Payment Amount',
    field: (row) => formatterMoney(row.debt),
    name: 'tot-debt',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Balance',
    field: 'credit',
    format: (it: number) => formatterMoney(it),
    name: 'credit',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Reference Number',
    field: 'refno',
    name: 'refno',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Remark',
    field: 'remarks',
    name: 'remarks',
    align: 'left',
    sortable: true,
    format: (a) => a.as,
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Id',
    field: 'user-init',
    name: 'user-init',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'gastname',
    name: 'gastname',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Foreign Amount',
    field: 'debt-foreign', //(row) => formatterMoney(row?.['debt-foreign']),
    name: 'debt-foreign',
    format: (val: number) => formatterMoney(val),
    align: 'left',
    sortable: true,
  },
  {
    label: 'Currency',
    field: 'currency',
    name: 'currency',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Voucher Number',
    field: 'vouc-nr',
    name: 'vouc-nr',
    align: 'left',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
