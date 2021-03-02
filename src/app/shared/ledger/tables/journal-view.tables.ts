import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { date } from 'quasar';
import { formatterAccountNumber } from '~/app/helpers/formmaterAccountNumber.helper';

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}
const dateFormat = 'DD/MM/YYYY';
export const viewTransColumns: TableHeader[] = [
  {
    label: 'Account Number',
    sortable: true,
    align: 'left',
    name: 'acctNo',
    field: 'acctNo',
    classes: 'text-capitalize',
    format: (s) =>
      formatterAccountNumber(s, [
        '0',
        '0',
        '.',
        '0',
        '0',
        '.',
        '0',
        '0',
        '0',
        '0',
      ]),
    sort: (a, b) => a.room_number - b.room_number,
    style: 'width: 100px',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Debit',
    sortable: true,
    align: 'right',
    name: 'debit',
    field: 'debit',
    classes: 'text-capitalize',
    format: (s) => (Number.isInteger(s) ? formatterMoney(s) : ''),
    sort: (a, b) => a.floor - b.floor,
    style: 'width: 100,px',
    headerStyle: 'width: 100,px',
  },
  {
    label: 'Credit',
    sortable: true,
    align: 'right',
    name: 'credit',
    field: 'credit',
    classes: 'pointer text-capitalize',
    sort: (a, b) => compareByAlph(b.category, a.category),
    format: (s) => (Number.isInteger(s) ? formatterMoney(s) : ''),
    style: 'width: 100,px',
    headerStyle: 'width: 100,px',
  },
  {
    label: 'Remark',
    sortable: true,
    align: 'left',
    name: 'note',
    field: 'note',
    classes: 'owrap pointer text-capitalize',
    sort: (a, b) => compareByAlph(b.room_status, a.room_status),
    style: 'width: 300px',
    headerStyle: 'width: 300px',
  },
  {
    label: 'Created ID',
    sortable: true,
    align: 'left',
    name: 'userId',
    field: 'userId',
    classes: 'pointer text-capitalize',
    sort: (a, b) => a.note - b.note,
    style: 'width: 100px',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Created Date',
    sortable: true,
    align: 'left',
    name: 'systemDate',
    field: 'systemDate',
    sort: (a, b) => a.pax - b.pa,
    classes: ' pointer text-capitalize',
    style: 'width: 100px',
    format: (s) => (s instanceof Date ? date.formatDate(s, dateFormat) : ''),
    headerStyle: 'width: 100px',
  },
  {
    label: 'Changed ID',
    sortable: true,
    align: 'left',
    name: 'changeBy',
    field: 'changeBy',
    classes: 'pointer text-capitalize',
    style: 'width: 100px',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Changed Date',
    sortable: true,
    align: 'left',
    name: 'changeDate',
    field: 'changeDate',
    classes: 'pointer text-capitalize',
    format: (s) => (s instanceof Date ? date.formatDate(s, dateFormat) : ''),
    style: 'width: 100px',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Description',
    sortable: true,
    align: 'left',
    name: 'description',
    field: 'description',
    classes: 'owrap pointer text-capitalize',
    style: 'width: 200px',
    headerStyle: 'width: 200px',
  },
];
