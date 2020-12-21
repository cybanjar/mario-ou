import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'right',
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
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    sortable: true,
  },
  {
    label: 'Department',
    field: 'dept',
    name: 'dept',
    sortable: true,
  },
  {
    label: 'Local Amount',
    field: 'l-amount',
    name: 'l-amount',
    sortable: true,
  },
  {
    label: 'Foreign Amount',
    field: 'f-amount',
    name: 'f-amount',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'gname',
    name: 'gname',
    sortable: true,
  },
  {
    label: 'Time',
    field: 'zeit',
    name: 'zeit',
    sortable: true,
  },
  {
    label: 'ID',
    field: 'ID',
    name: 'ID',
    sortable: true,
  },
];
