import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatToBL } from '~/app/helpers/formatterDate.helper';
export const mainListColumns: TableHeader<any>[] = [
  {
    label: 'Date',
    field: 'date',
    name: 'date',
    align: 'left',
    format: (it) => formatToBL(it),
    sortable: true,
  },
  {
    label: 'Bill Number',
    field: 'billNo',
    name: 'billNo',
    align: 'left',
    sortable: true,
  },
];

export const outstandDebtColumns: TableHeader<any>[] = [
  {
    label: 'Room Number',
    field: 'rmNo',
    name: 'rmNo',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Bill Receiver',
    field: 'billReceiver',
    name: 'billReceiver',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Amount',
    field: 'debtAmount',
    name: 'debtAmount',
    align: 'left',
    format: (it) => formatterMoney(it),
    sortable: true,
  },
  {
    label: 'Foreign Amount',
    field: 'foreignAmount',
    name: 'foreignAmount',
    format: (it) => formatterMoney(it),
    align: 'left',
    sortable: true,
  },
  {
    label: 'Currency',
    field: 'currency',
    name: 'currency',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Id',
    field: 'id',
    name: 'id',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Invoice Date',
    field: 'mailDate',
    name: 'mailDate',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Remark',
    field: 'additionalInfo',
    name: 'additionalInfo',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Company Number',
    field: 'compNo',
    name: 'compNo',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Reference Number',
    field: 'refNo',
    name: 'refNo',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Arrival',
    field: 'arrival',
    name: 'arrival',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Departure',
    field: 'departure',
    name: 'departure',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Night',
    field: 'night',
    name: 'night',
    align: 'left',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];

export function getOutstandDebtColumns(
  isManualInvChecked: boolean
): TableHeader<any>[] {
  if (isManualInvChecked === true) {
    return [
      ...mainListColumns,
      {
        label: 'Invoice Number',
        field: 'invoiceNumber',
        name: 'invoiceNumber',
        align: 'left',
        sortable: true,
      },
      ...outstandDebtColumns,
    ];
  }

  return [...mainListColumns, ...outstandDebtColumns];
}
