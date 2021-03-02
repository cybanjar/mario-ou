export interface ReminderLetterList {
  description: string;
  bill_date: string;
  bill_number: string;
  bill_receiver: string;
  ar_amount: string;
  payment_amount: string;
  outstanding: string;
  days: string;
  last_print: string;
  level: string;
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
