import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import {date} from 'quasar'
export const data_table = (data) => {
    return data.cList['c-list'].map(items => ({
        roomNumber: items['zinr'],
        guestName: items['name'],
        adult: items['pax'],
        compliment: items['com'],
        status: items['resstatus'],
        Room: formatterMoney(items['zipreis']),
        depature: date.formatDate(items['abreise'], 'DD/MM/YYYY'),
        country: items['land'],
        nationality: items['nat'],
        local: items['nat2'],
        email: items['email'],
        nationOk: items['nation-ok'],
        source: items['resart'],
        segmentcode: items['segm'],
        selected: false
    }))
}