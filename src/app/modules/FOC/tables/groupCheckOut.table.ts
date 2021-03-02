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
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Group Name',
    field: 'groupname',
    name: 'groupname',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Quantity',
    field: 'zimanz',
    name: 'zimanz',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Departure',
    field: 'dep',
    name: 'dep',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Departed',
    field: 'co',
    name: 'co',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Inhouse',
    field: 'res',
    name: 'res',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Arrival',
    field: 'arr',
    name: 'arr',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
