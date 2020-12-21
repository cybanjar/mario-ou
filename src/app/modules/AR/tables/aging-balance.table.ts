import { TableActionHeader, TableHeader } from '~/components/VhpUI/typings';
import { AgingBalance, Bill } from '../models/aging-balance';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

type FieldInfo = {
  currency: boolean;
  details: boolean;
  withBalance: boolean;
  displayMainTable: boolean;
};

type TableActionGroup<T> = TableActionHeader<T> & FieldInfo;

export const agingBalanceMainColumns = (
  currency: number,
  isDetail: boolean,
  withBalance: boolean
): TableActionGroup<AgingBalance>[] => [
  {
    label: 'Article Number',
    field: 'number',
    name: 'number',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: true,
    displayMainTable: false,
  },
  {
    label: 'Bill Receiver',
    field: 'billReceiver',
    name: 'billReceiver',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: true,
    displayMainTable: false,
  },
  {
    label: 'Bill Date',
    field: 'billDate',
    name: 'billDate',
    align: 'left',
    sortable: true,
    currency: true,
    details: isDetail ? true : false,
    withBalance: true,
    displayMainTable: false,
  },
  {
    label: 'Bill Number',
    field: 'billNumber',
    name: 'billNumber',
    align: 'left',
    sortable: true,
    currency: true,
    details: isDetail ? true : false,
    withBalance: true,
    displayMainTable: true,
  },
  {
    label: 'Guest/Group Name',
    field: 'guestGroupName',
    name: 'guestGroupName',
    align: 'right',
    currency: true,
    details: false,
    withBalance: false,
    displayMainTable: true,
  },
  {
    label: 'Currency',
    field: 'currency',
    name: 'currency',
    align: 'left',
    sortable: true,
    currency: currency === 0 ? false : true,
    details: true,
    withBalance: true,
    displayMainTable: currency === 0 ? false : true,
  },
  {
    label: 'Beginning Balance',
    field: 'beginningBalance',
    name: 'beginningBalance',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: withBalance ? true : false,
    displayMainTable: false,
  },
  {
    label: 'Debit',
    field: 'debit',
    name: 'debit',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: withBalance ? true : false,
    displayMainTable: false,
  },
  {
    label: 'Credit',
    field: 'credit',
    name: 'credit',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: withBalance ? true : false,
    displayMainTable: false,
  },
  {
    label: withBalance ? 'Ending Balance' : 'Outstanding',
    field: 'endingBalance',
    name: 'endingBalance',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: true,
    format: (val) => formatterMoney(val),
    displayMainTable: true,
  },
  {
    label: 'Age',
    field: 'age',
    name: 'age',
    align: 'right',
    currency: true,
    details: false,
    withBalance: false,
    displayMainTable: true,
  },
  {
    label: '1 - 30 Days',
    field: 'oneToThirty',
    name: 'oneToThirty',
    align: 'left',
    sortable: true,
    format: (val) => formatterMoney(val),
    currency: true,
    details: true,
    withBalance: true,
    displayMainTable: true,
  },
  {
    label: '31 - 60 Days',
    field: 'thirtyoneToSixty',
    name: 'thirtyoneToSixty',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: true,
    format: (val) => formatterMoney(val),
    displayMainTable: true,
  },
  {
    label: '61 - 90 Days',
    field: 'sixtyoneToNinety',
    name: 'sixtyoneToNinety',
    align: 'left',
    sortable: true,
    currency: true,
    details: true,
    withBalance: true,
    format: (val) => formatterMoney(val),
    displayMainTable: true,
  },
  {
    label: 'Over 90 Days',
    field: 'overNinety',
    name: 'overNinety',
    align: 'left',
    sortable: true,
    currency: true,
    format: (val) => formatterMoney(val),
    details: true,
    withBalance: true,
    displayMainTable: true,
  },
  {
    label: 'Credit Limit',
    field: 'creditLimit',
    name: 'creditLimit',
    align: 'left',
    sortable: true,
    currency: true,
    details: false,
    withBalance: false,
    displayMainTable: true,
  },
  {
    field: 'actions',
    name: 'actions',
    currency: true,
    details: true,
    withBalance: true,
    displayMainTable: false,
  },
];

export function mainColumns(
  currency: number,
  withBalance: boolean,
  isDetail: boolean,
  displayMainTable: boolean
) {
  const columns = agingBalanceMainColumns(currency, isDetail, withBalance);
  const filteredColumns = columns.filter(
    (item) => item.currency && item.withBalance && item.details
  );

  const customerColumns = columns.filter(
    (item) => item.currency && item.displayMainTable
  );

  return displayMainTable ? filteredColumns : customerColumns;
}

export const resvColumns: TableHeader<Bill>[] = [
  {
    label: 'Reservation Number',
    field: 'reservationNumber',
    name: 'reservationNumber',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'guestName',
    name: 'guestName',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Type',
    field: 'roomType',
    name: 'roomType',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Number',
    field: 'roomNumber',
    name: 'roomNumber',
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
    label: 'Adult',
    field: 'adult',
    name: 'adult',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Child1',
    field: 'child1',
    name: 'child1',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Child2',
    field: 'child2',
    name: 'child2',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Compliment',
    field: 'compliment',
    name: 'compliment',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Arrangement',
    field: 'arrangement',
    name: 'arrangement',
    align: 'left',
    sortable: true,
  },
];
