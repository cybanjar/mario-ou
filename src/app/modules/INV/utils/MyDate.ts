import {date} from 'quasar'
export function my_date(mydate) {
    const mydate1 = mydate.substring(0, mydate.lastIndexOf('/')+1)
    const mydate2 = mydate.substring(mydate.lastIndexOf('/')+1)
    const year = date.formatDate(new Date(), 'YYYY').substring(0, 2)
    return mydate1+year+mydate2
  }