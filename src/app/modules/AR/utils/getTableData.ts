import {
  ReminderLetterList,
  ResReminderLetterList,
} from '../models/reminder-letter.model';
import { ResArtikelBaseList } from '../models/payment.model';

export function reformArticle(tempData: ResArtikelBaseList[]) {
  return tempData.map((data) => ({
    value: data.artnr,
    label: `${data.artnr} - ${data.bezeich}`,
  }));
}

export function getTableData(
  tempData: ResReminderLetterList[]
): ReminderLetterList[] {
  const data = tempData.map<ReminderLetterList>((data, index) => ({
    key: index,
    description: data.STR.substring(0, 15),
    bill_date: data.STR.substring(16, 24),
    bill_number: parseInt(data.STR.substring(28, 33).trim()),
    bill_receiver: data.STR.substring(33, 59),
    ar_amount: parseFloat(data.STR.substring(59, 81).trim()),
    payment_amount: parseFloat(data.STR.substring(81, 86).trim()),
    outstanding: parseFloat(data.STR.substring(86, 99).trim()),
    days: parseInt(data.STR.substring(99, 109).trim()),
    last_print: ' ',
    level: parseInt(data.STR.substring(111, 113).trim()),
  }));
  return data;
}
