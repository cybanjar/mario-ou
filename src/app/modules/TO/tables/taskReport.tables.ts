import { TableHeader } from '~/components/VhpUI/typings';


export const tableHeaders: TableHeader[] = [
    {
      label: 'Id',
      name: 'id',
      field: 'id',
      align: 'left',
      sortable: false,
    },
    {
      label: 'From Date',
      name: 'frdate',
      field: 'datum',
      align: 'left',
      sortable: false,
      style:"min-width: 100px;"
    },
    {
      label: 'To Date',
      name: 'toDate',
      field: 'datum',
      align: 'left',
      sortable: false,
      style:"min-width: 100px"
    },
    {
      label: 'Note',
      name: 'note',
      field: 'note',
      align: 'left',
      sortable: false,
      style:"min-width: 120px"
      
    },
    {
      label: 'Urgent',
      name: 'urgent',
      field: 'urgent',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Done',
      name: 'done',
      field: 'done',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Departement',
      name: 'dept',
      field: 'dept',
      align: 'left',
      sortable: false,
      style:"min-width: 120px"
    },
    {
      label: 'Disp C/I',
      name: 'ciflag',
      field: 'ciflag',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Disp C/O',
      name: 'coflag',
      field: 'coflag',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Disp Rsv',
      name: 'rsv-detail',
      field: 'rsv-detail',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Disp Bill',
      name: 'bill-flag',
      field: 'bill-flag',
      align: 'left',
      sortable: false,
    }
]

export const dataTable = (data) => {
  return data.map((items) => ({
    newflag: items.newflag,
    id: items.id,
    frdate: items.frdate,
    datum: items.datum,
    note: items.note,
    urgent: items.urgent,
    done: items.done,
    dept: items.dept == ''? null : [items.dept],
    ciflag: items.ciflag,
    coflag: items.coflag,
    'rsv-detail': items['rsv-detail'],
    'bill-flag' : items['bill-flag']
  }))
}