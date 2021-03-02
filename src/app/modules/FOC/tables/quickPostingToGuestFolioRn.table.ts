import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Arrangement Code',
    field: 'arrangement',
    name: 'arrangement',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Depature',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    sortable: true,
  },
];
