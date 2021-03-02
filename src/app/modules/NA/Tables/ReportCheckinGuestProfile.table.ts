import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Room Number',
        field: 'roomNumber',
        name: 'roomNumber',
        align: 'left',
        sortable: false,
        style: 'width: 80px'
    },
    {
        label: 'Guest Name',
        field: 'guestName',
        name: 'guestName',
        align: 'left',
        sortable: false,
        style: 'width: 200px'
    },
    {
        label: 'Adult',
        field: 'adult',
        name: 'adult',
        align: 'left',
        sortable: false,
        style: 'width: 50px'
    },
    {
        label: 'Compliment',
        field: 'compliment',
        name: 'compliment',
        align: 'left',
        sortable: false,
        style: 'width: 80px'
    },
    {
        label: 'Status',
        field: 'status',
        name: 'status',
        align: 'left',
        sortable: false,
        style: 'width: 100px'
    },
    {
        style: 'width: 100px',
        label: 'Room Rate',
        field: 'Room',
        name: 'Room',
        align: 'left',
        sortable: false,
    },
    {
        style: 'width: 100px',
        label: 'Depature',
        field: 'depature',
        name: 'depature',
        align: 'left',
        sortable: false,
    },
    {
        style: 'width: 100px',
        label: 'Country(abbrevation)',
        field: 'country',
        name: 'country',
        align: 'left',
        sortable: false,
    },
    {
        style: 'width: 100px',
        label: 'Nationality',
        field: 'nationality',
        name: 'nationality',
        align: 'left',
        sortable: false,
    },
    {
        style: 'width: 100px',
        label: 'Local Region',
        field: 'local',
        name: 'local',
        align: 'left',
        sortable: false,
    },
    {
        style: 'width: 200px',
        label: 'Email',
        field: 'email',
        name: 'email',
        align: 'left',
        sortable: false,
    },
    {
        style: 'width: 200px',
        label: 'Source',
        field: 'source',
        name: 'source',
        align: 'left',
        sortable: false,
    },
    {
        style: 'width: 200px',
        label: 'Segment Code',
        field: 'segmentcode',
        name: 'segmentcode',
        align: 'left',
        sortable: false,
    },
    { name: 'actions', field: 'actions', style: 'width: 20px' },
];
