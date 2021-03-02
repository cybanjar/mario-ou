import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { GuestProfile } from '../../models/guest-profile/guestProfile.model';

export const tableHeadersIndividual: TableHeader<GuestProfile>[] = [
  {
    label: ' ',
    name: 'contract-rate',
    // TODO: Field unavailable on issue ticket
  },
  {
    label: 'Guest Name',
    field: 'gname',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Country',
    field: 'land',
    name: 'land',
    align: 'left',
  },
  {
    label: 'Address',
    field: 'adresse',
    name: 'adresse',
    align: 'left',
  },
  {
    label: 'City',
    field: 'wohnort',
    name: 'wohnort',
    align: 'left',
  },
  {
    label: 'Phone',
    field: 'telefon',
    name: 'telefon',
    align: 'left',
  },
  {
    label: 'Postal Code',
    field: 'plz',
    name: 'plz',
    align: 'left',
  },
  {
    label: 'Gender',
    field: 'geschlecht',
    name: 'geschlecht',
    align: 'left',
  },
  {
    label: 'ID Card Number',
    field: 'ausweis-nr1',
    name: 'ausweis-nr1',
    align: 'left',
  },
  {
    label: 'Guest Number',
    field: 'gastnr',
    name: 'gastnr',
  },
  { name: 'actions' },
];

export const tableHeadersCompany: TableHeader<GuestProfile>[] = [
  {
    label: ' ',
    name: 'contract-rate',
    // TODO: Field unavailable on issue ticket
  },
  {
    label: 'Company Number',
    field: 'gastnr',
    name: 'company-number',
  },
  {
    label: 'Reference Number',
    field: 'steuernr',
    name: 'steuernr',
    align: 'left',
  },
  {
    label: 'Company Name',
    field: 'gname',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Discount %',
    // TODO: Field unavailable on issue ticket
  },
  {
    label: 'Contact Name',
    field: 'namekontakt',
    name: 'namekontakt',
    align: 'left',
  },
  {
    label: 'Country',
    field: 'land',
    name: 'land',
    align: 'left',
  },
  {
    label: 'Address',
    field: 'adresse',
    name: 'adresse',
    align: 'left',
  },
  {
    label: 'City',
    field: 'wohnort',
    name: 'wohnort',
    align: 'left',
  },
  {
    label: 'Phone',
    field: 'telefon',
    name: 'telefon',
    align: 'left',
  },
  {
    label: 'Postal Code',
    field: 'plz',
    name: 'plz',
    align: 'left',
  },
  {
    label: 'Sales ID',
    field: 'phonetik3',
    name: 'phonetik3',
    align: 'left',
  },
  {
    label: 'Payment Method',
    field: 'paymentMethod',
    name: 'payment-method',
    align: 'left',
  },
  {
    label: 'Expired Date',
    field: 'endperiode',
    name: 'endperiode',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Guest Number',
    field: 'gastnr',
    name: 'gastnr',
  },
  { name: 'actions' },
];

export const tableHeadersAgent: TableHeader<GuestProfile>[] = [
  {
    label: ' ',
    name: 'contract-rate',
    // TODO: Field unavailable on issue ticket
  },
  {
    label: 'Agent Number',
    field: 'gastnr',
    name: 'company-number',
  },
  {
    label: 'Reference Number',
    field: 'steuernr',
    name: 'steuernr',
    align: 'left',
  },
  {
    label: 'Agent Name',
    field: 'gname',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Discount %',
    // TODO: Field unavailable on issue ticket
  },
  {
    label: 'Contact Name',
    field: 'namekontakt',
    name: 'namekontakt',
    align: 'left',
  },
  {
    label: 'Country',
    field: 'land',
    name: 'land',
    align: 'left',
  },
  {
    label: 'Address',
    field: 'adresse',
    name: 'adresse',
    align: 'left',
  },
  {
    label: 'City',
    field: 'wohnort',
    name: 'wohnort',
    align: 'left',
  },
  {
    label: 'Phone',
    field: 'telefon',
    name: 'telefon',
    align: 'left',
  },
  {
    label: 'Postal Code',
    field: 'plz',
    name: 'plz',
    align: 'left',
  },
  {
    label: 'Sales ID',
    field: 'phonetik3',
    name: 'phonetik3',
    align: 'left',
  },
  {
    label: 'Payment Method',
    field: 'paymentMethod',
    name: 'payment-method',
    align: 'left',
  },
  {
    label: 'Expired Date',
    field: 'endperiode',
    name: 'endperiode',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Guest Number',
    field: 'gastnr',
    name: 'gastnr',
  },
  { name: 'actions' },
];
