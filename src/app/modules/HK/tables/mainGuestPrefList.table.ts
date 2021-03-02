// import { date } from 'quasar';
// import { formatTime } from '~/app/shared/ledger/helpers/reformData.helper';
import { date } from 'quasar';
import { formatTime } from '~/app/shared/helpers/utils';
import { TableActionHeader } from '~/components/VhpUI/typings';

export const mainColumns: TableActionHeader[] = [
  {
    label: 'Room Number',
    name: 'room_number',
    field: 'room_number',
    classes: 'nowrap text-capitalize',
    align: 'left',
    sortable: true,
    style: 'width: 13px',
    headerStyle: 'width: 13px',
  },
  {
    label: 'Date',
    name: 'date',
    field: 'date',
    classes: 'nowrap text-capitalize',
    align: 'left',
    sortable: true,
    style: 'width: 110px',
    headerStyle: 'width: 110px',
    format: (v) => (v instanceof Date ? date.formatDate(v, 'DD/MM/YYYY') : ''),
  },
  {
    label: 'Time',
    name: 'time',
    field: 'time',
    classes: 'nowrap text-capitalize',
    align: 'left',
    sortable: true,
    style: 'width: 110px',
    headerStyle: 'width: 110px',
    format: (v) => (Number.isInteger(v) ? formatTime(v) : ''),
  },
  {
    label: 'Id',
    name: 'id',
    field: 'id',
    classes: 'nowrap text-uppercase',
    align: 'left',
    sortable: true,
    style: 'width: 50px',
    headerStyle: 'width: 50px',
  },
  {
    label: 'Guest Preference',
    name: 'guest_preference',
    field: 'guest_preference',
    classes: 'nowrap text-capitalize',
    align: 'left',
    sortable: true,
    style: 'width: 50px',
    headerStyle: 'width: 50px',
  },
  {
    style: 'width: 5px',
    headerStyle: 'width: 5px',
    field: 'actions',
    name: 'actions',
  },
];
