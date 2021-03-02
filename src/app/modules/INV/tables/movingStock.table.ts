import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
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
    label: 'Begin Quantity',
    field: 'prevqty',
    name: 'prevqty',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Begin Value',
    field: 'prevval',
    name: 'prevval',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Incoming Quantity',
    field: 'incoming',
    name: 'incoming',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Outgoing Quantity',
    field: 'outgoing',
    name: 'outgoing',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Ending Quantity',
    field: 'actqty',
    name: 'actqty',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Ending Value',
    field: 'actval',
    name: 'actval',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Avarage Price',
    field: 'avrg-pr',
    name: 'avrg-pr',
    align: 'right',
    sortable: true,

  },
];