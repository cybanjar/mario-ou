import {date} from 'quasar'
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export const data_table = (data) => {
    return data.q2List['q2-list'].map(items => ({
        anzahl: `${items.anzahl}.00`,
        artnr: items.artnr,
        bezeich: items.bezeich,
        datum: date.formatDate(items.datum, 'DD/MM/YYYY'),
        'docu-nr': items['docu-nr'],
        einzelpreis: formatterMoney(items.einzelpreis),
        firma: items.firma,
        'lager-nr': items['lager-nr'],
        'lief-nr': items['lief-nr'],
        'lscheinnr': items['lscheinnr'],
        warenwert: formatterMoney(items.warenwert)
    }))
}