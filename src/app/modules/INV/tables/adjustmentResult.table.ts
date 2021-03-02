import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Article Number',
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
        label: 'Unit',
        field: 'munit',
        name: 'munit',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Content',
        field: 'inhalt',
        name: 'inhalt',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Current Quantity',
        field: 'qty',
        name: 'qty',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Actual Quantity',
        field: 'qty1',
        name: 'qty1',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Average Amount',
        field: 'avrg-amount',
        name: 'avrg-amount',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Amount',
        field: 'amount',
        name: 'amount',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Account Number',
        field: 'fibukonto',
        name: 'fibukonto',
        sortable: false,
    },
    {
        label: 'Cost Allocation',
        field: 'cost-center',
        name: 'cost-center',
        sortable: false,
    },
];
