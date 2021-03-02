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
        label: 'Day Nett',
        field: 'inhalt',
        name: 'inhalt',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Service',
        field: 'qty',
        name: 'qty',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Goverment Tax',
        field: 'qty1',
        name: 'qty1',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Day Gross',
        field: 'avrg-amount',
        name: 'avrg-amount',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Percentage (%)',
        field: 'amount',
        name: 'amount',
        align: 'left',
        sortable: false,
    },
];
