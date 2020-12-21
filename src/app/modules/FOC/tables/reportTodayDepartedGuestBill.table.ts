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
    label: 'Rate',
    field: 'epreis',
    name: 'epreis',
    sortable: true,
  },
  {
    label: 'Amount',
    field: 'betrag',
    name: 'betrag',
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
    label: 'Bill Date',
    field: 'bill-datum',
    name: 'bill-datum',
    align: 'right',
    sortable: true,
  },
  {
    label: 'ID',
    field: 'userinit',
    name: 'userinit',
    sortable: true,
  },
  {
    label: 'System Date',
    field: 'sysdate',
    name: 'sysdate',
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
