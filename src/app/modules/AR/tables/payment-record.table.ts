import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { TableActionHeader } from '~/components/VhpUI/typings';
export type PaymentAR = {
  article: number;
  description: string;
  perc: number;
  amount: number;
  remark: string;
  fAmt: string;
  payDate?: Date;
};

export const paymentRecordListColumns: TableActionHeader<PaymentAR>[] = [
  {
    label: 'Article Number',
    style: 'width: 150px',
    headerStyle: 'width: 150px',
    field: 'article',
    name: 'artnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Description',
    style: 'width: 150px',
    headerStyle: 'width: 150px',
    field: 'description',
    name: 'bezeich',
    align: 'left',
    sortable: true,
  },
  {
    label: 'In %',
    style: 'width: 50px',
    headerStyle: 'width: 50px',
    field: 'perc',
    name: 'proz',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Payment Amount',
    style: 'width: 150px',
    headerStyle: 'width: 150px',
    field: 'amount',
    format: (v) => (!Number.isNaN(v) ? formatterMoney(v) : ''),
    name: 'betrag',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Remark',
    style: 'width: 150px',
    headerStyle: 'width: 150px',
    field: 'remark',
    name: 'bemerk',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Foregin Amount',
    style: 'width: 150px',
    headerStyle: 'width: 150px',
    field: 'fAmt',
    name: 'f-amt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    field: 'actions',
    style: 'width: 40px',
    headerStyle: 'width: 40px',
  },
];
