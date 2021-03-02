import {date} from 'quasar'
import { input_giro } from '../Input/cheque_giro'
export const data_table = (data) => {
    return data.tGcGiro['t-gc-giro'].map(x => ({
        CID: x.CID,
        bankname: x.bankname,
        betrag: x.betrag,
        changed: date.formatDate(x.changed, 'DD/MM/YYYY'),
        created: date.formatDate(x.created, 'DD/MM/YYYY'),
        'docu-nr': x['docu-nr'],
        dueDate: x.dueDate,
        fibukonto: format_number(x.fibukonto),
        'giro-status': x['giro-status'] == 0? 'Open' : 'Used',
        gironum: x.gironum,
        postedDate: x.postedDate,
        'rec-id': x['rec-id'],
        userinit: x.userinit,
        selected: false
    }))
}

const format_number = (number) => {
    let reverse = number.split('').reverse()
    let num = reverse.join('').match(new RegExp('.{1,2}', 'g')).join("-");
    return num.replace('-', '').split('').reverse().join('')
}
export const newValues = (e) => {
    const xii = input_giro[1].value as any
    return {
        pvILanguage: "0",
        caseType: e == undefined? 2: 1,
        sRecid: e == undefined? 0: e['rec-id'],
        userInit: "01",
        gList: {
          "g-list": [
            {
              bankname: input_giro[0].value,
              gironum: input_giro[2].value,
              fibukonto: xii.data !== undefined? xii.value: xii.replace(/-/g, ''),
              "giro-status": 0,
              betrag: 0.0,
              dueDate: "",
              postedDate: "",
              "docu-nr": " ",
              userinit: "01",
              created: "",
              changed: "",
              CID: " ",
              "res-int": [0, 0, 0],
              "res-dec": [0, 0, 0],
              "res-date": ["", "", ""],
              "res-char": [" ", " ", " "],
              "res-logi": [false, false, false],
              acctNo: xii.data !== undefined? xii.value: xii.replace(/-/g, ''),
              "s-recid": e == undefined? 0: e['rec-id']
            }
          ]
        }
    }
};

export const edit_data = (e) => {
    const xi = ['bankname','fibukonto', 'gironum']
    for(const i in xi){
        input_giro[i].value = e[xi[i]]
    }
}