import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Date',
        field: 'datum',
        name: 'datum',
        align: 'left',
        sortable: false,
        style: 'width: 100px'
    },
    {
        label: `Competitor Number`,
        field: 'betriebsnr',
        name: 'betriebsnr',
        align: 'right',
        sortable: false,
        style: 'width: 120px',
    },
    {
        label: 'Competitor Name',
        field: 'bezeich',
        name: 'bezeich',
        align: 'left',
        sortable: false,
        style: 'width: 250px'
    },
    {
        label: 'Saleable Room',
        field: 'zimmeranz',
        name: 'zimmeranz',
        align: 'right',
        sortable: false,
        style: 'width: 50px'
    },
    {
        label: 'Occupied Room',
        field: 'personen',
        name: 'personen',
        align: 'right',
        sortable: false,
        style: 'width: 50px'
    },
    {
        label: 'Complimentary Room',
        field: 'munit',
        name: 'munit',
        align: 'left',
        sortable: false,
        style: 'width: 70px'
    },
    {
        label: 'Room Revenue',
        field: 'logisumsatz',
        name: 'logisumsatz',
        align: 'right',
        sortable: false
    },
    {
        label: '',
        field: 'actions',
        name: 'actions',
        align: 'left',
        sortable: false,
        style: 'width: 20px'
    },
];
