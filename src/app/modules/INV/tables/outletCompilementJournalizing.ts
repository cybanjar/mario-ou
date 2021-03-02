import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '../../../helpers/formatterMoney.helper'
import {date} from 'quasar'
export const tableHeaders: TableHeader[] = [
  {
    label: 'Account Number',
    field: 'fibukonto',
    name: 'fibukonto',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Debit',
    field: 'debit',
    name: 'debit',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Credit',
    field: 'credit',
    name: 'credit',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Remark',
    field: 'bemerk',
    name: 'bemerk',
    align: 'left',
    sortable: false,
  },
  {
    label: 'User ID',
    field: 'userinit',
    name: 'userinit',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Post Date',
    field: 'sysdate',
    name: 'sysdate',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Time',
    field: 'zeit',
    name: 'zeit',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Chg-ID',
    field: 'chginit',
    name: 'chginit',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Change Date',
    field: 'cost-center',
    name: 'cost-center',
    sortable: false,
    align: 'left',
  },
];

function time(date) {
  let sec_num = parseInt(date, 10)
  let hours   = Math.floor(sec_num / 3600) as any;
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60) as any;
  let seconds = sec_num - (hours * 3600) - (minutes * 60) as any;

  if (hours < 10) {hours = "0"+hours}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
}

export const dataTable = (items) => {
  return items.tGList['t-g-list'].map((item) => ({
    'docu-nr': item['docu-nr'],
    lscheinnr: item.lscheinnr,
    jnr: item.jnr,
    fibukonto: item.fibukonto,
    'acct-fibukonto': item['acct-fibukonto'],
    bezeich: item.bezeich,
    debit: formatterMoney(item.debit),
    credit: formatterMoney(item.credit),
    bemerk: item.bemerk,
    userinit: item.userinit,
    sysdate: date.formatDate(item.sysdate, 'DD/MM/YYYY'),
    content: item.content,
    einzelpreis: item.einzelpreis,
    actions: '',
    selected: false,
    zeit: time(item.zeit),
    chgdate: item.chgdate,
    duplicate: item.duplicate,
    'add-note': item['add-note']
  }))
}