import { TableHeader } from '~/components/VhpUI/typings';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Account Number',
    field: 'fibukonto',
    name: 'fibukonto',
    align: 'left',
    sortable: true,
    format: (val) => val.replace(/(\d{2})(\d{2})(\d{4})/, '$1-$2-$3'),
  },
  {
    label: 'Account Name',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: true,
  },
  {
    label: 'January',
    sortable: true,
    field: (row) => row.months.jan,
    name: 'jan',
    format: (val) => formatThousands(val),
  },
  {
    label: 'February',
    sortable: true,
    field: (row) => row.months.feb,
    name: 'feb',
    format: (val) => formatThousands(val),
  },
  {
    label: 'March',
    sortable: true,
    field: (row) => row.months.mar,
    name: 'mar',
    format: (val) => formatThousands(val),
  },
  {
    label: 'April',
    sortable: true,
    field: (row) => row.months.apr,
    name: 'apr',
    format: (val) => formatThousands(val),
  },
  {
    label: 'May',
    sortable: true,
    field: (row) => row.months.may,
    name: 'may',
    format: (val) => formatThousands(val),
  },
  {
    label: 'June',
    sortable: true,
    field: (row) => row.months.jun,
    name: 'jun',
    format: (val) => formatThousands(val),
  },
  {
    label: 'July',
    sortable: true,
    field: (row) => row.months.jul,
    name: 'jul',
    format: (val) => formatThousands(val),
  },
  {
    label: 'August',
    sortable: true,
    field: (row) => row.months.aug,
    name: 'aug',
    format: (val) => formatThousands(val),
  },
  {
    label: 'September',
    sortable: true,
    field: (row) => row.months.sep,
    name: 'sep',
    format: (val) => formatThousands(val),
  },
  {
    label: 'October',
    sortable: true,
    field: (row) => row.months.oct,
    name: 'oct',
    format: (val) => formatThousands(val),
  },
  {
    label: 'November',
    sortable: true,
    field: (row) => row.months.nov,
    name: 'nov',
    format: (val) => formatThousands(val),
  },
  {
    label: 'December',
    sortable: true,
    field: (row) => row.months.dec,
    name: 'dec',
    format: (val) => formatThousands(val),
  },
  { name: 'actions', field: 'actions' },
];

export const mapMonthsFromString = (months) => {
  return {
    jan: months[0],
    feb: months[1],
    mar: months[2],
    apr: months[3],
    may: months[4],
    jun: months[5],
    jul: months[6],
    aug: months[7],
    sep: months[8],
    oct: months[9],
    nov: months[10],
    dec: months[11],
  };
};
