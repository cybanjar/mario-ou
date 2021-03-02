import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Outlet',
    field: 'dept',
    name: 'dept',
    align: 'left',
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
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Quantity',
    field: 'anzahl',
    name: 'anzahl',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Price',
    field: 'preis',
    name: 'preis',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Amount',
    field: 'betrag',
    name: 'betrag',
    align: 'right',
    sortable: true,
  },
];
