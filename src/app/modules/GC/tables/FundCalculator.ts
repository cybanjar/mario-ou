import { TableHeader } from '~/components/VhpUI/typings';
export const tableHeaders: TableHeader[] = [
    {
        label: 'Advance Number',
        field: 'docu-nr',
        name: 'docu-nr',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Remark',
        field: 'bemerk',
        name: 'bemerk',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Amount',
        field: 'betrag',
        name: 'betrag',
        align: 'right',
        sortable: false,
    },
]
export const tableHeadersAdd: TableHeader[] = [
    {
        label: 'Date',
        field: 'datum',
        name: 'datum',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Invoice Number',
        field: 'docu-nr',
        name: 'docu-nr',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Amount',
        field: 'betrag',
        name: 'betrag',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Remark',
        field: 'bemerk',
        name: 'bemerk',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Receiver',
        field: 'username',
        name: 'username',
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
]