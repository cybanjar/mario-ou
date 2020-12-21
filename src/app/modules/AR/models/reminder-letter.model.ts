export interface ReminderLetterList {
  description: string;
  bill_date: string;
  bill_number: number;
  bill_receiver: string;
  ar_amount: number;
  payment_amount: number;
  outstanding: number;
  days: number;
  last_print: string;
  level: number;
}

export interface ResReminderLetterList {
  STR: string; // "MTP-FB-Redemptio28/08/19    12321A Mamonto, Yusfandy          65,000.00          0.00     65,000.00 314         0NA NA                                             "
  'debt-day': number;
  debtrecid: number;
}

export interface ReqReminderLetterList {
  fromArt: number;
  toArt: number;
}
