import { date } from 'quasar';

export type Reform<T = any, S = any> = (arrDatas: T[]) => S & { key: number }[];

export const reformHKMainTable: Reform<any, any> = (arrDatas) => {
  const arrData = arrDatas.map((data, index) => ({
    key: index,
    room: data.zinr ? data.zinr : '',
    phone: data.PhoneNo ? data.PhoneNo : '',
    remark: data.bemerk ? data.bemerk : '',
    type: data.betriebsnr,
    desc: data.bezeich ? data.bezeich : '',
    claim: data.claimBy ? data.claimBy : '',
    date: data.date1 ? date.extractDate(data.date1, 'YYYY-MM-DD') : undefined,
    exp: data.expired
      ? date.extractDate(data.expired, 'YYYY-MM-DD')
      : undefined,
    found: data.foundby ? data.foundby : '',
    location: data.location ? data.location : 'Unknown',
    ref: data.refNo ? data.refNo : '',
    report: data.reportBy ? data.reportBy : '',
    submitted: data.submitted ? data.submitted : '',
    userinit: data.userinit ? data.userinit : '',
    time: data.zeit ? data.zeit : '',
    claim_date: data['claim-date']
      ? date.extractDate(data['claim-date'], 'YYYY-MM-DD')
      : '',
    report_date: data['report-date']
      ? date.extractDate(data['report-date'], 'YYYY-MM-DD')
      : '',
    recid: data['s-recid'] ? data['s-recid'] : '',
  }));
  return arrData;
};
