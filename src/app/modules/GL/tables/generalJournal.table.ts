import { TableHeader } from '~/components/VhpUI/typings';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export interface ITableHeader {
  activeJournal: TableHeader[];
  closedJournal: TableHeader[];
}

const defaultJournal: TableHeader[] = [
  {
    label: 'Date',
    field: 'datum',
    name: 'date',
    align: 'left',
    sortable: true,
    format: (val) => date.formatDate(val, 'DD/MM/YYYY'),
  },
  {
    label: 'Reference Number',
    field: 'refno',
    name: 'reference',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'description',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Debit',
    name: 'debit',
    field: 'debit',
    align: 'right',
    sortable: true,
    format: (val) => formatThousands(val),
  },
  {
    label: 'Credit',
    name: 'credit',
    field: 'credit',
    align: 'right',
    sortable: true,
    format: (val) => formatThousands(val),
  },
  {
    label: 'Remaining',
    name: 'remaining',
    field: 'remain',
    align: 'right',
    sortable: true,
    format: (val) => formatThousands(val),
  },
];

export const journalHeaders: ITableHeader = {
  activeJournal: [
    ...defaultJournal,
    { name: 'actions', field: 'actions', headerStyle: 'width: 37px' },
  ],
  closedJournal: [...defaultJournal],
};

export const detailHeaders: TableHeader[] = [
  {
    label: 'Account Number',
    name: 'accountNumber',
    field: 'fibukonto',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Debit',
    name: 'debit',
    field: 'debit',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Credit',
    name: 'credit',
    field: 'credit',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Remark',
    name: 'remark',
    field: 'bemerk',
    align: 'right',
    sortable: true,
  },
  {
    label: 'ID',
    name: 'createdId',
    field: 'userinit',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Date',
    name: 'createdDate',
    field: 'sysdate',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Time',
    name: 'createdTime',
    field: 'zeit',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Changed By',
    name: 'changedBy',
    field: 'chginit',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Date',
    name: 'changedDate',
    field: 'chgdate',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'description',
    align: 'left',
    sortable: true,
  },
];
