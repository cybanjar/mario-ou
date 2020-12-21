import { DoRequest } from '../config/repository';
import {
  ReqPurchaseOrderList,
  ReqPurchaseOrderDetail,
  ResPurchaseOrderDetail,
  ResPurchaseOrderList,
  ReqPreparePurchaseOrderList,
  ResPreparePurchaseOrderList,
} from '~/app/modules/AP/models/purchase-order.model';
import {
  ResSegment,
  ResCountry,
  ResSupplierList,
  ResSupplierTurnover,
} from '~/app/modules/AP/models/supplier-profile.model';
import {
  ReqAPList,
  ResAPList,
  ReqStockItemList,
  ResStockItemList,
  ReqDisplayPayment,
  ResDisplayPayment,
} from '~/app/modules/AP/models/outstanding-and-balance.model';
import {
  ReqPaymentList,
  ResPaymentList,
  ReqPaymentArticle,
  ResPaymentArticle,
} from '~/app/modules/AP/models/payment.model';

const AP_URL = 'vhpAP';

export interface AccountsPayableEndpoints {
  getSupplierList: () => Promise<ResSupplierList[]>;
  getSupplierTurnover: (body: {
    liefNr: number;
  }) => Promise<ResSupplierTurnover[]>;

  getCountry: () => Promise<ResCountry[]>;
  getSegment: () => Promise<ResSegment[]>;

  getPreparePurchaseOrderList: (
    body?: ReqPreparePurchaseOrderList
  ) => Promise<ResPreparePurchaseOrderList>;

  getPurchaseOrderList: (
    body: ReqPurchaseOrderList
  ) => Promise<ResPurchaseOrderList[]>;

  getPurchaseOrderDetail: (
    body: ReqPurchaseOrderDetail
  ) => Promise<ResPurchaseOrderDetail[]>;

  getAPList: (body: ReqAPList) => Promise<ResAPList[]>;
  getStockItemList: (body: ReqStockItemList) => Promise<ResStockItemList[]>;
  getDisplayPayment: (body: ReqDisplayPayment) => Promise<ResDisplayPayment[]>;

  getPaymentList: (body: ReqPaymentList) => Promise<ResPaymentList[]>;
  getPaymentArticle: (body: ReqPaymentArticle) => Promise<ResPaymentArticle[]>;
}

const defaultBodies = {
  preparePurchaseOrderList: {
    casetype: 1,
    pvILanguage: '1',
    currDate: '2019-01-14',
    progName: 'hk-roomlist',
  },
};

export default (doFetch: DoRequest): AccountsPayableEndpoints => ({
  getSupplierList: () =>
    doFetch({ url: `${AP_URL}/getSupplierList` }).then(
      ([, res]) => res?.supplyList?.['supply-list']
    ),

  getSupplierTurnover: (body) =>
    doFetch({ url: `${AP_URL}/getPrepareSupplyUmsatz`, body }).then(
      ([, res]) => res?.umsatzList?.['umsatz-list']
    ),

  getCountry: () =>
    doFetch({ url: 'Common/getGCFNation', body: { inpNatcode: 0 } }).then(
      ([, res]) => res?.nationList?.['nation-list']
    ),

  getSegment: () =>
    doFetch({ url: 'Common/getLSegment' }).then(
      ([, res]) => res?.tLSegment?.['t-l-segment']
    ),

  getPreparePurchaseOrderList: (
    body = defaultBodies.preparePurchaseOrderList
  ) =>
    doFetch({
      url: `${AP_URL}/getPreparePurchaseOrderList`,
      body,
    }).then(([, res]) => ({
      users: res?.tBediener?.['t-bediener'],
      department: res?.costList?.['cost-list'],
      billDate: res?.billdate,
    })),

  getPurchaseOrderList: (body) =>
    doFetch({ url: `${AP_URL}/getPurchaseOrderList`, body }).then(
      ([, res]) => res?.q2List?.['q2-list']
    ),

  getPurchaseOrderDetail: (body) =>
    doFetch({ url: `${AP_URL}/viewPODetail`, body }).then(
      ([, res]) => res?.sitemList?.['sitem-list']
    ),

  getAPList: (body) =>
    doFetch({ url: `${AP_URL}/getAPList1`, body }).then(
      ([, res]) => res?.outputList?.['output-list']
    ),

  getStockItemList: (body) =>
    doFetch({ url: `${AP_URL}/getAPListAddItemList`, body }).then(
      ([, res]) => res?.ttStock?.ttStock
    ),

  getDisplayPayment: (body) =>
    doFetch({ url: `${AP_URL}/prepareDispAPPayment`, body }).then(
      ([, res]) => res?.q1List?.['q1-list']
    ),

  getPaymentList: (body) =>
    doFetch({ url: `${AP_URL}/apPaymentGetAPList`, body }).then(
      ([, res]) => res?.ageList?.['age-list']
    ),

  getPaymentArticle: (body) =>
    doFetch({ url: `${AP_URL}/apPaymentPrepareSettle`, body }).then(
      ([, res]) => res?.artikelList?.['artikel-list']
    ),
});
