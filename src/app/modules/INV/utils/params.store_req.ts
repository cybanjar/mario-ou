import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import {use_input, use_input1} from '../tables/storeRequisition'
import {use_inputEDIT, use_inputEDIT1} from '../Input/InputStoreReq'
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
        price: items.price,
        selected: false
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
  if (value.lscheinnr) use_input[0].value = value.lscheinnr, use_inputEDIT[0].value = value.lscheinnr
  else if(departments !== undefined) use_input1[0].options = departments, use_inputEDIT1[0].options = departments
  else if(value.sartnrList) use_input1[2].options = stockarticel(value), use_inputEDIT1[2].options = stockarticel(value)
  const x = mapGroup(value.tLLager['t-l-lager'],
  'bezeich', 'lager-nr')
  for(const i of use_input.filter(x => [
    'From Store', 'To Store'
  ].includes(x.name))){
    i.options = x
  }
  for(const i of use_inputEDIT.filter(x => [
    'From Store', 'To Store'
  ].includes(x.name))){
    i.options = x,
    i.disable = true
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

export const data_insert = (data, dataRow) => {
  const dataInput = use_inputEDIT.filter(x => {
    if (dataRow.stornogrund !== '') {
      return !['To Store'].includes(x.name)
    }
    return !['Account'].includes(x.name)
  })

  
  const dataInput2 = use_inputEDIT1.filter(x => [
    'Departement', 'Date', 'Stock Articel Name', 'Quantity Mess Unit' ].includes(x.name))
  const data2 = {
    fromStore : `${data.currLager} - ${data.lagerBezeich}`,
    toStore : `${data.currPos} - ${data.lagerBez1}`,
    amount: formatterMoney(data.tAmount),
    account: dataRow.stornogrund,
    departement: `${data.deptNo} - ${data.deptname}`,
    date: date.formatDate(data.opList['op-list'][0].datum, 'YYYY, MM, DD')
  }
  Object.assign(data, data2)
  const xi = [
    'lscheinnr', 
    'fromStore', 
    'account', 
    'toStore', 
    'amount'
  ].filter(x => {
    if (dataRow.stornogrund !== '') {
      return !['toStore'].includes(x)
    }
    return !['account'].includes(x)
  })
  for(const i in xi){
    dataInput[i].value = data[xi[i]]
  }
  
  const ixx = ['departement', 'date', '', '']
  for(const i in ixx ){
    dataInput2[i].value = data[ixx[i]]
  }
}

export const data_modify = (data, dataRow) => {
  const dataInput = use_inputEDIT.filter(x => {
    if (dataRow.stornogrund !== '') {
      return !['To Store'].includes(x.name)
    }
    return !['Account'].includes(x.name)
  })
  const dataInput2 = use_inputEDIT1.filter(x => [
    'Departement', 'Date', 'Stock Articel Name', 'Quantity Mess Unit' ].includes(x.name))
  const data2 = {
    fromStore : `${data.currLager} - ${data.lagerBezeich}`,
    toStore : `${data.currPos} - ${data.lagerBez1}`,
    amount: formatterMoney(data.tAmount),
    account: dataRow.stornogrund,
    departement: `${data.deptNo} - ${data.deptname}`,
    date: date.formatDate(data.opList['op-list'][0].datum, 'YYYY, MM, DD')
  }
  Object.assign(data, data2)
  const xi = [
    'lscheinnr', 
    'fromStore', 
    'account', 
    'toStore', 
    'amount'
  ].filter(x => {
    if (dataRow.stornogrund !== '') {
      return !['toStore'].includes(x)
    }
    return !['amount'].includes(x)
  })
  for(const i in xi){
    dataInput[i].value = data[xi[i]]
    dataInput[i].disable = true
  }
  const ixx = ['departement', 'date', '', '']
  for(const i in ixx ){
    dataInput2[i].value = data[ixx[i]]
    dataInput2[i].disable = true
  }
}



export const data_initialstock = (data, dataRow) => {
  const dataInput = use_inputEDIT.filter(x => {
    if (dataRow.stornogrund !== '') {
      return !['To Store'].includes(x.name)
    }
    return !['Account'].includes(x.name)
  })
  const dataInput2 = use_inputEDIT1.filter(x => [
    'Departement', 'Date', 'Stock Articel Name', 'Quantity Mess Unit' ].includes(x.name))
  const data2 = {
    fromStore : `${data.currLager} - ${data.lagerBezeich}`,
    toStore : `${data.currPos} - ${data.lagerBez1}`,
    amount: formatterMoney(data.tAmount),
    account: dataRow.stornogrund,
    departement: `${data.deptNo} - ${data.deptname}`,
    date: date.formatDate(data.opList['op-list'][0].datum, 'YYYY, MM, DD')
  }
  Object.assign(data, data2)
  const xi = [
    'lscheinnr', 
    'fromStore', 
    'account', 
    'toStore', 
    'amount'
  ].filter(x => {
    if (dataRow.stornogrund !== '') {
      return !['toStore'].includes(x)
    }
    return !['amount'].includes(x)
  })
  for(const i in xi){
    dataInput[i].value = data[xi[i]]
    dataInput[i].disable = true
  }
  const ixx = ['departement', 'date', '', '']
  for(const i in ixx ){
    dataInput2[i].value = data[ixx[i]]
    dataInput2[i].disable = true
  }
}



export const dataTable_modify = (data) => {
    return data.opList['op-list'].map((items) => ({
      storageNumber: `0${items['lager-nr']}`,
      articelNumber: items.artnr,
      des: items.bezeich,
      unitPrice: formatterMoney(items.einzelpreis),
      onhand: `${items.onhand}00`,
      quantity: `${items.anzahl}00`,
      amount: formatterMoney(items.warenwert),
      date: items.datum,
      type: items.stornogrund !== '' ? 'Outgoing' : 'TranfersOut',
      sUsername: items.username,
      time: '',
      acctNo: items.fibu10,
      selection: false
  }))
}

export const deletevalueinput = () => {
  for(const input of use_inputEDIT){
    input.value = ''
  }
  for(const input of use_inputEDIT1){
    input.value = ''
  }
}