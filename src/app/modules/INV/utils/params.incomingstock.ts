import {date} from 'quasar'
export const params = [
    'docu-nr',
    'besteller',
    'deparmet',
    'supplier',
    'bestelldatum',
    'billdate',
    'bestellart',
    'gedruckt',
    'currencyScreenValue'
]

export const x = (data) => {
    return {
        'docu-nr': data['docu-nr'],
        'besteller': data.besteller,
        'deparmet': data['angebot-lief'][0],
        'supplier': data.supplier,
        'bestelldatum': date.formatDate(data.bestelldatum, 'DD/MM/YYYY'),
        'billdate': date.formatDate(data.billdate, 'DD/MM/YYYY'),
        'bestellart': data.bestellart,
        'gedruckt': date.formatDate(data.gedruckt, 'DD/MM/YYYY'),
        'currencyScreenValue': data.currencyScreenValue
    }
}