import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Department',
    field: 'dept',
    name: 'dept',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'desc',
    name: 'desc',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Foreign Amount',
    field: 'fa',
    name: 'fa',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Local Amount',
    field: 'la',
    name: 'la',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
