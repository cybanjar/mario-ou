import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
        {
          label: 'Description',
          field: 'trans-to-storage',
          name: 'trans-to-storage',
          align: 'left',
          sortable: false,
        },
        {
          label: 'Cost Allocation',
          field: 'cost-alloc',
          name: 'cost-alloc',
          align: 'left',
          sortable: false,
        },
        {
          label: 'Today Consumed',
          field: 'day-cons',
          name: 'day-cons',
          sortable: false,
        },
        {
          label: 'MTD Consumed',
          field: 'mtd-cons',
          name: 'mtd-cons',
          align: 'right',
          sortable: false,
        }
      ];

