// import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { ReminderLetterList } from '../models/reminder-letter.model';
// import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const reminderLetterListColumns: TableHeader<ReminderLetterList>[] = [
  {
    label: 'Description',
    field: 'description',
    name: 'description',
    align: 'left',
    sortable: true,
    style: 'width: 150px',
    headerStyle: 'width: 150px',
  },
  {
    label: 'Bill Date',
    field: 'bill_date',
    name: 'bill_date',
    align: 'left',
    sortable: true,
    style: 'width: 80px',
    headerStyle: 'width: 80px',
  },
  {
    label: 'Bill Number',
    field: 'bill_number',
    name: 'bill_number',
    align: 'right',
    sortable: true,
    style: 'width: 90px',
    headerStyle: 'width: 90px',
  },

  {
    label: 'Bill Receiver',
    field: 'bill_receiver',
    name: 'bill_receiver',
    align: 'left',
    sortable: true,
    style: 'width: 200px',
    headerStyle: 'width: 200px',
  },

  {
    label: 'Ar Amount',
    field: 'ar_amount',
    name: 'ar_amount',
    align: 'right',
    sortable: true,
    style: 'width: 150px',
    headerStyle: 'width: 150px',
  },

  {
    label: 'Payment Amount',
    field: 'payment_amount',
    name: 'payment_amount',
    align: 'right',
    sortable: true,
    style: 'width: 150px',
    headerStyle: 'width: 150px',
  },

  {
    label: 'Outstanding',
    field: 'outstanding',
    name: 'outstanding',
    align: 'right',
    sortable: true,
    style: 'width: 150px',
    headerStyle: 'width: 150px',
  },

  {
    label: 'Days',
    field: 'days',
    name: 'days',
    align: 'right',
    sortable: true,
    style: 'width: 70px',
    headerStyle: 'width: 70px',
  },

  {
    label: 'Last Print',
    field: 'last_print',
    name: 'last_print',
    align: 'left',
    sortable: true,
    style: 'width: 100px',
    headerStyle: 'width: 100px',
  },

  {
    label: 'Level',
    field: 'level',
    name: 'level',
    align: 'right',
    sortable: true,
    style: 'width: 70px',
    headerStyle: 'width: 70px',
  },
];
