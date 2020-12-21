import { formatterMoney } from '~/app/helpers/formatterMoney.helper'
import {inputCategory, inputAdditional, UnitPrice} from '../tables/stockItem.table'

export const data_table = (data) => {
    return data.map(items => {
        const result = items['vk-preis'].toString()
            .substring(0, items['vk-preis'].toString().indexOf('.'))
        const last_result = items['vk-preis'].toString()
            .substring(items['vk-preis'].toString().indexOf('.'),
                items['vk-preis'].toString().indexOf('.') + 3)
        const data = {
            artnr: items.artnr,
            bezeich: items.bezeich,
            masseinheit: items.masseinheit,
            inhalt: items.inhalt,
            traubensorte: items.traubensorte,
            'lief-einheit': `${items['lief-einheit']}.00`,
            'min-bestand': items['min-bestand'],
            'ek-aktuell': `${formatterMoney(items['ek-aktuell'])}.00`,
            'ek-letzter': `${formatterMoney(items['ek-letzter'])}.00`,
            'vk-preis': formatterMoney(Number(result)) + last_result,
            lieferfrist: items.lieferfrist,
            fibukonto: items.fibukonto.substring(0, 8)
        }
        return data
    })
}

export const dataArticel = (data) => {
    return data.map(items => ({
        artnrrezept: items.artnrrezept,
        bezeich: items.bezeich.substring(0, 24),
        kategorie: items.kategorie,
        selected: false
    }))
}

export const dataAccount = (data) => {
    return data.map(items => ({
        'acc-type': items['acc-type'],
        activeflag: items.activeflag,
        bezeich: items.bezeich,
        deptnr: items.deptnr,
        fibukonto: items.fibukonto,
        'main-nr': items['main-nr'],
        'subdept-bez': items['subdept-bez'],
        'subdept-nr': items['subdept-nr'],
        selected: false
    }))
}

const keyInput = [
    'endkum', 
    'zwkum',
    'artnr',
    'bezeich',
    'min-bestand',
    'masseinheit',
    'anzverbrauch',
    'masseinheit',
    'fibukontoo',
    'traubensorte',
    'masseinheit',
    'sUnit',
    'betriebsnr',
    'traubensorte',
    'inhalt',
    'masseinheit',
    'ek-aktuell',
    'traubensorte',
    'masseinheit',
    'lief-einheit',
    'sUnit',
    'ek-letzter',
    'masseinheit',
    'vk-preis',
    'masseinheit'
]

const input_params = [
    '@Mess',
    '@Mess',
    '1Unit=',
    'Mess',
    '@ Unit',
    '1Mess',
    'Recipe',
    '@ Unit',
    '@ Unit'
]

export const functional_modify = (GET_DATA) => {
    const validasi = GET_DATA.outputOkFlag
    const x = inputCategory
    .concat(
        inputAdditional as any, 
        UnitPrice as any)
    const filterData =(value)=>{
      return x.filter(i =>    {
           const number = i.width.
           substr(0, i.width.indexOf('px'))
           if (value) {               
               if (parseInt(number) > 70) {
                   return parseInt(number)
               }
            } else {
                if (parseInt(number) > 90) {
                    return parseInt(number)
                }
           }
       })
    }

    const filter_input = x.filter(i => {
        const number = i.width.
        substr(0, i.width.indexOf('px'))
        if (parseInt(number) == 80) {
            return parseInt(number)
        }
    })

    if (validasi !== undefined) {   
        let data = Object.assign(
            map_data(GET_DATA.lArt['l-art'][0]), GET_DATA)     
        keyInput.map((params, i) => {
            filterData(true)[i].value = data[params]
        })
    } else {
        keyInput.map((params, i) => {
            filterData(false)[i].value = ''
        })
        input_params.map((x, i) => {
            filter_input[i].value = x
        })
    }
}
const map_data = (x) => {
    return {
        endkum: x.endkum,
        zwkum: x.zwkum,
        artnr: x.artnr,
        bezeich: x.bezeich,
        'min-bestand':x['min-bestand'],
        masseinheit: x.masseinheit,
        anzverbrauch: x.anzverbrauch,
        fibukontoo: format_number(x.fibukonto),
        traubensorte: x.traubensorte,
        betriebsnr: x.betriebsnr,
        inhalt: x.inhalt,
        'ek-aktuell': `${formatterMoney(x['ek-aktuell'])}`,
        'lief-einheit': x['lief-einheit'],
        'ek-letzter': `${formatterMoney(x['ek-letzter'])}`,
        'vk-preis': `${formatterMoney(x['vk-preis'])}`
    }
}

const format_number = (params) => {
  const two_digits = params.substring(0, 4)
  const four_digits = params.substring(4, 8)
  return `${two_digits
    .match(/.{2}/g)
    .join("-")}-${four_digits}`
}


