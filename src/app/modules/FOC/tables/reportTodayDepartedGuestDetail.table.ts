import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    sortable: true,
  },
  {
    label: 'Quantity',
    field: 'anzahl',
    name: 'anzahl',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Price',
    field: 'epreis',
    name: 'epreis',
    sortable: true,
  },
  {
    label: 'Balance',
    field: 'betrag',
    name: 'betrag',
    sortable: true,
  },
  {
    label: 'No',
    field: 'waehrungsnr',
    name: 'waehrungsnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Bill Date',
    field: 'bill-datum',
    name: 'bill-datum',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Time',
    field: 'zeit',
    name: 'zeit',
    align: 'right',
    sortable: true,
  },
];
