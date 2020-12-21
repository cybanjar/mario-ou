import { ResDisplayPayment } from '../models/outstanding-and-balance.model';
import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { date } from 'quasar';

export const displayPaymentColumns: TableHeader<ResDisplayPayment>[] = [
  {
    label: 'Amount',
    field: (row) => formatterMoney(row.netto),
    name: 'netto',
  },
  {
    label: 'Payment Article',
    field: 'zahlkonto',
    name: 'zahlkonto',
    align: 'left',
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
  },
  {
    label: 'Payment Amount',
    field: (row) => formatterMoney(row.saldo),
    name: 'saldo',
  },
  {
    label: 'Payment Date',
    field: (row) => date.formatDate(row.rgdatum, 'DD/MM/YYYYYY'),
    name: 'rgdatum',
    align: 'left',
  },
  {
    label: 'User Name',
    field: 'username',
    name: 'username',
    align: 'left',
  },
];
