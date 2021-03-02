import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Supplier',
    field: 'lief',
    name: 'lief',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Quantity',
    field: 'qty',
    name: 'qty',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Unit Price',
    field: 'epreis',
    name: 'epreis',
    sortable: false,
  },
  {
    label: 'Amount',
    field: 'amount',
    name: 'amount',
    sortable: false,
  },
  {
    label: 'Return Reason',
    field: 'reason',
    name: 'reason',
    sortable: false,
  },
  {
    label: 'ID',
    field: 'id',
    name: 'id',
    sortable: false,
  },
  {
    label: 'Deliver Note',
    field: 'dlvnote',
    name: 'dlvnote',
    sortable: false,
  },
  {
    label: 'Storage',
    field: 'lager',
    name: 'lager',
    sortable: false,
  },
];
