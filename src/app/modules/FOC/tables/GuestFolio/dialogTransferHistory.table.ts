import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Folio Number',
    field: 'rechnr',
    name: 'rechnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Amount',
    field: 'betrag',
    name: 'betrag',
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
    label: 'Outlet Number',
    field: 'departement',
    name: 'departement',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Time',
    field: 'zeit',
    name: 'zeit',
    align: 'left',
    sortable: true,
  },
  {
    label: 'ID',
    field: 'userinit',
    name: 'userinit',
    align: 'left',
    sortable: true,
  },
  {
    label: 'System Date',
    field: 'sysdate',
    name: 'sysdate',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'item-name',
    name: 'item-name',
    align: 'left',
    sortable: true,
  },
];
