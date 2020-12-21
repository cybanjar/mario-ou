import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export const use_input = [
    {
        name : 'Account Name',
        width: '170px',
        right: '15px',
        left: '1px',
        value: '',
        options: []
    },
    {
        name : 'Account Number',
        width: '170px',
        value: '',
        disable: true
    },
    {
        name : 'Total Debit',
        width: '170px',
        right: '15px',
        top: '30px',
        value: '0'
    },
    {
        name : 'Balance',
        top: '30px',
        width: '170px',
        value: '0'
      },
      {
        name : 'Reserved Balance',
        width: '170px',
        right: '15px',
        value: '',
        onCLick: 'reserved',
        disable: true
      },
      {
        name : 'Additional Fund Needed',
        width: '170px',
        value: '',
        disable: true
      },
      {
        name : 'Requested Ending Balance',
        width: '170px',
        right: '15px',
        onCLick: 'Requested',
        value: '',
        disable: true
      },
      {
        name : 'Cheque/Giro To Be Opened',
        width: '170px',
        disable: true,
        value: ''
      },
]
