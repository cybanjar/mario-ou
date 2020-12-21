import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Delevery Note',
    field: 'docu-nr',
    name: 'docu-nr',
    align: 'left',
    sortable: false,
  },
  {
    label: 'St',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Articel No',
    align: 'left',
    field: 'artnr',
    name: 'artnr',
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
    label: 'Unit Price',
    field: 'einzelpreis',
    name: 'einzelpreis',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Quantity',
    field: 'anzahl',
    name: 'anzahl',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Amount',
    field: 'warenwert',
    name: 'warenwert',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Supplier Name',
    field: 'firma',
    name: 'firma',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: false,
  },
];
