import {date} from 'quasar'
import { formatterMoney } from '~/app/helpers/formatterMoney.helper'
export const data_Table = (data) => {
    return data.map(items => ({
        betriebsnr: items['betriebsnr'],
        bezeich: items['bezeich'],
        datum: date.formatDate(items['datum'], 'DD/MM/YYYY'),
        logisumsatz: formatterMoney(items['logisumsatz']),
        personen: items['personen'],
        zimmeranz: items['zimmeranz'],
        selected: false
    }))
}
export const data_TableModify = (data) => {
    return data.map(items => ({
        betriebsnr: items['hnr'],
        bezeich: items['hname'],
        datum: date.formatDate(items['datum'], 'DD/MM/YY'),
        logisumsatz: formatterMoney(items['rmrev']),
        personen: items['occrm'],
        zimmeranz: items['totrm'],
        selected: false
    }))
}

export const paramsSave = (data) => {
    const xi = data.map(items => ({
        datum: date.formatDate(items['datum'], 'YYYY-DD-MM'),
        hnr: items['betriebsnr'],
        hname: items['bezeich'],
        totrm: items['zimmeranz'],
        occrm: items['personen'],
        comrm: items['munit'],
        rmrev: items['logisumsatz']
    }))
    const xii = {
        "pvlLanguage " : 1,
        "currMode" : "new",
        "slist" : {
            "slist": xi
        }
    }
    return xii
}
export const paramsModify = (data) => {
    const xi = data.map(items => ({
        datum: date.formatDate(items['datum'], 'YYYY-DD-MM'),
        hnr: items['betriebsnr'],
        hname: items['bezeich'],
        totrm: items['zimmeranz'],
        occrm: items['personen'],
        comrm: items['munit'] == undefined? 0: items['munit'],
        rmrev: Number(items['logisumsatz'])
    }))
    const xii = {
        "slist" : {
            "slist": xi
        }
    }
    return xii
}