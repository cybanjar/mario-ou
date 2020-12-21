import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Reservation Name',
    field: 'resname',
    name: 'resname',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Group Name',
    field: 'gname',
    name: 'gname',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Quantity',
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
    label: 'Departed',
    field: 'departed',
    name: 'departed',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Inhouse',
    field: 'inhouse',
    name: 'inhouse',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Arrival',
    field: 'ankufat',
    name: 'ankufat',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
