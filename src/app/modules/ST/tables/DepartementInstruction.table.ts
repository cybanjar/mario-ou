import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'BEO Code',
    field: 'number1',
    name: 'number1',
    align: 'left',
    sortable: false,
    style: 'width: 120px',
  },
  {
    label: 'Description',
    field: 'char3',
    name: 'char3',
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
