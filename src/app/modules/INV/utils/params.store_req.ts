import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import {use_input, use_input1} from '../tables/storeRequisition'
import {date} from 'quasar'

export const data = (GET_DATA) => {
    return  GET_DATA.tList['t-list'].map((items) => ({
        datum: items.datum,
        lscheinnr: items.lscheinnr,
        ['f-bezeich'] : items['f-bezeich'],
        deptName : items.deptName,
        artnr: items.artnr,
        bezeich: items.bezeich,
        einheit: items.einheit,
        content: items.content !== 0 ? items.content : '',
        einzelpreis: items.einzelpreis !== 0 ? formatterMoney(items.einzelpreis) : items.price,
        qty:  `${items.qty}.000`,
        qty1: `${items.qty1}.000`,
        stornogrund: items.stornogrund,
        ID: items.ID,
        appStr: items.appStr,
        actions: items.actions,
        ['t-status']: items['t-status'],
        price: items.price
      }));
}



const mapGroup = (data,vstring, varname) => {
  return data.map(items => ({
    label: `${items[varname]} - ${items[vstring]}`,
    value: items[varname]
  }))
}

export const departments = (data) => {
  return mapGroup(
    data.tParameters['t-parameters'],
    'vstring',
    'varname'
  );
}

const stockarticel = (data) => {
  return data.sartnrList['sartnr-list'].map(x => ({    
    label: `${x.bezeich} - ${x['anz-anf-best'] + x['anz-eingang'] - x['anz-ausgang']}`,
    value: x.artnr
  }))

}

export const input_header = (value, departments?) => {
  if (value.lscheinnr) use_input[0].value = value.lscheinnr
  else if(departments !== undefined) use_input1[0].options = departments
  else if(value.sartnrList) use_input1[1].options = stockarticel(value)
  const x = mapGroup(value.tLLager['t-l-lager'],
  'bezeich', 'lager-nr')
  for(const i of use_input.filter(x => [
    'From Store', 'To Store'
  ].includes(x.name))){
    i.options = x
  }
}

export const data_table = (value, xi, group) => {
  return {
    storageNumber: '1',
    sUsername: value.sUsername,
    des: value.sBezeich,
    articelNumber: xi[0].artnr,
    unitPrice: formatterMoney(xi[0]['vk-preis']),
    onhand: xi.onhand+'.00',
    quantity: use_input1[4].value,
    amount: formatterMoney(xi[0]['vk-preis']),
    date: date.formatDate(new Date, 'DD/MM/YYYY'),
    time: date.formatDate(new Date, 'hh:mm:ss'),
    type: group == '1' ? 'Transfer Out' : 'Outgoing',
    acctNo: group == '1' ? '0000' : use_input[3].value,
    selection: false
  }
  
}
