import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Number',
        field: 'setup-id',
        name: 'setup-id',
        align: 'center',
        sortable: false,
        style: 'width: 50px'
    },
    {
        label: 'Description',
        field: 'bezeichnung',
        name: 'bezeichnung',
        align: 'left',
        sortable: false,
    },
    {
        name: 'actions',
        field: 'actions',
        style: 'width: 5px',
    },
];
