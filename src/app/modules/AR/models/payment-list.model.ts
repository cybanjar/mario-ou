import { type } from "os";

export type PaymentList = {
  articleNumber?: number;
  billDate?: Date;
  billNumber?: string;
  billReceiver?: string;
  arAmount?: string | number;
  paymentAmount?: number;
  payForeignAmount?: number;
  currency?: string;
  paymentArticle?: string;
  paymentDate: Date;
  id?: string;
  paymentRemark?: string;
  totalPayment?: number;
  invoiceNo?: string;
};

export type TablePaymentList = { key: number } & PaymentList;
