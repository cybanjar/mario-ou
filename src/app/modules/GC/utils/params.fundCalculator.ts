
import {use_input} from '../Input/Fund_Calculator'
export const FUNDCALCULATOR = () => {
    for(const i of use_input.filter(x => ![
        'Account Number', 'Total Debit', 'Balance'
    ].includes(x.name))){
        i.value = ''
    }
    for(const i of use_input.filter(x => [
       'Total Debit'
    ].includes(x.name))){
        i.value = '0'
    }
}