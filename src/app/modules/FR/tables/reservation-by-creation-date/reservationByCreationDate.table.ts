import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import {
  MainReservation,
  ReservationMember,
} from '../../models/reservation-by-creation-date/reservationByCreationDate.model';

export const tableHeadersMainReservation: TableHeader<MainReservation>[] = [
  {
    label: 'Created Date',
    field: 'resdat',
    name: 'resdat',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
    align: 'left',
  },
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
  },
  {
    label: 'Reservation Name',
    field: 'name',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Group Name',
    field: 'groupname',
    name: 'groupname',
    align: 'left',
  },
  {
    label: 'Deposit',
    field: 'depositgef',
    name: 'depositgef',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Due Date',
    field: 'limitdate',
    name: 'limitdate',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Deposit Paid I',
    field: 'depositbez',
    name: 'depositbez',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Payment Date',
    field: 'zahldatum',
    name: 'zahldatum',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Deposti Paid II',
    field: 'depositbez2',
    name: 'depositbez2',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Payment Date',
    field: 'zahldatum2',
    name: 'zahldatum2',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Created Id',
    field: 'useridanlage',
    name: 'useridanlage',
    align: 'left',
  },
  {
    label: 'Last Changed Date',
    field: 'mutdat',
    name: 'mutdat',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Changed By',
    field: 'useridmutat',
    name: 'useridmutat',
    align: 'left',
  },
  { name: 'actions' },
];

export const tableHeadersReservationMember: TableHeader<ReservationMember>[] = [
  {
    label: 'Guest Name',
    field: 'name',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Departure',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Status',
    field: 'resstatus',
    name: 'resstatus',
    align: 'left',
    // TODO: The field value doesn't match with protptype in figma
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
  },
  {
    label: 'Room Type',
    field: 'kurzbez',
    name: 'kurzbez',
    align: 'left',
  },
  {
    label: 'Room Rate',
    field: 'zipreis',
    name: 'zipreis',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Arrangement Code',
    field: 'arrangement',
    name: 'arrangement',
    align: 'left',
  },
  {
    label: 'Adult',
    field: 'erwachs',
    name: 'erwachs',
  },
  {
    label: 'Compliment',
    field: 'gratis',
    name: 'gratis',
  },
  {
    label: 'Room Quantity',
    field: 'zimmeranz',
    name: 'zimmeranz',
  },
  {
    label: 'Night',
    field: 'anztage',
    name: 'anztage',
  },
  {
    label: 'Changed ID',
    field: 'changed-id',
    name: 'changed-id',
    align: 'left',
  },
  {
    label: 'Changed Date',
    field: 'changed',
    name: 'changed',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { name: 'actions' },
];
