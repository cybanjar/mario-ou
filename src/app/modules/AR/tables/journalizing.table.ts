import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatToBL } from '~/app/helpers/formatterDate.helper';
import { formatTime } from '~/app/shared/ledger/helpers/reformData.helper';
export const journalizingColumns: TableHeader<any>[] = [
  {
    label: 'Account Number',
    field: 'account_number',
    name: 'account_number',
    classes: 'text-capitalize',
    style: 'width: 120',
  },
  {
    label: 'Account Name',
    field: 'description',
    name: 'description',
    classes: ' text-capitalize',
    style: 'width: 260',
  },

  {
    label: 'Debit',
    field: 'debit',
    name: 'debit',
    format: (it) => formatterMoney(it),
    classes: ' text-capitalize',
    style: 'width: 150',
    align: 'right',
  },
  {
    label: 'Credit',
    field: 'credit',
    name: 'credit',
    format: (it) => formatterMoney(it),
    classes: 'nowrap pointer text-capitalize',
    style: 'width: 150',
    align: 'right',
  },
  {
    label: 'Remark',
    field: 'remark',
    name: 'remark',
    classes: 'nowrap pointer text-capitalize',
    style: 'width: 285',
  },

  {
    label: 'Created Id',
    field: 'user_id',
    name: 'user_id',
    classes: 'nowrap pointer text-capitalize',
    style: 'width: 100',
  },
  {
    label: 'Created Date',
    field: 'created_date',
    format: (it) => formatToBL(it),
    name: 'created_date',
    classes: 'nowrap pointer text-capitalize',
    style: 'width: 115',
  },

  {
    label: 'Created Time',
    field: 'time',
    name: 'time',
    format: (it) => formatTime(it),
    classes: 'nowrap pointer text-capitalize',
    style: 'width: 115',
  },

  {
    label: 'Changed Id',
    field: 'changed_id',
    name: 'changed_id',
    classes: 'nowrap pointer text-capitalize',
    style: 'width: 110',
  },
  {
    label: 'Changed Date',
    field: 'changed_date',
    name: 'changed_date',
    format: (it) => formatToBL(it),
    classes: 'nowrap pointer text-capitalize',
    style: 'width: 120',
  },
];
