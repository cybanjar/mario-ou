import { TableHeader } from '~/components/VhpUI/typings';
import { getLabels } from '~/app/helpers/getLabels.helpers';

export const tableHeaders: TableHeader[] = [
  {
    label: getLabels('article_number', 'titleCase'),
    field: 'artnr',
    name: 'artnr',
    align: 'left',
    sortable: true,
  },
  {
    label: getLabels('description', 'titleCase'),
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,

  },
  {
    label: getLabels('minimum_onhand', 'titleCase'),
    field: 'min-oh',
    name: 'min-oh',
    sortable: true,

  },
  {
    label: getLabels('current_on_hand', 'titleCase'),
    field: 'curr-oh',
    name: 'curr-oh',
    align: 'right',
    sortable: true,

  },
  {
    label: getLabels('average_price', 'titleCase'),
    field: 'avrgprice',
    name: 'avrgprice',
    align: 'right',
    sortable: true,

  },
  {
    label: getLabels('actual_price', 'titleCase'),
    field: 'ek-aktuell',
    name: 'ek-aktuell',
    align: 'right',
    sortable: true,

  },
  {
    label: getLabels('last_purchase', 'titleCase'),
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: true,

  },
];