import { TableHeader } from '~/components/VhpUI/typings';
import { ReservationListData } from '../../../models/extra/manage-reservation/manageReservation.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { date } from 'quasar';

export const tableHeaderManageReservationList: TableHeader<ReservationListData>[] = [
  { label: 'Reservation Number', name: 'resnr', field: 'resnr' },
  { label: 'Quantity', name: 'zimanz', field: 'zimanz' },
  {
    label: 'Arrival',
    align: 'left',
    name: 'ankunft',
    field: 'ankunft',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Group Name', align: 'left', name: 'groupname', field: 'groupname' },
  { label: 'Voucher Number', align: 'left', name: 'voucher', field: 'voucher' },
  {
    label: 'Departure',
    align: 'left',
    name: 'abreise',
    field: 'abreise',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Segment Number', name: 'segm', field: 'segm' },
  {
    label: 'Deposit',
    name: 'deposit',
    field: 'deposit',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Due Date',
    align: 'left',
    name: 'until',
    field: 'until',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Paid Amount',
    name: 'paid',
    field: 'paid',
    format: (val: number) => formatterMoney(val),
  },
  { label: 'Created By', align: 'left', name: 'id1', field: 'id1' },
  { label: 'Changed By', align: 'left', name: 'id2', field: 'id2' },
  {
    label: 'Changed Date',
    align: 'left',
    name: 'id2-date',
    field: 'id2-date',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { name: 'actions' },
];
