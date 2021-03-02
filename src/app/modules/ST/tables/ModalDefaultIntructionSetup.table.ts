import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
    {
        label: 'Number',
        field: 'briefnr',
        name: 'briefnr',
        align: 'left',
        sortable: false,
        style: 'width: 120px'
    },
    {
        label: 'Description',
        field: 'briefbezeich',
        name: 'briefbezeich',
        align: 'left',
        sortable: false,
        style: 'width: 350px'
    },
];
