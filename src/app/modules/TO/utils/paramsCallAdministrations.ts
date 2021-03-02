import {my_date} from './MyDate'
export const paramsCallsListGoBtn = (val) => {
        const startDate = my_date(val.date.startDate)
        const endDate = my_date(val.date.endDate)
        return {
                caseType: val.input.dialedNo == ''? 0 : val.input.dialedNo == '*' ? 1 : 2 ,
                lastSort: val.sorting.value,
                fromDate: startDate,
                toDate: endDate,
                fromExt: val.input.fromExtension,
                toExt: val.input.toExtension,
                stattype: val.groupRadio,
                priceDecimal: 0,
                doubleCurrency: false,
                frNumber: '',
                toNumber: '',
                dialedNr: val.input.dialedNo
        }
}

export const paramsTable = (val) => ({
    nebenstelle : '', 
    datum : '', 
    zeit : '', 
    rufnummer : '', 
    destination : '', 
    'pabx-rate' : val.amount1,
    'guest-rate' : val.amount2,
    dauer : '',
    rechnr : '',
    print : '',
    impulse : '',
    line : ''
  })