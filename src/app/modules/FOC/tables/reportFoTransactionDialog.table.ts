import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Reservation No',
    field: 'resnr',
    name: 'resnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Reservation No Line',
    field: 'reslinnr',
    name: 'reslinnr',
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
    label: 'Guest Name',
    field: 'name',
    name: 'name',
    sortable: true,
  },
  {
    label: 'Adult',
    field: 'erwachs',
    name: 'erwachs',
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
    label: 'Reservaiton Status',
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
    label: 'Depature',
    field: 'abreise',
    name: 'abreise',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'gname',
    name: 'gname',
    sortable: true,
  },
  {
    label: 'Compliment',
    field: 'gratis',
    name: 'gratis',
    sortable: true,
  },
  {
    label: 'Child 1',
    field: 'kind1',
    name: 'kind1',
    sortable: true,
  },
  {
    label: 'Chiled 2',
    field: 'kind2',
    name: 'kind2',
    sortable: true,
  },
  {
    label: 'Arrangement',
    field: 'arrangement',
    name: 'arrangement',
    sortable: true,
  },
  {
    label: 'Room Rate',
    field: 'zipreis',
    name: 'zipreis',
    sortable: true,
  },
  {
    label: 'Code',
    field: 'wabkurz',
    name: 'wabkurz',
    sortable: true,
  },
];
