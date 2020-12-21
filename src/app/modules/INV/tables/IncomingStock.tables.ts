export const tableHeaders = [
    {
      label: 'Articel No',
      field: 'artnr',
      name: 'artnr',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Description',
      field: 'bezeich',
      name: 'bezeich',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Const',
      field: 'endkum',
      name: 'endkum',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Quantity',
      field: 'anzahl',
      name: 'anzahl',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Unit Price',
      field: 'einzelpreis',
      name: 'einzelpreis',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Amount',
      field: 'warenwert',
      name: 'warenwert',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Arrival Date',
      field: 'lieferdatum-eff',
      name: 'lieferdatum-eff',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Delive D-Unit',
      field: 'geliefert',
      name: 'geliefert',
      align: 'left',
      sortable: false,
    },
    {
      label: 'S-Unit',
      field: 'zeit',
      name: 'zeit',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Actual Price',
      field: 'rechnungspreis',
      name: 'rechnungspreis',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Amount',
      field: 'rechnungswert',
      name: 'rechnungswert',
      align: 'left',
      sortable: false,
    },
  ];
  
  export const DeliveryNumber = [
    {
      label: 'Date',
      field: 'datum',
      name: 'datum',
      align: 'left',
      sortable: false,
    },
    {
      label: 'St',
      field: 'lager-nr',
      name: 'lager-nr',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Document Number',
      field: 'docu-nr',
      name: 'docu-nr',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Delivery Number',
      field: 'lscheinnr',
      name: 'lscheinnr',
      align: 'left',
      sortable: false,
    },
  ]
  

  export const use_input = [
    {
      name: 'PO Number',
      value: '',
      width: '170px',
      right: '20px',
      disable: true
    },
    {
      name: 'Created By',
      value: '',
      width: '170px',
      disable: true
    },
    {
      name: 'Department',
      value: '',
      width: '170px',
      top: '-5px',
      right: '20px',
      disable: true
    },
    {
      name: 'Supplier',
      value: '',
      width: '170px',
      top: '-5px',
      disable: true
    },
    {
      name: 'Order Date',
      value: '',
      width: '170px',
      top: '-5px',
      right: '20px',
      disable: true
    },
    {
      name: 'Delivery Date',
      value: '',
      width: '170px',
      top: '-5px',
      disable: true
    },
    {
      name: 'Order Type',
      value: '',
      width: '170px',
      top: '-5px',
      right: '20px',
      disable: true
    },
    {
      name: 'Released',
      value: '',
      width: '170px',
      top: '-5px',
      disable: true
    },
    {
      name: 'Currency',
      value: '',
      width: '170px',
      top: '-5px',
      right: '20px',
      disable: true
    },

  ]

  export const use_input2 = [
    {
      name: 'Delevery Number',
      value: '',
      width: '155px',
      right: '20px',
      onClick: 'DeleveryNumber',
      value2: '',
      icon: true
    },
    {
      name: 'Stored',
      value: '',
      width: '155px',
      right: '20px',
      disable: true
    },
    {
      name: 'Item Selected',
      value: '',
      width: '300px',
      disable: true
    },
    {
      name: 'Delivery Unit',
      value: '',
      width: '149px',
      disable: true
    },
    {
      name: 'Content',
      value: '',
      width: '85px',
      disable: true,
    },
    {
      name: 'Delivery Unit Quantity',
      value: '',
      width: '145px',
      disable: true,
      blur: 'dileveryUnit',
      right: '20px'
    },
    {
      name: 'Mess Unit Quantity',
      value: '',
      width: '145px',
      right: '20px',
      disable: true
    },
    {
      name: 'Unit Price',
      value: '',
      width: '182px',
      right: '20px',
      disable: true
    },
    {
      name: 'Amount',
      value: '',
      width: '80px',
      right: '20px',
      disable: true
    },
    {
      name: 'return',
      disable: true
    }
  ]