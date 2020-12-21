export const paramsCallsListGoBtn = (val) => ({
        caseType: val.input.dialedNo == ''? 0 : val.input.dialedNo == '*' ? 1 : 2 ,
        lastSort: val.sorting.value,
        fromDate: val.date.start,
        toDate: val.date.end,
        fromExt: val.input.fromExtension,
        toExt: val.input.toExtension,
        stattype: val.groupRadio,
        priceDecimal: 0,
        doubleCurrency: false,
        frNumber: '',
        toNumber: '',
        dialedNr: val.input.dialedNo
})

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