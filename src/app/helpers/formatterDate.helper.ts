import { date } from 'quasar';

export const dateFormatBL = 'YYYY-MM-DD';
export const dateFormat = 'DD/MM/YYYYYY';
export const dateFormatDebt = 'DD/MM/YYYY';
export const dateFormatOB = 'MM/DD/YY';

export function formatterDate(dateInput, isFormatBL = true) {
  return date.formatDate(dateInput, isFormatBL ? dateFormatBL : dateFormat);
}

export function formatToDate(sDate: string, format: string): Date {
  return date.extractDate(sDate, format);
}

export function toDate(sDate: string, isFormatBL = true) {
  return date.extractDate(sDate, isFormatBL ? dateFormatBL : dateFormat);
}

/**
 * Convert from server Date format into table
 * display format from dateFormatBL into dateFormat
 * @see dateFormat 'DD/MM/YYYYYY'
 * @see dateFormatBL 'YYYY-MM-DD'
 * @param sDate
 */
export function formatFromBL(sDate: string | Date) {
  if (sDate instanceof Date) {
    return formatterDate(sDate, false);
  }
  return formatterDate(toDate(sDate, true), false);
}

export function formatToOB(sDate: Date) {
  return date.formatDate(sDate, dateFormatOB);
}

/**
 * Convert from local Date format into server
 * display format from dateFormatBL into dateFormat
 * @see dateFormatBL 'YYYY-MM-DD'
 * @see dateFormat 'YY/MM/DD'
 * @param sDate
 */
export function formatToBL(sDate: string | Date) {
  if (sDate instanceof Date) {
    return date.formatDate(sDate, dateFormatDebt);
  }
  return date.formatDate(toDate(sDate, true), dateFormatDebt);
}
