import {date} from 'quasar'

export const data_table = (data) => {
 return data.map(items => ({
     'lief-nr': items['lief-nr'],
     'lief-fax-1': items['lief-fax-1'],
     'docu-nr': items['docu-nr'],
     'firma': items['firma'],
     'bestelldatum': date.formatDate(items['bestelldatum'], 'DD/MM/YYYY'),
     'lieferdatum': date.formatDate(items['lieferdatum'], 'DD/MM/YYYY'),
     wabkurz: items.wabkurz,
     bestellart: items.bestellart,
     'lief-fax-3': items['lief-fax-3'],
     'besteller': items.besteller,
     'lief-fax-2': items['lief-fax-2'],
     betriebsnr: items.betriebsnr,
     gedruckt: items.gedruckt
 }))
}