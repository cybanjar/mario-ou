import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Article',
    field: 'artnr',
    name: 'artnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Quantity',
    field: 'anzahl',
    name: 'anzahl',
    align: 'left',
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
    label: 'Foreign Money',
    field: 'fremdwbetrag',
    name: 'fremdwbetrag',
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
    sortable: true,
  },
  {
    label: 'Bill Date',
    field: 'bill-datum',
    name: 'bill-datum',
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
    sortable: true,
  },
  {
    label: 'Time',
    field: 'zeit',
    name: 'zeit',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
