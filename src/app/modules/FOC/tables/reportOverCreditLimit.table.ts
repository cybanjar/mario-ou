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
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
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
    label: 'Bill Receiver',
    field: 'receiver',
    name: 'receiver',
    sortable: true,
  },
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    sortable: true,
  },
  {
    label: 'Depature',
    field: 'abreise',
    name: 'abreise',
    sortable: true,
  },
  {
    label: 'Credit Limit',
    field: 'c-limit',
    name: 'c-limit',
    sortable: true,
  },
  {
    label: 'Outstanding',
    field: 'saldo',
    name: 'saldo',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'name',
    name: 'name',
    sortable: true,
  },
];
