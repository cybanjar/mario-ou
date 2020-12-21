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
  },
  {
    label: 'Bill Date',
    field: 'bill_date',
    name: 'bill_date',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Bill Number',
    field: 'bill_number',
    name: 'bill_number',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Bill Receiver',
    field: 'bill_receiver',
    name: 'bill_receiver',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Ar Amount',
    field: 'ar_amount',
    name: 'ar_amount',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Payment Amount',
    field: 'payment_amount',
    name: 'payment_amount',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Outstanding',
    field: 'outstanding',
    name: 'outstanding',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Days',
    field: 'days',
    name: 'days',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Last Print',
    field: 'last_print',
    name: 'last_print',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Level',
    field: 'level',
    name: 'level',
    align: 'left',
    sortable: true,
  },
];
