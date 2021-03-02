import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Department',
    field: 'deptname',
    name: 'deptname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Bill Number',
    field: 'rechnr',
    name: 'rechnr',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Pax',
    field: 'pax',
    name: 'pax',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    sortable: false,
  },
  {
    label: 'Food Amount',
    field: 'f-betrag',
    name: 'f-betrag',
    sortable: false,
  },
  {
    label: 'Food Cost',
    field: 'f-cost',
    name: 'f-cost',
    sortable: false,
  },
  {
    label: 'Beverage Amount',
    field: 'b-betrag',
    name: 'b-betrag',
    sortable: false,
  },
  {
    label: 'Beverage Cost',
    field: 'b-cost',
    name: 'b-cost',
    sortable: false,
  },
  {
    label: 'Bill Amount',
    field: 'betrag',
    name: 'betrag',
    sortable: false,
  },
  {
    label: 'Cost of Sales',
    field: 't-cost',
    name: 't-cost',
    sortable: false,
  },
  {
    label: 'User Id',
    field: 'usr-id',
    name: 'usr-id',
    sortable: false,
  },
];
