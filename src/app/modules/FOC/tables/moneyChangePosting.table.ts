import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    align: 'right',
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
    label: 'Foreign Amount',
    field: 'preis',
    name: 'preis',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Local Amount',
    field: 'betrag',
    name: 'betrag',
    align: 'right',
    sortable: true,
  },
];
