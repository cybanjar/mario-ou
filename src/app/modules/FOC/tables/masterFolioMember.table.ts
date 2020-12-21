import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'gname',
    name: 'gname',
    align: 'left',
    sortable: true,
  },
  {
    label: 'A',
    field: 'erwachs',
    name: 'erwachs',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    sortable: true,
  },
  {
    label: 'Outstanding',
    field: 'saldo',
    name: 'saldo',
    sortable: true,
  },
  {
    label: 'Status',
    field: 'resstatus',
    name: 'resstatus',
    sortable: true,
  },
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    sortable: true,
  },
  {
    label: 'Departure',
    field: 'abreise',
    name: 'abreise',
    sortable: true,
  },
];
