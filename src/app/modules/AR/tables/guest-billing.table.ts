import { TableHeader } from '~/components/VhpUI/typings';
import { ResDispDebitor } from '../models/debitor.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const displayPaymentColumns: TableHeader<ResDispDebitor>[] = [
  {
    label: 'Guest Number',
    field: 'gastnr',
    name: 'gastnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Bill Name',
    field: 'gname',
    name: 'gname',
    align: 'left',
    sortable: true,
  },
  {
    label: 'City',
    field: 'city',
    name: 'city',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Amount',
    field: (row) => formatterMoney(row.aging),
    name: 'aging',
    align: 'left',
    sortable: true,
  },
];
