import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Date',
    field: 'DATE',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Storage Number',
    field: 'st',
    sortable: false,
    align: 'right',
  },
  {
    label: 'Supplier',
    field: 'supplier',
    align: 'left',
  },
  {
    label: 'Article Number',
    field: 'artnr',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Description',
    field: 'DESCRIPTION',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Delivery Unit',
    field: 'd-unit',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Price',
    field: 'price',
    sortable: false,
  },
  {
    label: 'Incoming Quantity',
    field: 'inc-qty',
    sortable: false,
  },
  {
    label: 'Amount',
    field: 'amount',
    sortable: false,
  },
  {
    label: 'Document Number',
    field: 'docu-no',
    sortable: false,
    align: 'left',
  },
  {
    label: 'ID',
    field: 'ID',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Delivery Note',
    field: 'deliv-note',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Invoice Number',
    field: 'invoice-nr',
    sortable: false,
    align: 'left',
  },
];
