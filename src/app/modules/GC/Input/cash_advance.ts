const display = [
  {
    label: 'Apply',
    value: 0,
  },
  {
    label: 'Posted',
    value: 1,
  },
  {
    label: 'Closed',
    value: 2,
  },
  {
    label: 'Cencelled',
    value: 3,
  },
];

export const Search = [
  {
    name: 'From Name',
    value: '',
    options: [],
    onClick: '1',
  },
  {
    name: 'To Name',
    value: 'zzz',
  },
  {
    name: 'Display',
    value: display[0],
    options: display,
  },
];

export const use_input = [
  {
    name: 'Cash Advane Number',
    right: '35px',
    width: '230px',
    value: '',
  },
  {
    name: 'Settlement Number',
    width: '230px',
    right: '35px',
    value: '',
  },
  {
    name: 'Status',
    width: '230px',
    value: '',
    right: '0px',
  },
];

export const input_account = [
  {
    name: 'Account Number',
    right: '20px',
    width: '238px',
    value: '',
    mask: '##-##-####',
    onClick: '1',
  },
  {
    name: 'Name',
    right: '20px',
    width: '160px',
    value: '',
    onClick: '2',
  },
  {
    name: 'Departement',
    right: '20px',
    width: '160px',
    value: '',
    mask: '####',
    onClick: '3',
  },
];

export const use_inputchild = {
  appForm: [
    {
      name: 'Name',
      value: '',
      right: '20px',
      options: [],
      width: '160px',
    },
    {
      name: 'Departement',
      right: '20px',
      value: '',
      width: '160px',
      disable: true,
    },
    {
      name: 'Purpose',
      right: '0px',
      value: '',
      width: '221px',
      options: [],
    },
    {
      name: 'Remark',
      right: '0px',
      value: '',
      width: '582px',
    },
    {
      name: 'Amount',
      right: '20px',
      value: '',
      width: '160px',
      onClick: 'true',
    },
    {
      name: 'Account',
      right: '0px',
      value: '',
      width: '401px',
      disable: true,
    },
  ],
  Payment: [
    {
      name: 'Cheque / Giro Number',
      right: '0px',
      value: '',
      width: '360px',
      key: '1',
      disable: true,
    },
    {
      name: 'Due Date',
      right: '20px',
      value: '',
      width: '170px',
      top: '-10px',
      disable: true,
    },
    {
      name: 'Clearing Date',
      right: '0px',
      value: '',
      width: '170px',
      top: '-10px',
      left: '-122px',
      disable: true,
    },
    {
      name: 'Amount',
      right: '52px',
      value: '',
      width: '170px',
      key: '2',
    },
    {
      name: 'Account',
      right: '0px',
      value: '',
      width: '359px',
      key: '3',
      options: [],
    },
  ],
  Settlement: [
    {
      name: 'Supplier',
      right: '20px',
      value: '',
      width: '160px',
      top: '-10px',
      options: [],
    },
    {
      name: 'Invoice Number',
      right: '20px',
      value: '',
      width: '160px',
      top: '-10px',
      onClick: '1',
    },
    {
      name: 'Remark',
      right: '0px',
      value: '',
      width: '220px',
      top: '-10px',
    },
    {
      name: 'Amount',
      right: '20px',
      value: '',
      width: '160px',
      top: '-10px',
    },
    {
      name: 'Account',
      right: '0px',
      value: '00-00-0000',
      width: '401px',
      top: '-10px',
      onClick: '2',
    },
    {
      name: 'Return Amount',
      right: '20px',
      value: '',
      width: '160px',
      top: '-10px',
    },
    {
      name: 'Return Account',
      right: '0px',
      value: '',
      width: '401px',
      top: '-10px',
    },
  ],
};
