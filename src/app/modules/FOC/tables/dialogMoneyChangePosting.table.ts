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
    label: 'Guest name',
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Arrangment Code',
    field: 'ac',
    name: 'ac',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Arrival',
    field: 'ankufat',
    name: 'ankufat',
    sortable: true,
  },
  {
    label: 'Departure',
    field: 'departure',
    name: 'departure',
    sortable: true,
  },
];
