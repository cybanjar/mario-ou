import { TableHeader } from '~/components/VhpUI/typings';

export const ResTableHeaders: TableHeader[] = [
  {
    label: 'Number',
    field: 'waehrungsnr',
    name: 'waehrungsnr',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Code',
    field: 'wabkurz',
    name: 'wabkurz',
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
    label: 'Purchase',
    field: 'ankauf',
    name: 'ankauf',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Sales',
    field: 'verkauf',
    name: 'verkauf',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Unit',
    field: 'einheit',
    name: 'einheit',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Last Update',
    field: 'geaendert',
    name: 'geaendert',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Rate',
    field: 'betriebsnr',
    name: 'betriebsnr',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
