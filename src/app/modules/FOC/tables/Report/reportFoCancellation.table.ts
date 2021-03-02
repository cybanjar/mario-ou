import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    sortable: true,
  },
  {
    label: 'Department',
    field: 'dept',
    name: 'dept',
    sortable: true,
  },
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
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
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Cancle Reason',
    field: 'canc-reason',
    name: 'canc-reason',
    sortable: true,
  },
  {
    label: 'Room Quantitiy',
    field: 'qty',
    name: 'qty',
    sortable: true,
  },
  {
    label: 'Amount',
    field: 'amount',
    name: 'amount',
    sortable: true,
  },
  {
    label: 'Time',
    field: 'zeit',
    name: 'zeit',
    sortable: true,
  },
  {
    label: 'ID',
    field: 'ID',
    name: 'ID',
    sortable: true,
  },
];
