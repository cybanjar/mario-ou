import { DoRequest } from '../config/repository';
import {
  ReqArtikelList,
  ResArtikelList,
  ResArtikelBaseList,
  ReqPaymentDebtPayList,
  ResPaymentDebtPayList,
  ReqSettlePaymentDebt,
  ResSettlePaymentDebt,
} from '~/app/modules/AR/models/payment.model';
import {
  ReqDebitor,
  ResDebitor,
  ReqWriteDebitor,
  ResWriteDebitor,
  ResDispDebitor,
} from '~/app/modules/AR/models/debitor.model';
import {
  ResSoaListPrepare,
  ReqSoaList,
  ResSoaList,
} from '~/app/modules/AR/models/soa-list.model';
import {
  ResReminderLetterList,
  ReqReminderLetterList,
} from '~/app/modules/AR/models/reminder-letter.model';
import { BodyGetPrepareSelectGLAcct } from '../models/body/accountReceivable.body';

const AR_URL = 'vhpAR';

export interface AccountReceivableEndpoints {
  getPrepareSelectGLAcct: (body?: BodyGetPrepareSelectGLAcct) => any;
  getReadDebitor: (body?: ReqDebitor) => Promise<ResDebitor>;
  getARClosePayDate: () => Promise<any>;
  manualARWriteDebt: (body?: ReqWriteDebitor) => Promise<ResWriteDebitor>;
  getAllGuestList: (body) => Promise<ResDispDebitor[]>;
  getReadArticleList: (body?: ReqArtikelList) => Promise<ResArtikelList[]>;
  getReadArticleCoreList: (
    body?: ReqArtikelList
  ) => Promise<ResArtikelBaseList[]>;
  getPaymentDebtPayList: (
    body?: ReqPaymentDebtPayList
  ) => Promise<ResPaymentDebtPayList[]>;
  prepareSoaList: () => Promise<ResSoaListPrepare>;
  getSoaList: (body?: ReqSoaList) => Promise<ResSoaList[]>;
  arPaymentSettlePaymentDebtPay: (body?: any) => Promise<any>;
  getSettlePaymentDebtPay: (
    body?: ReqSettlePaymentDebt
  ) => Promise<ResSettlePaymentDebt>;
  getRemainList: (
    body: ReqReminderLetterList
  ) => Promise<ResReminderLetterList[]>;
  saveAR: (body?: any) => Promise<any[]>;
  saveARJournal: (body?: any) => Promise<any[]>;
  loadGuests: (body?: any) => Promise<any[]>;
  manualARAdd: (body?: any) => Promise<any[]>;
  getPrepareARDebtlist: () => Promise<any>;
  getLoadArticle: (body: any) => Promise<any>;
  getDebitList: (body: any) => Promise<any>;
  manualARDelete: (body: any) => Promise<any>;
  writeDebitor: (body: any) => Promise<any>;
  getPrepareARSubledger: (body: any) => Promise<any>;
  arSubledgerCreateAgeList: (body: any) => Promise<any>;
  transferGLLoadData: (body: any) => Promise<any>;
  transferGLUpdate: (body: any) => Promise<any>;
  // Aging Balance
  getPrepareARAging: (body: any) => Promise<any>;
  getARAge1: (body: any) => Promise<any>;
  getPrepareARAge1: (body: any) => Promise<any>;
  getReadBill: (body: any) => Promise<any>;
  getBillDetail: (body: any) => Promise<any>;
}

interface AccountReceivableBodyRequest {
  getPrepareSelectGLAcct: BodyGetPrepareSelectGLAcct;
}

const defaultBodies: AccountReceivableBodyRequest = {
  getPrepareSelectGLAcct: {
    currDept: 0,
    fromFibu: '',
  },
};

export default (doFetch: DoRequest): AccountReceivableEndpoints => ({
  arPaymentSettlePaymentDebtPay: (body) =>
    doFetch({ url: `${AR_URL}/arPaymentSettlePaymentDebtPay`, body }).then(
      ([, res]) => res
    ),
  prepareSoaList: () =>
    doFetch({ url: `${AR_URL}/soaPreparePrint` }).then(([, res]) => res),
  getSoaList: (body) =>
    doFetch({ url: `${AR_URL}/soaPreparePrint1`, body }).then(
      ([, res]) => res?.soaList?.['soa-list']
    ),
  getPrepareSelectGLAcct: (body = defaultBodies.getPrepareSelectGLAcct) =>
    doFetch({ url: `${AR_URL}/getPrepareSelectGLAcct`, body }).then(
      ([, res]) => res?.glacctList?.['glacct-list']
    ),
  getReadDebitor: (body) =>
    doFetch({ url: `${AR_URL}/getReadDebitor`, body }).then(
      ([, res]) => res?.tDebitor?.['t-debitor'][0]
    ),
  manualARWriteDebt: (body) =>
    doFetch({ url: `${AR_URL}/manualARWriteDebt`, body }).then(([, res]) => ({
      outputOkFlag: res?.outputOkFlag === 'true',
      successFlag: res?.successFlag === 'true',
    })),
  getARClosePayDate: () =>
    doFetch({ url: `${AR_URL}/getARClosePayDate` }).then(([, res]) => res),
  getReadArticleList: (body) =>
    doFetch({ url: `${AR_URL}/getReadArticle1`, body }).then(
      ([, res]) => res?.tArtikel?.['t-artikel']
    ),
  getPaymentDebtPayList: (
    body = {
      artnr: 1,
      userinit: ' ',
      billNr: ' ',
      tempArt2: 1,
      billDate: '01/14/2019',
      billName: ' ',
      toName: '',
      billSaldo: '',
      artSelected: 1,
      foutstand: 0,
      outstand: '',
    }
  ) =>
    doFetch({ url: `${AR_URL}/arPaymentDebtPay`, body }).then(
      ([, res]) => res?.ageList?.['age-list']
    ),
  getAllGuestList: (body) =>
    doFetch({ url: `${AR_URL}/soaDispDebitor`, body }).then(
      ([, res]) => res?.dlist?.dlist
    ),
  getSettlePaymentDebtPay: (body) =>
    doFetch({ url: `${AR_URL}/arPaymentSettlePaymentDebtPay`, body }).then(
      ([, res]) => res
    ),
  getReadArticleCoreList: (body) =>
    doFetch({ url: 'Common/getArtikel', body }).then(
      ([, res]) => res?.artikelList?.['artikel-list']
    ),
  getRemainList: (body) =>
    doFetch({ url: `${AR_URL}/getARRemainList`, body }).then(
      ([, res]) => res?.outputList?.['output-list']
    ),
  saveAR: (body) =>
    doFetch({ url: `${AR_URL}/manualARWriteDebt`, body }).then(
      ([, res]) => res?.successFlag
    ),
  saveARJournal: (body) =>
    doFetch({ url: `${AR_URL}/getReadArticle1`, body }).then(([, res]) => res),
  loadGuests: (body) =>
    doFetch({ url: `${AR_URL}/getSelectGuestList`, body }).then(
      ([, res]) => res?.tGuest?.['t-guest']
    ),
  manualARAdd: (body) =>
    doFetch({ url: `${AR_URL}/manualARAdd`, body }).then(([, res]) => res),
  getPrepareARDebtlist: () =>
    doFetch({ url: `${AR_URL}/getPrepareARDebtlist` }).then(([, res]) => res),
  getLoadArticle: (body) =>
    doFetch({ url: `${AR_URL}/getLoadArticle`, body }).then(
      ([, res]) => res?.tArtikel?.['t-artikel']
    ),
  getDebitList: (body) =>
    doFetch({ url: `${AR_URL}/getDebitList`, body }).then(
      ([, res]) => res?.outputList?.['output-list']
    ),
  manualARDelete: (body) =>
    doFetch({ url: `${AR_URL}/manualARDelete`, body }).then(([, res]) => res),
  writeDebitor: (body) =>
    doFetch({ url: `${AR_URL}/writeDebitor`, body }).then(([, res]) => res),
  getPrepareARSubledger: (body) =>
    doFetch({ url: `${AR_URL}/getPrepareARSubledger`, body }).then(
      ([, res]) => res?.tArtikel?.['t-artikel']
    ),
  arSubledgerCreateAgeList: (body) =>
    doFetch({ url: `${AR_URL}/arSubledgerCreateAgeList`, body }).then(
      ([, res]) => res
    ),
  transferGLLoadData: (body) =>
    doFetch({ url: `${AR_URL}/transferGLLoadData`, body }).then(
      ([, res]) => res
    ),
  transferGLUpdate: (body) =>
    doFetch({ url: `${AR_URL}/transferGLUpdate`, body }).then(([, res]) => res),
  getARAge1: (body) =>
    doFetch({ url: `${AR_URL}/getARAge1`, body }).then(
      ([, res]) => res?.arageList?.['arage-list']
    ),
  getPrepareARAge1: (body) =>
    doFetch({ url: `${AR_URL}/getPrepareARAge1`, body }).then(([, res]) => res),
  getReadBill: (body) =>
    doFetch({ url: `${AR_URL}/getReadBill`, body }).then(
      ([, res]) => res?.tBill?.['t-bill']
    ),
  getBillDetail: (body) =>
    doFetch({ url: `${AR_URL}/getBillDetail`, body }).then(
      ([, res]) => res?.bDetail?.['b-detail']
    ),
  getPrepareARAging: (body) =>
    doFetch({ url: `${AR_URL}/getPrepareARAging`, body }).then(
      ([, res]) => res
    ),
});
