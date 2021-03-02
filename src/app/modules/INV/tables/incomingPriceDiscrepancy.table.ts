import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: true,
  },
  {
    label: 'St',
    field: 'lager',
    name: 'lager',
    align: 'left',
    sortable: true,

  },
  {
    label: 'Document No',
    field: 'docu-nr',
    name: 'docu-nr',
    sortable: true,

  },
  {
    label: 'Article',
    field: 'art',
    name: 'art',
    align: 'left',
    sortable: true,

  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: true,

  },
  {
    label: 'Quantity',
    field: 'in-qty',
    name: 'in-qty',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Amount',
    field: 'amount',
    name: 'amount',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Received Price',
    field: 'epreis1',
    name: 'epreis1',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Ordered Price',
    field: 'epreis2',
    name: 'epreis2',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Vendor',
    field: 'lief',
    name: 'lief',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Delivery Note',
    field: 'dlvnote',
    name: 'dlvnote',
    align: 'left',
    sortable: true,

  },
];