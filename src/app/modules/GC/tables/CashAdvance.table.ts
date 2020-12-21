import { TableHeader } from '~/components/VhpUI/typings';
export const tableHeaders: TableHeader[] = [
    {
        label: 'User Name',
        field: 'username',
        name: 'username',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Date',
        field: 'datum',
        name: 'datum',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Purpose',
        field: 'bezeich',
        name: 'bezeich',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Invoice-No',
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
        label: 'Pay Date',
        field: 'pay-datum',
        name: 'pay-datum',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Clearin Date',
        field: 'postDate',
        name: 'postDate',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Cheque/Giro',
        field: 'chequeNo',
        name: 'chequeNo',
        align: 'left',
        sortable: false,
    },
    {
        label: 'SetleDate',
        field: 'datum2',
        name: 'datum2',
        align: 'left',
        sortable: false,
    },
    {
        label: 'T',
        field: 'pay-type',
        name: 'pay-type',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Reurn-Amount',
        field: 'returnAmt',
        name: 'returnAmt',
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
    { name: 'actions', field: 'actions' },
]

export const invoiceNumber :  TableHeader[] = [
    {
        label: 'Date',
        field: 'rgdatum',
        name: 'date',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Document Number',
        field: 'NAME',
        name: 'date',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Invoice Number',
        field: 'lscheinnr',
        name: 'date',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Amount',
        field: 'saldo',
        name: 'date',
        align: 'left',
        sortable: false,
    },
]

export const table_settelment: TableHeader[] = [
    {
        label: 'Amount',
        field: 'amount',
        name: 'amount',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Remark',
        field: 'remark',
        name: 'remark',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Account Number',
        field: 'inv-AcctNo',
        name: 'inv-AcctNo',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Description',
        field: 'inv-bezeich',
        name: 'inv-bezeich',
        align: 'left',
        sortable: false,
    },
    {
        label: 'supplier',
        field: 'supplier',
        name: 'supplier',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Invoice',
        field: 'invNo',
        name: 'invNo',
        align: 'left',
        sortable: false,
    },
]

export const table_account: TableHeader[] = [
    {
        label: 'Account Number',
        field: 'fibukonto',
        name: 'fibukonto',
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
        label: 'Status',
        field: 'activeflag',
        name: 'activeflag',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Departement',
        field: 'deptnr',
        name: 'deptnr',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Main',
        field: 'main-nr',
        name: 'main-nr',
        align: 'left',
        sortable: false,
    },
]

