import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatToBL } from '~/app/helpers/formatterDate.helper';
export const activeJournalColumns: TableHeader<any>[] = [
  {
    label: 'Date',
    name: 'date',
    field: 'date',
    format: formatToBL,
    style: 'width: 100',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Reference No',
    name: 'reference_no',
    field: 'reference_no',
    style: 'width: 250',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Description',
    name: 'description',
    field: 'description',
    style: 'width: 250',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Debit',
    name: 'debits',
    format: formatterMoney,
    field: 'debits',
    style: 'width: 130',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Credit',
    name: 'credits',
    format: formatterMoney,
    field: 'credits',
    style: 'width: 130',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Remaining',
    name: 'remaining',
    format: formatterMoney,
    field: 'remaining',
    style: 'width: 120',
    sortable: true,
    align: 'left',
  },
  { name: 'actions', field: 'actions' },
];
