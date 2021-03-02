import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'File Number',
        field: 'briefnr',
        name: 'briefnr',
        align: 'left',
        sortable: false,
        style: 'width: 120px'
    },
    {
        label: 'Category',
        field: 'briefkateg',
        name: 'briefkateg',
        align: 'left',
        sortable: false,
        style: 'width:90px'
    },
    {
        label: 'Description',
        field: 'briefbezeich',
        name: 'briefbezeich',
        align: 'left',
        sortable: false,
        style: 'width: 350px'
    },
    {
        label: 'Program Name',
        field: 'fname',
        name: 'fname',
        align: 'left',
        sortable: false,
    },
    { 
        name: 'actions', 
        field: 'actions' ,
        style: 'width: 10px'
    },
];
