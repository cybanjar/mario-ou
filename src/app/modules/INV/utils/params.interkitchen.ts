import {date} from 'quasar'
export const departement = [
    {
        value: 1,
        label: '1 - HARIS CAFFE'
    },
    {
        value: 2,
        label: '2 - ROOM SERVICE'
    },
    {
        value: 3,
        label: '3 - LOBBY LOUNGE'
    },
    {
        value: 4,
        label: '4 - TUBE BAR'
    },
    {
        value: 5,
        label: '5 - MINI BAR'
    },
]
export const dataToDepartement = [
    {
        label: 'Tiktak - 120',
        art: 7004,
        des: 'Tiktak',
        price: '165000',
        stock: '120',
        no: '0',
        date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        time: date.formatDate(new Date(), 'hh:mm:ss')
    },
    {
        label: 'Tango - 3',
        art: 7005,
        des: 'Tango',
        price: '3000',
        date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        time: date.formatDate(new Date(), 'h:m:s'),
        no: '0',
        stock: '3'
    },
    {
        label: 'Kopi Hitam - 12',
        art: 7006,
        des: 'Kopi Hitam ',
        price: '10000',
        date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        time: date.formatDate(new Date(), 'hh:mm:ss'),
        no: '0',
        stock: '12'
    },
    {
        label: 'Aqua Galon - 22',
        art: 7007,
        des: 'Aqua Galon',
        price: '20000',
        date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        time: date.formatDate(new Date(), 'hh:mm:ss'),
        no: '0',
        stock: '22'
        
    },
    {
        label: 'Sari Gandum - 0',
        art: 7008,
        des: 'Sari Gandum',
        price: '8400',
        date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        time: date.formatDate(new Date(), 'hh:mm:ss'),
        no: '0',
        stock: '0'
    },
]