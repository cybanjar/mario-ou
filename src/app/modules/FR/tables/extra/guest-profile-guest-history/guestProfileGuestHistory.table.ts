import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { GuestProfileHistory } from '../../../models/extra/guest-profile-guest-history/guestProfileGuestHistory.model';

export const tableHeaderHistory: TableHeader<GuestProfileHistory>[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
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
    label: 'Time',
    field: 'abreisezeit',
    name: 'abreisezeit',
    align: 'left',
  },
  {
    label: 'Room Type',
    field: 'zikateg',
    name: 'zikateg',
    align: 'left',
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
  },
  {
    label: 'Room Quantity',
    field: 'zimmeranz',
    name: 'zimmeranz',
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
    label: 'Total Turnover',
    field: 'gesamtumsatz',
    name: 'gesamtumsatz',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Arrangement Turnover',
    field: 'argtumsatz',
    name: 'argtumsatz',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Food & Beverage Turnover',
    field: 'f-b-umsatz',
    name: 'f-b-umsatz',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Miscellaneous Turnover',
    field: 'sonst-umsatz',
    name: 'sonst-umsatz',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Payment',
    field: 'paymentMethod',
    name: 'paymentMethod',
    align: 'left',
  },
  {
    label: 'Segment Code',
    field: 'segmentcode',
    name: 'segmentcode',
  },
  {
    label: 'Room Change',
    field: 'zi-wechsel',
    name: 'zi-wechsel',
    align: 'left',
    format: (val: boolean) => (val ? 'Yes' : 'No'),
  },
  {
    label: 'Hotel Name',
    field: 'hname',
    name: 'hname',
    align: 'left',
  },
  {
    label: 'Remark',
    field: 'bemerk',
    name: 'bemerk',
    align: 'left',
  },
  {
    label: 'Guest Name',
    field: 'gname',
    name: 'gname',
    align: 'left',
  },
  {
    label: 'Address',
    field: 'address',
    name: 'address',
    align: 'left',
  },
  { name: 'actions' },
];
