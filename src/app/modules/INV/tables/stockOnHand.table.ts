import { TableHeader } from '~/components/VhpUI/typings';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { getLabels } from '~/app/helpers/getLabels.helpers';

const replaceTotal = (string: string) => {
  if (string.substring(0, 6) === 'Ttl - ') return 'Subtotal - ' + string.substring(6, string.length)
  else if (string.replace(/\s+/g, '') === 'GRANDTOTAL') return 'Total'
  else return string;
};

export const tableHeaders: TableHeader[] = [
  {
    label: getLabels('article_number', 'titleCase'),
    field: 'artnr',
    name: 'artnr',
    align: 'left',
    sortable: false,
    format: (val) => (val == 0) ? '' : val,
  },
  {
    label: getLabels('description', 'titleCase'),
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: false,
    format: (val) => replaceTotal(val),
  },
  {
    label: getLabels('unit', 'titleCase'),
    field: 'unit',
    name: 'unit',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('actual_quantity', 'titleCase'),
    field: 'act-qty',
    name: 'act-qty',
    align: 'right',
    sortable: false,
    format: (val) => (val == 0) ? '' : formatThousands(val),
  },
  {
    label: getLabels('actual_value', 'titleCase'),
    field: 'act-val',
    name: 'act-val',
    align: 'right',
    sortable: false,
    format: (val) => (val == 0) ? '' : formatThousands(val),
  },
  {
    label: getLabels('content', 'titleCase'),
    field: 'cont1',
    name: 'cont1',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('d_unit', 'titleCase'),
    field: 'd-unit',
    name: 'd-unit',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('content', 'titleCase'),
    field: 'cont2',
    name: 'cont2',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('last_purchase_price', 'titleCase'),
    field: 'last-price',
    name: 'last-price',
    align: 'right',
    sortable: false,
    format: (val) => (val == 0) ? '' : formatThousands(val),
  },
  {
    label: getLabels('actual_purchase_price', 'titleCase'),
    field: 'act-price',
    name: 'act-price',
    align: 'right',
    sortable: false,
    format: (val) => (val == 0) ? '' : formatThousands(val),
  },
  {
    label: getLabels('average_price', 'titleCase'),
    field: 'avrg-price',
    name: 'avrg-price',
    align: 'right',
    sortable: false,
    format: (val) => (val == 0) ? '' : formatThousands(val),
  },
];
