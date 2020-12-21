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
    label: 'Number',
    field: 'billnr',
    name: 'billnr',
    align: 'left',
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
    label: 'Bill Receiver',
    field: 'name',
    name: 'name',
    sortable: true,
  },
  {
    label: 'Balance',
    field: 'saldo',
    name: 'saldo',
    sortable: true,
  },
  {
    label: 'Reservaiton Number',
    field: 'resnr',
    name: 'resnr',
    sortable: true,
  },
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    sortable: true,
  },
  {
    label: 'Print Number',
    field: 'printnr',
    name: 'printnr',
    sortable: true,
  },
];
