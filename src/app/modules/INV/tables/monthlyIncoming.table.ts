import { TableHeader } from '~/components/VhpUI/typings';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { getLabels } from '~/app/helpers/getLabels.helpers';

const replaceTotal = (string: string) => {
  if (string === 'TOTAL') return 'Subtotal'
  else if (string === 'GRAND TOTAL') return 'Total'
  else return string;
};

export const tableHeaders: TableHeader[] = [
  {
    label: getLabels('storage_name', 'titleCase'),
    field: 'f-bezeich',
    name: 'f-bezeich',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('article_number', 'titleCase'),
    field: 'artnr',
    name: 'artnr',
    align: 'left',
    sortable: false,
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
    field: 'einheit',
    name: 'einheit',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('quantity', 'titleCase'),
    field: 'qty',
    name: 'qty',
    align: 'right',
    sortable: false,
    format: (val) => formatThousands(val),
  },
  {
    label: getLabels('amount', 'titleCase'),
    field: 'val',
    name: 'val',
    align: 'right',
    sortable: false,
    format: (val) => formatThousands(val),
  },
  {
    label: getLabels('month_to_date_quantity', 'titleCase'),
    field: 't-qty',
    name: 't-qty',
    align: 'right',
    sortable: false,
    format: (val) => formatThousands(val),
  },
  {
    label: getLabels('month_to_date', 'titleCase'),
    field: 't-val',
    name: 't-val',
    align: 'right',
    sortable: false,
    format: (val) => formatThousands(val),
  },
];
