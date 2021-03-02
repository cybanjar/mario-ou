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
    label: 'Adult',
    field: 'erwachs',
    name: 'erwachs',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Folio Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Outstanding',
    field: 'saldo',
    name: 'saldo',
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
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Departure',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    sortable: true,
  },
];
