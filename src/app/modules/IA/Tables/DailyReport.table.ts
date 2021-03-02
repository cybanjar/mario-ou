import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'File Number',
        field: 'filenumber',
        name: 'filenumber',
        align: 'left',
        sortable: false,
        style: 'width: 100px'
    },
    {
        label: 'Description',
        field: 'des',
        name: 'des',
        align: 'left',
        sortable: false,
        style: 'width: 300px'
    },
    {
        label: 'File Name',
        field: 'filename',
        name: 'filename',
        align: 'left',
        sortable: false,
    },
];
