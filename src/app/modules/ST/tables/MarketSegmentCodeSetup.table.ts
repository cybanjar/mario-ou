import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Number',
    field: 'briefnr',
    name: 'briefnr',
    align: 'left',
    sortable: false,
    style: 'width: 70px',
  },
  {
    label: 'Market Name',
    field: 'briefnr',
    name: 'briefnr',
    align: 'left',
    sortable: false,
    style: 'width: 120px',
  },
  {
    label: 'Currency',
    field: 'briefkateg',
    name: 'briefkateg',
    align: 'left',
    sortable: false,
    style: 'width:90px',
  },
  {
    name: 'actions',
    field: 'actions',
    style: 'width: 10px',
  },
];