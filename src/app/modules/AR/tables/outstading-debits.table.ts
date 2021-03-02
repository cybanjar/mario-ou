import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatToBL } from '~/app/helpers/formatterDate.helper';
export const mainListColumns: TableHeader<any>[] = [
  {
    label: 'Date',
    field: 'date',
    name: 'date',
    align: 'left',
    format: (it) => (it ? formatToBL(it) : ''),
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    label: 'Bill Number',
    field: 'billNo',
    name: 'billNo',
    align: 'right',
    sortable: true,
    headerStyle: 'width: 100px',
  },
];

export const outstandDebtColumns: TableHeader<any>[] = [
  {
    label: 'Room Number',
    field: 'rmNo',
    name: 'rmNo',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    label: 'Bill Receiver',
    field: 'billReceiver',
    name: 'billReceiver',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 190px',
  },
  {
    label: 'Amount',
    field: 'debtAmount',
    name: 'debtAmount',
    align: 'right',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    label: 'Foreign Amount',
    field: 'foreignAmount',
    name: 'foreignAmount',
    align: 'right',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    label: 'Currency',
    field: 'currency',
    name: 'currency',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 110px',
  },
  {
    label: 'Id',
    field: 'id',
    name: 'id',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 50px',
  },
  {
    label: 'Invoice Date',
    field: 'mailDate',
    name: 'mailDate',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    label: 'Remark',
    field: 'additionalInfo',
    name: 'additionalInfo',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    label: 'Company Number',
    field: 'compNo',
    name: 'compNo',
    align: 'right',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    label: 'Reference Number',
    field: 'refNo',
    name: 'refNo',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 110px',
  },
  {
    label: 'Arrival',
    field: 'arrival',
    name: 'arrival',
    align: 'left',
    sortable: true,
    format: (it) => (it ? formatToBL(it) : ''),
    headerStyle: 'width: 110px',
  },
  {
    label: 'Departure',
    field: 'departure',
    name: 'departure',
    align: 'left',
    sortable: true,
    format: (it) => (it ? formatToBL(it) : ''),
    headerStyle: 'width: 110px',
  },
  {
    label: 'Night',
    field: 'night',
    name: 'night',
    align: 'right',
    sortable: true,
    headerStyle: 'width: 85px',
  },
  { name: 'actions', field: 'actions', headerStyle: 'width: 50px' },
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
        headerStyle: 'width: 100px',
      },
      ...outstandDebtColumns,
    ];
  }

  return [...mainListColumns, ...outstandDebtColumns];
}
