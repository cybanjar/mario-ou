import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Inventory Account',
        field: 'inv-acct',
        name: 'inv-acct',
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
        label: 'Opening Value',
        field: 'prevval',
        name: 'prevval',
        sortable: false,
    },
    {
        label: 'Incoming Value',
        field: 'inval',
        name: 'inval',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Consumed Value',
        field: 'outval',
        name: 'outval',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Ending Value',
        field: 'actval',
        name: 'actval',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Initial On Hand Adjustment',
        field: 'adjust',
        name: 'adjust',
        align: 'right',
        sortable: false,
    },
];

