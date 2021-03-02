import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Guest Name',
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Status',
    field: 'resstatus',
    name: 'resstatus',
    align: 'left',
    sortable: true,
  },
];
