import {date} from 'quasar'
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import { Search , use_inputchild} from '../Input/cash_advance'
import {use_input} from '../Input/Fund_Calculator'
import {input_giro} from '../Input/cheque_giro'
export const dataTable = (data) => {
    return data.b1List['b1-list'].map(x => ({
        bemerk: x.bemerk,
        bezeich: x.bezeich,
        betrag: formatterMoney(x.betrag),
        chequeNo: x.chequeNo,
        datum: date.formatDate(x.datum, 'DD/MM/YYYY'),
        datum2: date.formatDate(x.datum2, 'DD/MM/YYYY'),
        'docu-nr': x['docu-nr'],
        'pay-datum': date.formatDate(x['pay-datum'], 'DD/MM/YYYY'),
        'pay-type': x['pay-type'],
        'pi-status': x['pi-status'],
        rcvID: x.rcvID,
        returnAmt: x.returnAmt+'.00',
        userinit: x.userinit,
        username: x.username,
        postDate: date.formatDate(x.postDate, 'DD/MM/YYYY'),
    }))
}


const groupMap = (data, name, val ) => {
    return data.map(x => ({
        label : `${x[val]} - ${x[name]}`,
        value : x[val],
        data : x
    }))
}
const groupMap2 = (data, name, val ) => {
    return data.map(x => ({
        label : x[name],
        value : x[val],
        data : x
    }))
}


export const dataChildInput = (data) => {
    if (data.tBediener) {
        const name = data.tBediener['t-bediener']
        use_inputchild.appForm[0].options = groupMap2(name, 'username', 'nr')
        Search[0].options = groupMap2(name, 'username', 'nr')
    } else if (data.tGcPiacct) {
        const account = data.tGcPiacct['t-gc-piacct']
        for(const items of account){
            items['fibukonto'] = format_number(items['fibukonto'])
        }
        use_inputchild.Payment[4].options = groupMap(account, 'bezeich', 'fibukonto')
        input_giro[1].options = groupMap(account, 'bezeich', 'fibukonto')
        use_input[0].options = groupMap(account, 'bezeich', 'fibukonto')
    } else if (data.supplyList) {
        const supplier = data.supplyList['supply-list']
        use_inputchild.Settlement[0].options = groupMap(supplier, 'firma', 't-recid')
    } else if (data.tGcGiro) {
        const giro = data.tGcGiro['t-gc-giro']
        use_inputchild.Payment[0].options = groupMap(giro, 'bankname', 'gironum')
    } else if (data.acctNo) {
        use_input[1].value = format_number(data.acctNo)
        use_input[3].value = formatterMoney(data.betrag)
    } else if (data.b1List) {
        return data.b1List['b1-list'].map(x => ({
            bemerk: x.bemerk,
            betrag: formatterMoney(x.betrag),
            bezeich: x.bezeich,
            datum: date.formatDate(x.datum, 'DD/MM/YYYY'),
            'docu-nr':x['docu-nr'],
            username: x.username,
            selected: false
        }))
    } else {
        for(const i of [5]){
            use_inputchild.appForm[i].value = format_number(data.piAcctNo)
        }
        const purpose = data.tGcPitype['t-gc-pitype']
        use_inputchild.appForm[2].options = groupMap(purpose, 'bezeich', 'nr')
    }
}

export const data_settelment = (data) => {
    return  data.invList['inv-list'].map(x => ({
        amount: formatterMoney(x.amount),
        created: date.formatDate(x.created, 'DD/MM/YYYY'),
        'inv-AcctNo': format_number(x['inv-AcctNo']),
        'inv-bezeich': x['inv-bezeich'].trim(),
        invNo: x.invNo,
        reihenfolge: x.reihenfolge,
        remark: x.remark,
        's-recid': x['s-recid'],
        supplier: x.supplier,
        zeit: x.zeit
    }))
}

export const account_data = (value) => {
    const data = value.glacctList['glacct-list']
    return data.map(x => ({
        fibukonto: format_number(x.fibukonto),
        bezeich: x.bezeich,
        activeflag: x.activeflag? 'Activa' : 'No Activa',
        deptnr: x.deptnr,
        'main-nr': x['main-nr'],
        selected: false
    }))
}

const format_number = (number) => {
    let reverse = number.split('').reverse()
    let num = reverse.join('').match(new RegExp('.{1,2}', 'g')).join("-");
    return num.replace('-', '').split('').reverse().join('')
}
