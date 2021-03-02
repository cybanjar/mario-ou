import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Bill Receiver',
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Balance',
    field: 'saldo',
    name: 'saldo',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Print Number',
    field: 'printnr',
    name: 'printnr',
    align: 'right',
    sortable: true,
  },
];
