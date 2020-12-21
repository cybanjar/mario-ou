export const item = (currentModule) =>{
    const CostControl = currentModule.subModules
    .filter(x => [
      'Stock Item',
      'Reorg-SOH',
      'Store Requisition',
      'Journal',
      'Ledger'
      ].includes(x.name) )
    const Outlet = currentModule.subModules
    .filter(x => [
      'Outlet Compliment Journalizing',
      'Recipe'
      ].includes(x.name) )
    const Incoming = currentModule.subModules
    .filter(x => [
      'Incoming Journalizing',
      'Stored withPO',
    //   'Incoming Stock',
      'Stored with outPO',
    //   'Incoming StockoutPO',
      'Issued withPO',
      'Issued withoutPO',
    //   'Incoming StockIssuedwithoutPO',
      'Stored withDML',
      'Issued withDML'
      ].includes(x.name) )
    const Outgoing = currentModule.subModules
    .filter(x => [
      'Inter Kitchen Transfer',
      'Stock Item Transform',
      'Inter Store Transfer',
      'Issuing'
      ].includes(x.name) )
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