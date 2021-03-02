import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export const data_map = data => {
    return data.blineList['bline-list'].map(x => ({
        label: `${x.userinit} - ${x.name}`,
        value: x.userinit,
        data: x
    }))
}

export const data_table = (data) => {
    return data.turnover['turnover'].map(x => ({
        name: x.name,
        rechnr: x.rechnr,
        zinr: x.zinr,
        info: x.info,
        curr: x.curr,
        'p-cash': formatterMoney(x['p-cash']),
        'f-cash': formatterMoney(x['f-cash']),
        'c-ledger': formatterMoney(x['c-ledger']),
        creditcard: formatterMoney(x.creditcard),
        gname: x.gname,
        // username: x.
    }))
}

export const table_sumarry = (data) => {
    data.outputList['output-list'].map(x => {
        console.log('sukses', x.str)
    })
}