import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Room Type',
    field: 'flag',
    name: 'flag',
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
    label: 'Room Rate',
    field: 'zipreis',
    name: 'zipreis',
    sortable: true,
  },
  {
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'right',
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
  {
    label: 'Guarantee Of Payment',
    field: 'bill-inst',
    name: 'bill-inst',
    sortable: true,
  },
  {
    label: 'ID Card Number',
    field: 'idcard',
    name: 'idcard',
    sortable: true,
  },
  {
    label: 'Nation',
    field: 'nat',
    name: 'nat',
    sortable: true,
  },
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'right',
    sortable: true,
  },
];
