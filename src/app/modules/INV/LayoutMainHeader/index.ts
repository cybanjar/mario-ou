const cost_control = [
  'Stock Item',
  'Reorg-SOH',
  'Store Requisition',
  'Journal',
  'Ledger'
  ]

const outlet = [
  'Outlet Compliment Journalizing',
  'Recipe'
]

const incoming = [
  'Incoming Journalizing',
  'Stored with PO',
//   'Incoming Stock',
  'Stored Without PO',
//   'Incoming StockoutPO',
  'Issued With PO',
  'Issued Without PO',
//   'Incoming StockIssuedwithoutPO',
  'Stored With DML',
  'Issued With DML'
  ]

const outgoing = [
  'Inter Kitchen Transfer',
  'Stock Item Transform',
  'Inter Store Transfer',
  'Issuing',
  'Outgoing Journalizing'
]

export const item = (currentModule) =>{
    const CostControl = currentModule.subModules
    .filter(x => cost_control.includes(x.name))
    const Outlet = currentModule.subModules
    .filter(x => outlet.includes(x.name))
    const Incoming = currentModule.subModules
    .filter(x => incoming.includes(x.name))
    const Outgoing = currentModule.subModules
    .filter(x => outgoing.includes(x.name))
    return  [
      {
        name: 'Cost Control',
        item: CostControl
      },
      {
        name: 'Outlet',
        item: Outlet
      },
      {
        name: 'Incoming',
        item: Incoming
      },
      {
        name: 'Outgoin',
        item: Outgoing
      },
    ]
}