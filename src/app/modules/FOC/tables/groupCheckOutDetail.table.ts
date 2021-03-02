import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Reservation From',
    field: 'resname',
    name: 'resname',
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
    label: 'Arrival',
    field: 'rq',
    name: 'rq',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Departure',
    field: 'departure',
    name: 'departure',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Room Type',
    field: 'departed',
    name: 'departed',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Adult',
    field: 'inhouse',
    name: 'inhouse',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Compliment',
    field: 'ankufat',
    name: 'ankufat',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Reservation Status',
    field: 'ankufat',
    name: 'ankufat',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
