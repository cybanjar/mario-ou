import {date} from 'quasar'
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export const fromStore = [
    {
        label: '01 - GENERAL STORE F&B',
        code: 'T190115002',
        add: false
    },
    {
        label: '02 - GENERAL STORE BOTIQUE',
        add: false,
        code: 'T190114001'
    },
    {
        label: '03 - GENERAL STORE MATERIAL',
        add: false,
        code: 'T190116321'
    },
    {
        label: '04 - GENERAL STORE CHEMICAL',
        add: false,
        code: 'T190121231'
    },
    {
        label: '05 - HOUSEKEEPING STORE',
        add: false,
        code: 'T134543221'
    },
]

export const articelNumber = [
    {
        label: '00 - Creamer Stick',
        price: '12000',
        st: '07',
        artNumber: '1157653',
        des: 'Creamer Stick',
        creattedBy: 'SINDATA',
        qty: 0
    },
    {
        label: '640.0 - Nescafe Sachet @gr',
        price: '10000',
        st: '03',
        des: 'Nescafe Sachet @gr',
        qty: 640,
        creattedBy: 'SINDATA',
        artNumber: '7666354'
    },
    {
        label: '2.00 - Sosro Black Tea 25 Bag/pack',
        qty: 2,
        price: '20000',
        st: '05',
        des: 'Sosro Black Tea 25 Bag/pack',
        creattedBy: 'SINDATA',
        artNumber: '3323454'
    },
    {
        label: '680.00 - Sugar Brown Stick',
        qty: 680,
        price: '1000',
        st: '09',
        des: 'Sugar Brown Stick',
        creattedBy: 'SINDATA',
        artNumber: '3332456'
    },
    {
        label: '680.00 - Sugar Stick @250 Pcs/pack',
        price: '101000',
        qty: 680,
        st: '02',
        des: 'Sugar Stick @250 Pcs/pack',
        creattedBy: 'SINDATA',
        artNumber: '7765443'
    },
]

export const dataTable = (item) => {
    const x = {
      fs : item.label.substring(item.label.indexOf('-')+2),
      ts : item.value.label.substring(item.value.label.indexOf('-')+2),
      artNumbers: item.artNumber,
      des : item.des,
      price: formatterMoney(item.price),
      qty: item.dataqty,
      date: date.formatDate(new Date(), 'DD/MM/YYYY'),
      creattedBy: item.creattedBy,
      time: date.formatDate(new Date(), 'hh:mm:ss'),
      stock: item.qty
    }
    return [x]
  }

  