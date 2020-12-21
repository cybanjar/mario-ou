import {formatterMoney} from '~/app/helpers/formatterMoney.helper'

export const table_data = (data) => {
    return data.turnover['turnover'].map( x => ({
        departement: x['departement'],
        rechnr: x['rechnr'],
        'p-cash': formatterMoney(x['p-cash']),
        't-credit': formatterMoney(x['t-credit']),
        'r-transfer': formatterMoney(x['r-transfer']),
        'comp': formatterMoney(x['comp']),
        'coupon': formatterMoney(x['coupon']),
        info: x['info']
    }))
}

export const outletcashsummary = (value) => {
    const tHotel = value.tHoteldpt['t-hoteldpt']
    return tHotel.map(x => ({
        label: `${x['num']} - ${x['depart']}`,
        value: x['num'],
        data: x
    }))
}

export const data_map = data => {
    const tHotel = data.tHoteldpt['t-hoteldpt']
    const tKellner = data.tKellner['t-kellner']
    const xii = []
    for(const xi of tKellner){
        if (xi['departement'] > 0) {
            for(const i of tHotel){
                if (xi['departement'] == i['num']) {
                    xii.push({
                        label: `${i['depart']} - ${xi['kellnername']}`,
                        value: xi['kellner-nr'],
                        data: {
                            Name: xi['kellnername'],
                            Depart: i['depart'],
                            Dept: i['num'],
                            Knr: i['num'],
                            'bl-recid': xi['rec-id'],
                            Selected: false
                        }
                    })
                }
            }
        }
    }
    return xii
}

export const oprtions = [
    {
        label: 'All',
        value: 0
    },
    {
        label: 'Morning',
        value: 1
    },
    {
        label: 'Noon',
        value: 2
    },
    {
        label: 'Dinner',
        value: 3
    },
    {
        label: 'Supper',
        value: 4
    },
]