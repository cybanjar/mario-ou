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
    label: 'Number',
    field: 'billnr',
    name: 'billnr',
    align: 'right',
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
    align: 'left',
    sortable: true,
  },
  {
    label: 'Balance',
    field: 'saldo',
    name: 'saldo',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Reservaiton Number',
    field: 'resnr',
    name: 'resnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Print Number',
    field: 'printnr',
    name: 'printnr',
    align: 'right',
    sortable: true,
  },
];
