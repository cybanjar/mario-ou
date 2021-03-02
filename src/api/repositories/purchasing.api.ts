import { DoRequest } from '../config/repository';

const PU_URL = 'vhpPC';

export interface PurchasingEndpoints {
  quoteListPrepare: (body) => Promise<any>;
  poMkPOPrepare: (body) => Promise<any>;
  poMkPOCheckLiefnr: (body) => Promise<any>;
  poMkPOCreateLArtikel: (body) => Promise<any>;
  poMkPOUpdLArtikel: (body) => Promise<any>;
  poMkPOCreateLOrder: (body) => Promise<any>;
  poMkPOBtnDel: (body) => Promise<any>;
  poMkPOBtnGo1: (body) => Promise<any>;
  poMkPOBtnStop: (body) => Promise<any>;
  quoteListSave: (body) => Promise<any>;
}

export default (doFetch: DoRequest): PurchasingEndpoints => ({
  quoteListPrepare: (body) =>
    doFetch({ url: `${PU_URL}/quoteListPrepare`, body }).then(
      ([, res]) => res?.quoteList['quote-list']
    ),
  poMkPOPrepare: (body) => doFetch({ url: `${PU_URL}/poMkPOPrepare`, body }),
  poMkPOCheckLiefnr: (body) =>
    doFetch({ url: `${PU_URL}/poMkPOCheckLiefnr`, body }),
  poMkPOCreateLArtikel: (body) =>
    doFetch({ url: `${PU_URL}/poMkPOCreateLArtikel`, body }).then(
      ([, res]) => res?.tLArtikel['t-l-artikel']
    ),
  poMkPOUpdLArtikel: (body) =>
    doFetch({ url: `${PU_URL}/poMkPOUpdLArtikel`, body }),
  poMkPOCreateLOrder: (body) =>
    doFetch({ url: `${PU_URL}/poMkPOCreateLOrder`, body }),
  poMkPOBtnDel: (body) => doFetch({ url: `${PU_URL}/poMkPOBtnDel`, body }),
  poMkPOBtnGo1: (body) => doFetch({ url: `${PU_URL}/poMkPOBtnGo1`, body }),
  poMkPOBtnStop: (body) => doFetch({ url: `${PU_URL}/poMkPOBtnStop`, body }),
  quoteListSave: (body) => doFetch({ url: `${PU_URL}/quoteListSave`, body }),
});
