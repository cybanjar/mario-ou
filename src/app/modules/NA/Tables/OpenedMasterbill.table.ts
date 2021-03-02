import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Bill Number',
        field: 'rechnr',
        name: 'rechnr',
        align: 'left',
        sortable: false,
        style: 'width: 100px'
    },
    {
        label: 'Name',
        field: 'name',
        name: 'name',
        align: 'left',
        sortable: false,
        style: 'width: 200px'
    },
    {
        label: 'Outstanding',
        field: 'saldo',
        name: 'saldo',
        align: 'left',
        sortable: false,
        style: 'width: 200px'
    },
    {
        label: 'Depature',
        field: 'abreise',
        name: 'abreise',
        align: 'left',
        sortable: false,
        style: 'width: 70px'
    },
    {
        label: 'Room No.',
        field: 'zinr',
        name: 'zinr',
        align: 'left',
        sortable: false,
        style: 'width: 70px'
    }
];
