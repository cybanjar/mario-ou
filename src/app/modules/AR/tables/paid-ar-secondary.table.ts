import { TableActionHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { date } from 'quasar';

export const secondListColumns: TableActionHeader<any>[] = [
  {
    label: 'Article Number',
    field: 'articleNumber',
    name: 'articleNumber',
    classes: 'text-capitalize nowrap pointer',
    sortable: true,
    headerStyle: 'width: 175',
    style: 'width: 175',
  },
  {
    label: 'Bill Number',
    field: 'billNumber',
    name: 'billNumber',
    classes: 'text-capitalize nowrap pointer',
    sortable: true,
    headerStyle: 'width: 175',
    style: 'width: 175',
  },
  {
    label: 'Bill Date',
    field: 'billDate',
    name: 'billDate',
    format: (val) => date.formatDate(val, 'DD/MM/YY'),
    classes: ' text-capitalize',
    sortable: true,
    headerStyle: 'width: 200',
    style: 'width: 200',
  },
  {
    label: 'Balance',
    field: 'balance',
    name: 'balance',
    classes: 'nowrap pointer text-capitalize',
    sortable: true,
    headerStyle: 'width: 150',
    style: 'width: 150',
    format: (val) => (Number.isInteger(val) ? formatterMoney(val) : ''),
  },
  {
    label: 'Description',
    field: 'description',
    name: 'description',
    classes: 'nowrap pointer text-capitalize',
    sortable: true,
    headerStyle: 'width: 150',
    style: 'width: 150',
  },
];
