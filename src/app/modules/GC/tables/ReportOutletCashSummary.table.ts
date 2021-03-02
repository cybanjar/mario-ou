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
        label: 'Cash',
        field: 'p-cash',
        name: 'p-cash',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Card / City Ledger',
        field: 't-credit',
        name: 't-credit',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Transfer',
        field: 'r-transfer',
        name: 'r-transfer',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Compliment',
        field: 'comp',
        name: 'comp',
        align: 'right',
        sortable: false,
    },
    {
        label: 'Meal Coupon',
        field: 'coupon',
        name: 'coupon',
        align: 'right',
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