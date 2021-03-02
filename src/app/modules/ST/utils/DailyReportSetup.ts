
export const use_input = [
    {
        label: 'File Number',
        value: '',
        width: '100px',
        right: '20px',
        disable: true
    },
    {
        label: 'Category',
        value: '',
        width: '250px',
        disable: true
    },
    {
        label: 'File Name',
        value: '',
        width: '370px',
        disable: true
    },
    {
        label: 'Last Column',
        value: '',
        width: '175px',
        right: '20px',
        disable: true
    },
    {
        label: 'Last Row',
        value: '',
        width: '175px',
        disable: true
    },
    {
        label: 'Description',
        value: '',
        width: '375px',
        disable: true
    },
    {
        label: 'Google Sheet Link',
        value: '',
        width: '375px',
        disable: true
    },
]

export const ChCol = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ',
    'AK', 'AL', 'AM', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS',
    'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
]

export const mbuff = [
    'jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug',
    'sep', 'oct', 'nov', 'des'
]

export const table_input = [
    'briefnr',
    'briefkateg',
    'fname',
    'ftyp',
    'etk-anzahl',
    'briefbezeich',
    'fname2'
]

export const dataTable = (data) => {
    return data.map(items => ({
        betriebsnr: items['betriebsnr'],
        briefbezeich: items['briefbezeich'],
        briefkateg: items['briefkateg'],
        briefnr: items['briefnr'],
        'etk-anzahl': items['etk-anzahl'],
        fname: items['fname'].includes('https:')? items['fname'].substring(0, items['fname'].indexOf('|')):items['fname'],
        fname2: items['fname'].includes('https:')? items['fname'].substring(items['fname'].indexOf('|')+1): '',
        ftyp: ChCol[items['ftyp']-1],
        sprachcode: items['sprachcode'],
        selected: false
    }))
}   

export const buttonVHPWords = [
    {
      label: 'save',
      mr: '10px',
      outline: false
    },
    {
      label: 'Select word key',
      mr: '10px',
      outline: true
    },
    {
      label: 'Insert Other macro',
      mr: '10px',
      outline: true
    },
    {
      label: 'Insert a file',
      mr: '10px',
      outline: true
    },
    {
      label: 'Check Syntax',
      mr: '10px',
      outline: false
    },
    {
      label: 'Run tes',
      outline: false
    },
  ]
