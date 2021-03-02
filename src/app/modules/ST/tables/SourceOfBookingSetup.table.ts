import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Number',
        field: 'number1',
        name: 'number1',
        align: 'left',
        sortable: false,
        style: 'width: 120px'
    },
    {
        label: 'Code',
        field: 'char1',
        name: 'char1',
        align: 'left',
        sortable: false,
        style: 'width: 350px'
    },
    {
        label: 'Description',
        field: 'char2',
        name: 'char2',
        align: 'left',
        sortable: false,
        style: 'width: 350px'
    },
    {
        name: 'actions',
        field: 'actions',
        style: 'width: 5px',
    },
];
