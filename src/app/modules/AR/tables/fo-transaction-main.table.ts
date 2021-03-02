import { date } from 'quasar';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { TableHeader } from '~/components/VhpUI/typings';

export const mainColumn: TableHeader<any>[] = [
  {
    label: 'Date',
    name: 'date',
    field: 'date',
    classes: ' text-capitalize',
    headerStyle: 'width: 90px',
    format: (val) =>
      val instanceof Date ? date.formatDate(val, 'DD/MM/YYYY') : undefined,
  },
  {
    label: 'Room Number',
    name: 'room_number',
    field: 'room_number',
    classes: ' text-capitalize',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Bill Number',
    name: 'bill_number',
    field: 'bill_number',
    classes: ' text-capitalize',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Article Number',
    name: 'article_number',
    field: 'article_number',
    classes: ' text-capitalize',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Description',
    name: 'description',
    field: 'description',
    classes: ' text-capitalize',
    headerStyle: 'width: 100px',
  },
  {
    label: 'Voucher Number',
    name: 'voucher_number',
    field: 'voucher_number',
    classes: ' text-capitalize',
    headerStyle: 'width: 150px',
  },
  {
    label: 'Department',
    name: 'department',
    field: 'department',
    classes: ' text-capitalize',
    headerStyle: 'width: 120px',
  },
  {
    label: 'Quantity',
    name: 'quantity',
    field: 'quantity',
    classes: ' text-capitalize',
    headerStyle: 'width: 90px',
  },
  {
    label: 'Amount',
    name: 'amount',
    field: 'amount',
    classes: ' text-capitalize',
    headerStyle: 'width: 130px',
    format: (val) => (Number.isInteger(val) ? formatterMoney(val) : ''),
  },
  {
    label: 'Time',
    name: 'time',
    field: 'time',
    classes: ' text-capitalize',
    headerStyle: 'width: 70px',
  },
  {
    label: 'Id',
    name: 'id',
    field: 'id',
    classes: ' text-capitalize',
    headerStyle: 'width: 40px',
  },
];
