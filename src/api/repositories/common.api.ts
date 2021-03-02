import { DoRequest } from '../config/repository';
import { ResPrepareJurnal } from '~/app/modules/AR/models/journal.model';
import { store } from '~/store';
import {
  BodyGetGLJoulist_1,
  BodyGetHTParam0,
} from '../models/body/common.body';

const COMMON_URL = 'Common';

export interface CommonEndpoints {
  getJournalist: () => Promise<ResPrepareJurnal>;
  getGLJoulistData: (body?: any) => Promise<any>;
  getGLViewTransaction: (body?: any) => Promise<any>;
  checkPermission: (body?: any) => Promise<any>;
  readGLJouhdr: (body?: any) => Promise<any>;
  prepareChgGLJournal: (jnr: number) => Promise<any>;
  selectAccount: (body?: any) => Promise<any>;
  saveLedgerTrans: (body?: any) => Promise<any>;
  chgGLJournBtnDel: (
    recidJouhdr: string,
    recidJournal: string,
    closeDate: string
  ) => Promise<any>;
  getArtikel: (caseType: number, deptNo: number) => Promise<any>;
  getGeneralParam: (
    caseType: string | number,
    inpParam: string | number
  ) => Promise<any>;
  glJourtransOnclick: (body: any) => Promise<any>;
  glJourtransDelJouhdr: (body: any) => Promise<any>;
  glJourtransNewjour: (body: any) => Promise<any>;
  glJourtransPostJournal: (body: any) => Promise<any>;
  glJourtransPostJournalAcct: (body: any) => Promise<any>;
  glJourtransPostJournalBtnGo: (body: any) => Promise<any>;
  chgGLJournalBtnDel: (body: any) => Promise<any>;
  getHTParam0: (body: BodyGetHTParam0) => Promise<any>;
  commonJourList: (body: BodyGetGLJoulist_1) => Promise<any>;
  prepareGLJoulist: () => Promise<any>;
  getGLJoulist_1: () => Promise<any>;
  getGLMainAccount: () => Promise<any>;
  getGLDeptAccount: () => Promise<any>;
  loadHArtikel: (body: any) => Promise<any>;
  // FO Transaction
  readGLAcct: (body: any) => Promise<any>;
  getSupplierList: () => Promise<any>;
  selectSupplier: () => Promise<any>;
  getAllArtikel: () => Promise<any>;
  readCurrency: () => Promise<any>;
}

export function injectPermPar(param) {
  const { user } = store.state.auth;
  const init = user.userInit;
  return {
    ...param,
    userInit: init,
  };
}

export default (doFetch: DoRequest): CommonEndpoints => ({
  getJournalist: () =>
    doFetch({ url: `${COMMON_URL}/prepareGLJoulist` }).then(([, res]) => res),
  getGLJoulistData: (body) =>
    doFetch({ url: `${COMMON_URL}/getGLJoulist_1`, body }).then(
      ([, res]) => res?.outList?.['out-list']
    ),

  getGLViewTransaction: (body) =>
    doFetch({ url: `${COMMON_URL}/getGLViewTransaction`, body }).then(
      ([, res]) => res?.b3List?.['b3-list']
    ),
  checkPermission: (body) =>
    doFetch({
      url: `${COMMON_URL}/checkPermission`,
      body: injectPermPar(body),
    }).then(([, res]) => res),

  readGLJouhdr: (body) =>
    doFetch({
      url: `${COMMON_URL}/readGLJouhdr`,
      body,
    }).then(([, res]) => res?.tGlJouhdr?.['t-gl-jouhdr']),

  prepareChgGLJournal: (jnr) =>
    doFetch({
      url: `${COMMON_URL}/prepareChgGLJournal`,
      body: { jnr },
    }).then(([, res]) => res),
  selectAccount: (
    body = {
      currDept: '0',
    }
  ) =>
    doFetch({
      url: `${COMMON_URL}/selectAccount`,
      body,
    }).then(([, res]) => res),
  saveLedgerTrans: (body?: any) =>
    doFetch({
      url: `${COMMON_URL}/chgGLJournBtnGo`,
      body,
    }).then(([, res]) => res),
  chgGLJournBtnDel: (recidJouhdr, recidJournal, closedate) =>
    doFetch({
      url: `${COMMON_URL}/`,
      body: {
        pvILanguage: '1',
        flagSelect: 'true',
        recidJouhdr,
        recidJournal,
        closedate,
      },
    }).then(([, res]) => res),
  getArtikel: (caseType: number, deptNo: number) =>
    doFetch({
      url: `${COMMON_URL}/getArtikel`,
      body: {
        caseType,
        deptNo,
      },
    }).then(([, res]) => res?.artikelList?.['artikel-list']),
  getGeneralParam: (caseType, inpParam) =>
    doFetch({
      url: `${COMMON_URL}/getHTParam0`,
      body: {
        casetype: caseType,
        inpParam,
      },
    }).then(([, res]) => res),
  commonJourList: (body) =>
    doFetch({
      url: `${COMMON_URL}/commonJourList`,
      body,
    }).then(([, res]) => res),
  glJourtransOnclick: (body) =>
    doFetch({
      url: `${COMMON_URL}/glJourtransOnclick`,
      body,
    }).then(([, res]) => res?.b2List?.['b2-list']),
  glJourtransDelJouhdr: (body) =>
    doFetch({
      url: `${COMMON_URL}/glJourtransDelJouhdr`,
      body,
    }).then(([, res]) => res),
  glJourtransNewjour: (body) =>
    doFetch({
      url: `${COMMON_URL}/glJourtransNewjour`,
      body,
    }).then(([, res]) => res),
  glJourtransPostJournal: (body) =>
    doFetch({
      url: `${COMMON_URL}/glJourtransPostJournal`,
      body,
    }).then(([, res]) => res),
  glJourtransPostJournalAcct: (body) =>
    doFetch({
      url: `${COMMON_URL}/glJourtransPostJournalAcct`,
      body,
    }).then(([, res]) => res),
  glJourtransPostJournalBtnGo: (body) =>
    doFetch({
      url: `${COMMON_URL}/glJourtransPostJournalBtnGo`,
      body,
    }).then(([, res]) => res),
  chgGLJournalBtnDel: (body) =>
    doFetch({
      url: `${COMMON_URL}/chgGLJournalBtnDel`,
      body,
    }).then(([, res]) => res),
  getHTParam0: (body) =>
    doFetch({ url: `${COMMON_URL}/getHTParam0`, body }).then(([, res]) => res),
  prepareGLJoulist: () =>
    doFetch({ url: `${COMMON_URL}/prepareGLJoulist` }).then(([, res]) => res),
  getGLJoulist_1: () =>
    doFetch({ url: `${COMMON_URL}/getGLJoulist_1` }).then(([, res]) => res),
  getGLMainAccount: () =>
    doFetch({
      url: `${COMMON_URL}/getGLMainAccount`,
      body: defaultBodies.getGLMainAccount,
    }).then(([, res]) => res?.tGlMain['t-gl-main']),
  getGLDeptAccount: () =>
    doFetch({
      url: `${COMMON_URL}/getGLDeptAccount`,
    }).then(([, res]) => res?.tGlDepartment['t-gl-department']),
  loadHArtikel: (body) =>
    doFetch({ url: `${COMMON_URL}/loadHArtikel`, body }).then(
      ([, response]) => response?.tHArtikel?.['t-h-artikel']
    ),
  readGLAcct: (body) =>
    doFetch({
      url: `${COMMON_URL}/readGLAcct`,
      body,
    }).then(([, response]) => response?.tGlAcct?.['t-gl-acct']),
  getSupplierList: () =>
    doFetch({
      url: `${COMMON_URL}/getSupplierList`,
    }).then(([, res]) => res?.supplyList['supply-list']),
  selectSupplier: () =>
    doFetch({
      url: `${COMMON_URL}/selectSupplier`,
      body: defaultBodies.selectSupplier,
    }).then(([, res]) => res?.tLLieferant['t-l-lieferant']),
  getAllArtikel: () =>
    doFetch({
      url: `${COMMON_URL}/getAllArtikel`,
      body: defaultBodies.getAllArtikel,
    }).then(([, res]) => res?.tLArtikel['t-l-artikel']),
  readCurrency: () =>
    doFetch({
      url: `${COMMON_URL}/readCurrency`,
      body: {
        caseType: 8,
        currencyNo: 0,
        currBez: '',
      },
    }).then(([, res]) => res?.tWaehrung['t-waehrung']),
});

const defaultBodies = {
  getGLMainAccount: {
    caseType: 4,
    char1: '',
    char2: '',
    int1: 0,
    int2: 0,
  },

  selectSupplier: {
    caseType: '2',
    char1: ' ',
    int1: '?',
  },

  getAllArtikel: {
    sorttype: '2',
    lastArt: '*',
    lastArt1: '?',
  },
};
