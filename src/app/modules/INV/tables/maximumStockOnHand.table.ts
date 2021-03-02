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
    label: 'Name',
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,

  },
  {
    label: 'Maximum On Hand',
    field: 'max-oh',
    name: 'max-oh',
    sortable: true,

  },
  {
    label: 'Current On Hand',
    field: 'curr-oh',
    name: 'curr-oh',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Average Price',
    field: 'avrgprice',
    name: 'avrgprice',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Actual Price',
    field: 'ek-aktuell',
    name: 'ek-aktuell',
    align: 'right',
    sortable: true,

  },
  {
    label: 'Last Purchase Date',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: true,

  },
];