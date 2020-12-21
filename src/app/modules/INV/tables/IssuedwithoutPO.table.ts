import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Delivery Note',
    field: 'docu-nr',
    name: 'docu-nr',
    align: 'left',
    sortable: false,
  },
  {
    label: 'St',
    field: 'lager-nr',
    name: 'lager-nr',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Articel Number',
    field: 'artnr',
    name: 'artnr',
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
    label: 'Unit Price',
    field: 'einzelpreis',
    name: 'einzelpreis',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Quanity',
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
    label: 'Suplier Name',
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
