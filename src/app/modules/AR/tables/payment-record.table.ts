import { TableHeader } from '~/components/VhpUI/typings';
// artnr: 3000
// bezeich: "A/R CLEARANCE"
// proz: 2
// betrag: -750
// f-amt: 0
// currency: 0
// curr-str: "Rp"
// bemerk: ""
// remain-amt: -750
// fremain-amt: 0
export const paymentRecordListColumns: TableHeader[] = [
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'artnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: true,
  },
  {
    label: 'In %',
    field: 'proz',
    name: 'proz',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Payment Amount',
    field: 'betrag',
    name: 'betrag',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Remark',
    field: 'bemerk',
    name: 'bemerk',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Foregin Amount',
    field: 'f-amt',
    name: 'f-amt',
    align: 'left',
    sortable: true,
  },
];
