import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Reservation Name',
    field: 'resv-name',
    name: 'resv-name',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'gname',
    name: 'gname',
    sortable: true,
  },
  {
    label: 'Room Number',
    field: 'rmno',
    name: 'rmno',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Check In',
    field: 'ci',
    name: 'ci',
    sortable: true,
  },
  {
    label: 'Check Out',
    field: 'co',
    name: 'co',
    sortable: true,
  },
  {
    label: 'Balance',
    field: 'balanced',
    name: 'balanced',
    sortable: true,
  },
];
