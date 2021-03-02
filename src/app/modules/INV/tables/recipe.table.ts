import { TableHeader } from '~/components/VhpUI/typings';
import { getLabels } from '~/app/helpers/getLabels.helpers';

export const tableHeaders: TableHeader[] = [
  {
    label: getLabels('recipe_number', 'titleCase'),
    field: 'artnrrezept',
    name: 'artnrrezept',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('recipe_name', 'titleCase'),
    field: 'bezeich1',
    name: 'bezeich1',
    align: 'left',
    sortable: false,
},
{
    label: getLabels('category', 'titleCase'),
    field: 'kategorie',
    name: 'kategorie',
    align: 'left',
    sortable: false,
},
{
    label: getLabels('portion', 'titleCase'),
    field: 'portion',
    name: 'portion',
    align: 'left',
    sortable: false,
},
{
    label: getLabels('cat_name', 'titleCase'),
    field: 'bezeich2',
    align: 'left',
    name: 'bezeich2',
    sortable: false,
},
{
    label: getLabels('created', 'titleCase'),
    field: 'datumanlage',
    align: 'left',
    name: 'datumanlage',
    sortable: false,
},
{
    label: getLabels('last_changed', 'titleCase'),
    field: 'datummod',
    align: 'left',
    name: 'datummod',
    sortable: false,
},
{
    label: getLabels('recipe_cost', 'titleCase'),
    field: 'cost',
    align: 'left',
    name: 'cost',
    sortable: false,
},
{
    label: getLabels('cost_portion', 'titleCase'),
    field: 'CostPortion',
    name: 'CostPortion',
    align: 'left',
    sortable: false,
  },
  { name: 'actions', field: 'actions' },
];

export const tableDialogRecipe: TableHeader[] = [
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
  },
  {
    label: getLabels('recipe_unit', 'titleCase'),
    field: 's-unit',
    name: 's-unit',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('nett_qty', 'titleCase'),
    field: 'menge',
    name: 'menge',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('cost', 'titleCase'),
    field: 'cost',
    name: 'cost',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('unit', 'titleCase'),
    field: 'masseinheit',
    name: 'masseinheit',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('content', 'titleCase'),
    field: 'inhalt',
    name: 'inhalt',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('average_price', 'titleCase'),
    field: 'vk-preis',
    name: 'vk-preis',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('loss_factor', 'titleCase'),
    field: 'lostfact',
    name: 'lostfact',
    align: 'left',
    sortable: false,
  },
  { name: 'actions', field: 'actions' },
];

export const stockArticle: TableHeader[] = [
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
  },
  {
    label: getLabels('unit', 'titleCase'),
    field: 'masseinheit',
    name: 'masseinheit',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('content', 'titleCase'),
    field: 'inhalt',
    name: 'inhalt',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('recipe_unit', 'titleCase'),
    field: 'herkunft',
    name: 'herkunft',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('average_price', 'titleCase'),
    field: 'vk-preis',
    name: 'vk-preis',
    align: 'left',
    sortable: false,
  },
];

export const Recipe: TableHeader[] = [
  {
    label: getLabels('recipe_number', 'titleCase'),
    field: 'artnrrezept',
    name: 'artnrrezept',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('recipe_name', 'titleCase'),
    field: 'bezeich1',
    name: 'bezeich1',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('portion', 'titleCase'),
    field: 'portion',
    name: 'portion',
    align: 'left',
    sortable: false,
  },
  {
    label: getLabels('category', 'titleCase'),
    field: 'bezeich2',
    name: 'bezeich2',
    align: 'left',
    sortable: false,
  },
];
const width1 = '130px'
const width2 = '190px'
const right = '10px'
export const useInputModal = [
  {
      label: getLabels('cat_num', 'titleCase'),
      value: null,
      width: width1,
      marginRight: right,
      disable: false
    },
    {
      label: getLabels('cat_name', 'titleCase'),
      value: null,
      width: width2,
      disable: false
    },
    {
      label: getLabels('recipe_number', 'titleCase'),
      value: '',
      width: width1,
      marginRight: right,
      disable: true
    },
    {
      label: getLabels('recipe_name', 'titleCase'),
      value: '',
      width: width2,
      disable: false
    },
    {
      label: getLabels('portion', 'titleCase'),
      value: '1',
      width: width1,
      marginRight: '200px',
      disable: false
    },
    {
      label: getLabels('content', 'titleCase'),
      value: '',
      width: '90px',
      marginRight: right,
      disable: true
    },
    {
      label: getLabels('qty', 'titleCase'),
      value: '',
      width: '90px',
      disable: true,
      onClick: 'quantity'
    },
    {
      label: getLabels('loss_factor', 'titleCase'),
      value: '',
      width: width1,
      marginRight: right,
      disable: true
    },
    {
      label: getLabels('recipe_cost', 'titleCase'),
      value: '',
      width: width2,
      disable: true
    },
    {
      label: getLabels('article_number', 'titleCase'),
      value: '',
      width: width1,
      marginRight: right,
      disable: true
  },
]


