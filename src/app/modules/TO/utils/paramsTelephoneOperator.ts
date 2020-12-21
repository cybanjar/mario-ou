import {date} from 'quasar'
export const paramsOnSearch = (val?, ciDate?) => ({
    sorttype: val.reservation,
    room: val.guestname !== 3 ? val.dataInput.NationdanRomm : '',
    fdate1: date.formatDate(val.date.start, 'MM/DD/YY'),
    fdate2: date.formatDate(val.date.end, 'MM/DD/YY'),
    ciDate: date.formatDate(ciDate, 'MM/DD/YY'),
    lname: val.dataInput.valName == ''? ' ': val.dataInput.valName,
    lastSort: val.guestname,
    lnat: val.guestname == 3 ? val.dataInput.NationdanRomm : '',
    lresnr: val.dataInput.ResNo
})

export const paramsPrepare = (ciDate) => ({
    sorttype : 2,
    room: '',
    fDate1: '01/14/19',
    fDate2: '01/31/19',
    ciDate: date.formatDate(ciDate, 'MM/DD/YY'),
    lname: '*',
    lastSort: 1,
    Inat: '',
    Iresnr: ''
})

export const saveDataMessage = (params) => {
    const {dataRow, keySave, recid, user, dataMessge} = params
    return {
    recId: keySave == 'save'? '0': recid,
    iCase: keySave == 'save'? '1': '2',
    gastnr: dataRow.gastnrmember,
    resnr: dataRow.resnr,
    reslinnr: dataRow.reslinnr,
    userInit: user.userInit,
    messTextSv: dataMessge.newText,
    callerSv: dataMessge.newCaller,
    rufnrSv: dataMessge.newPhone
}}