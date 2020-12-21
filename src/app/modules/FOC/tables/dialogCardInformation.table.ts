import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Credit Card Name',
    field: 'creditCardName',
    name: 'creditCardName',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Number',
    field: 'number',
    name: 'number',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Expired Month',
    field: 'expiredMonth',
    name: 'expiredMonth',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Expired Year',
    field: 'expiredYear',
    name: 'expiredYear',
    align: 'left',
    sortable: true,
  },
];
