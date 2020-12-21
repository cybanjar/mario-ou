import { TableHeader } from '~/components/VhpUI/typings';
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export const tableHeaders: TableHeader[] = [
    {
        label: 'Departement',
        field: 'departement',
        name: 'departement',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Bill Number',
        field: 'rechnr',
        name: 'rechnr',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Cash Rp',
        field: 'p-cash',
        name: 'p-cash',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Credit Card /CL',
        field: 't-credit',
        name: 't-credit',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Transfer',
        field: 'r-transfer',
        name: 'r-transfer',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Compliment',
        field: 'comp',
        name: 'comp',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Cupon',
        field: 'coupon',
        name: 'coupon',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Info',
        field: 'info',
        name: 'info',
        align: 'left',
        sortable: false,
    },
]