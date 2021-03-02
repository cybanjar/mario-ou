import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { GroupCheckIn } from '../../models/group-check-in/groupCheckIn.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const tableHeaders: TableHeader<GroupCheckIn>[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
    sortable: true,
  },
  {
    label: 'Reservation From',
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Group Name',
    field: 'groupname',
    name: 'groupname',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Quantity',
    field: 'zimanz',
    name: 'zimanz',
  },
  {
    label: 'Arrival',
    field: 'arr',
    name: 'arr',
  },
  {
    label: 'Arrived',
    field: 'ci',
    name: 'ci',
  },
  {
    label: 'Departed',
    field: 'co',
    name: 'co',
  },
  {
    label: 'Departure Date',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Deposit',
    field: 'deposit',
    name: 'deposit',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Payment Amount',
    field: 'paid',
    name: 'paid',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Segment Number',
    field: 'segm',
    name: 'segm',
  },
  { name: 'actions' },
];
