import { DoRequest } from '../config/repository';

const COMMON_URL = 'Common';
const VHP_FOC_URL = 'vhpFOC';

export interface FrontOfficeCashierEndpoints {
  // FO Guest Folio
  foInvoicePrepare: any;
  foInvoiceCheckZahlungsart: any;
  foInvoice1Prepare: any;
  billListFOInvoice: any;
  getHTParam0: any;
  selectBill: any;
  readResLine: any;
  readGuest: any;

  // Report FO Transaction Report
  bookJournArtPrepare: any;
  loadArtikel: any;
  bookJournArtList: any;
  bookJournArtViewMBill: any;
  bookJournArtMBillMember: any;

  // Report Booking Journal By User Report
  bookJournUserPrepare: any;
  selectSystemUser: any;
  loadHotelDepartment: any;
  bookJournUserList: any;

  // Report Payment Journal By User
  paymentJournalUserList: any;
  checkPermission: any;
  paymentJournalCloseShift: any;

  // Report FO Cancellation
  cancelJournPrepare: any;
  cancelJournList: any;

  // Report Outstanding Folio
  billOutstandRmNo: any;

  // Report Today Departed Guest
  todayCOGuestPrepare: any;
  todayCOGuestNoDU: any;
  todayCOGuestDUOnly: any;
  getReadBill: any;
  readBillLine: any;
  getReadArticle: any;
  readHJournal: any;

  // Report Over Credit Limit
  overCreditLimitList: any;

  // Report Departed Unbalance Guest
  checkoutUnbalancedBills: any;

  // Top Menu Card Informaiton
  ccVerification: any;
  ccBtnExit: any;

  // Top Menu Select Department
  foInvoiceChgart: any;

  // Top Menu Master Folio Member
  foInvoiceMView: any;

  // Transfer History
  foTransDetailPrepare: any;

  // Quick Posting To Guest Folio
  quickPostPrepare: any;

  // Auto Transfer
  foInvoiceMiTransfer: any;
  foInvoiceTransferRoom: any;
  foInvoiceCreateLogfile: any;
  foInvoiceFillRescomment: any;
}

const defaultBodies = {
  // FO Guest Folio
  foInvoicePrepare: {
    bilFlag: 0,
  },
  foInvoiceCheckZahlungsart: {
    bilRecid: 26985,
  },
  foInvoice1Prepare: {
    inpRechnr: 0,
  },
  billListFOInvoice: {
    bilFlag: 0,
    bilRecid: 91104,
    room: '',
    vipflag: false,
    fillCo: true,
    doubleCurrency: false,
    foreignRate: false,
  },
  getHTParam0: {
    casetype: 2,
    inpParam: 87,
  },
  selectBill: {
    sorttype: '1',
    zinr: ' ',
    bilInt: '0',
  },
  readResLine: {
    caseType: 1,
    resNo: 0,
    reslinNo: 0,
    resstat: 0,
    actFlag: 0,
    rmNo: ' ',
    arrive: ' ',
    depart: ' ',
    gastNo: 0,
    kontigNo: 0,
    kontcode: ' ',
  },
  readGuest: {
    caseType: 1,
    gastNo: 36613,
    gname: ' ',
    fname: ' ',
  },

  // Report FO Transaction Report
  bookJournArtPrepareBody: {
    fromDept: 0,
    toDept: 0,
  },
  loadArtikelBody: {
    caseType: 8,
    deptNo: 0,
  },
  bookJournArtListBody: {
    fromArt: 0,
    toArt: 0,
    fromDept: 0,
    toDept: 0,
    fromDate: '',
    toDate: '',
    sorttype: 0,
    excludeARTrans: false,
    longDigit: false,
    foreignFlag: false,
    onlyjournal: false,
    excljournal: false,
    miPost: false,
  },
  bookJournArtViewMBillBody: {
    rechnr: 0,
  },
  bookJournArtMBillMemberBody: {
    resno: 0,
    billno: 0,
  },

  // Report Booking Journal By User Report
  bookJournUserPrepareBody: {},
  selectSystemUserBody: {
    caseType: 3,
    uname: '',
  },
  loadHotelDepartmentBody: {},
  bookJournUserListBody: {},

  // Report Payment Journal By User
  paymentJournalUserListBody: {
    pvILanguage: 0,
    caseType: 1,
    currShift: 0,
    summaryFlag: false,
    fromDate: null,
    blineList: {
      'bline-list': [
        {
          flag: 0,
          userinit: '',
          selected: false,
          name: '',
          'bl-recid': 0,
        },
      ],
    },
  },
  checkPermissionBody: {
    userInit: '',
    arrayNr: 8,
    expectedNr: 2,
  },
  paymentJournalCloseShiftBody: {
    userInit: '',
    fromDate: '',
    shift: 0,
  },

  // Report FO Cancellation
  cancelJournPrepareBody: {
    fromDept: 0,
  },
  cancelJournListBody: {},

  // Report Outstanding Folio
  billOutstandRmNoBody: {},

  // Report Today Departed Guest
  todayCOGuestPrepareBody: {},
  todayCOGuestNoDUBody: {},
  todayCOGuestDUOnlyBody: {},
  getReadBillBody: {},
  readBillLineBody: {},
  getReadArticleBody: {},
  readHJournalBody: {},

  // Report Over Credit Limit
  overCreditLimitListBody: {},

  // Report Departed Unbalance Guest
  checkoutUnbalancedBillsBody: {},

  // Top Menu Card Information
  ccVerificationBody: {},
  ccBtnExitBody: {},

  // Top Menu Select Department
  foInvoiceChgartBody: {},

  // Top Menu Master Folio Member
  foInvoiceMViewBody: {},

  // Transfer History
  foTransDetailPrepareBody: {},

  // Quick Posting To Guest Folio
  quickPostPrepareBody: {},

  // Auto Transfer
  foInvoiceMiTransferBody: {},
  foInvoiceTransferRoomBody: {},
  foInvoiceCreateLogfileBody: {},
  foInvoiceFillRescommentBody: {},
};

export default (doFetch: DoRequest): FrontOfficeCashierEndpoints => ({
  // FO Guest Folio
  foInvoicePrepare: (body = defaultBodies.foInvoicePrepare) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoicePrepare`, body }).then(
      ([, res]) => res
    ),
  foInvoiceCheckZahlungsart: (body = defaultBodies.foInvoiceCheckZahlungsart) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceCheckZahlungsart`, body }).then(
      ([, res]) => res
    ),
  foInvoice1Prepare: (body = defaultBodies.foInvoice1Prepare) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoice1Prepare`, body }).then(
      ([, res]) => res
    ),
  billListFOInvoice: (body = defaultBodies.billListFOInvoice) =>
    doFetch({ url: `${VHP_FOC_URL}/billListFOInvoice`, body }).then(
      ([, res]) => res
    ),
  getHTParam0: (body = defaultBodies.getHTParam0) =>
    doFetch({ url: `${COMMON_URL}/getHTParam0`, body }).then(([, res]) => res),
  selectBill: (body = defaultBodies.selectBill) =>
    doFetch({ url: `${COMMON_URL}/selectBill`, body }).then(
      ([, res]) => res?.b1List?.['b1-list']
    ),
  readResLine: (body = defaultBodies.readResLine) =>
    doFetch({ url: `${COMMON_URL}/readResLine`, body }).then(
      ([, res]) => res?.tResLine?.['t-res-line']
    ),
  readGuest: (body = defaultBodies.readGuest) =>
    doFetch({ url: `${COMMON_URL}/readGuest`, body }).then(
      ([, res]) => res?.tGuest?.['t-guest']
    ),

  // Report FO Transaction Report
  bookJournArtPrepare: (body = defaultBodies.bookJournArtPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/bookJournArtPrepare`, body }).then(
      ([, res]) => res
    ),
  loadArtikel: (body = defaultBodies.loadArtikelBody) =>
    doFetch({ url: `${COMMON_URL}/loadArtikel`, body }).then(
      ([, res]) => res?.artikelList?.['artikel-list']
    ),
  bookJournArtList: (body = defaultBodies.bookJournArtListBody) =>
    doFetch({ url: `${VHP_FOC_URL}/bookJournArtList`, body }).then(
      ([, res]) => res?.foJournalList?.['fo-journal-list']
    ),
  bookJournArtViewMBill: (body = defaultBodies.bookJournArtViewMBillBody) =>
    doFetch({ url: `${VHP_FOC_URL}/bookJournArtViewMBill`, body }).then(
      ([, res]) => res
    ),
  bookJournArtMBillMember: (body = defaultBodies.bookJournArtMBillMemberBody) =>
    doFetch({ url: `${VHP_FOC_URL}/bookJournArtMBillMember`, body }).then(
      ([, res]) => res
    ),

  // Report Booking Journal By User Report
  bookJournUserPrepare: (body = defaultBodies.bookJournUserPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/bookJournUserPrepare`, body }).then(
      ([, res]) => res
    ),
  selectSystemUser: (body = defaultBodies.selectSystemUserBody) =>
    doFetch({ url: `${COMMON_URL}/selectSystemUser`, body }).then(
      ([, res]) => res?.tBediener?.['t-bediener']
    ),
  loadHotelDepartment: (body = defaultBodies.loadHotelDepartmentBody) =>
    doFetch({ url: `${COMMON_URL}/loadHotelDepartment`, body }).then(
      ([, res]) => res?.tHoteldpt?.['t-hoteldpt']
    ),
  bookJournUserList: (body = defaultBodies.bookJournUserListBody) =>
    doFetch({ url: `${VHP_FOC_URL}/bookJournUserList`, body }).then(
      ([, res]) => res?.foUsrjournList?.['fo-usrjourn-list']
    ),

  // Report Payment Journal By User
  paymentJournalUserList: (body = defaultBodies.paymentJournalUserListBody) =>
    doFetch({ url: `${VHP_FOC_URL}/paymentJournalUserList`, body }).then(
      ([, res]) => res
    ),
  checkPermission: (body = defaultBodies.checkPermissionBody) =>
    doFetch({ url: `${COMMON_URL}/checkPermission`, body }).then(
      ([, res]) => res
    ),
  paymentJournalCloseShift: (
    body = defaultBodies.paymentJournalCloseShiftBody
  ) =>
    doFetch({ url: `${VHP_FOC_URL}/paymentJournalCloseShift`, body }).then(
      ([, res]) => res
    ),

  // Report FO Cancellation
  cancelJournPrepare: (body = defaultBodies.cancelJournPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/cancelJournPrepare`, body }).then(
      ([, res]) => res
    ),
  cancelJournList: (body = defaultBodies.cancelJournListBody) =>
    doFetch({ url: `${VHP_FOC_URL}/cancelJournList`, body }).then(
      ([, res]) => res?.cjournList?.['cjourn-list']
    ),

  // Report Outstanding Folio
  billOutstandRmNo: (body = defaultBodies.billOutstandRmNoBody) =>
    doFetch({ url: `${VHP_FOC_URL}/billOutstandRmNo`, body }).then(
      ([, res]) => res?.billbalanceList?.['billbalance-list']
    ),

  // Report Today Departed Guest
  todayCOGuestPrepare: (body = defaultBodies.todayCOGuestPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/todayCOGuestPrepare`, body }).then(
      ([, res]) => res
    ),
  todayCOGuestNoDU: (body = defaultBodies.todayCOGuestNoDUBody) =>
    doFetch({ url: `${VHP_FOC_URL}/todayCOGuestNoDU`, body }).then(
      ([, res]) => res?.clList?.['cl-list']
    ),
  todayCOGuestDUOnly: (body = defaultBodies.todayCOGuestDUOnlyBody) =>
    doFetch({ url: `${VHP_FOC_URL}/todayCOGuestDUOnly`, body }).then(
      ([, res]) => res?.clList?.['cl-list']
    ),
  getReadBill: (body = defaultBodies.getReadBillBody) =>
    doFetch({ url: `${COMMON_URL}/getReadBill`, body }).then(([, res]) => res),
  readBillLine: (body = defaultBodies.readBillLineBody) =>
    doFetch({ url: `${COMMON_URL}/readBillLine`, body }).then(([, res]) => res),
  getReadArticle: (body = defaultBodies.getReadArticleBody) =>
    doFetch({ url: `${COMMON_URL}/getReadArticle`, body }).then(
      ([, res]) => res
    ),
  readHJournal: (body = defaultBodies.readHJournalBody) =>
    doFetch({ url: `${COMMON_URL}/readHJournal`, body }).then(([, res]) => res),

  // Report Over Credit Limit
  overCreditLimitList: (body = defaultBodies.overCreditLimitListBody) =>
    doFetch({ url: `${VHP_FOC_URL}/overCreditLimitList`, body }).then(
      ([, res]) => res?.clList?.['cl-list']
    ),

  // Report Departed Unbalance Guest
  checkoutUnbalancedBills: (body = defaultBodies.checkoutUnbalancedBillsBody) =>
    doFetch({ url: `${VHP_FOC_URL}/checkoutUnbalancedBills`, body }).then(
      ([, res]) => res?.billList?.['bill-list']
    ),

  // Top Menu Card Information
  ccVerification: (body = defaultBodies.ccVerificationBody) =>
    doFetch({ url: `${VHP_FOC_URL}/ccVerification`, body }).then(
      ([, res]) => res.cardOK
    ),
  ccBtnExit: (body = defaultBodies.ccBtnExitBody) =>
    doFetch({ url: `${VHP_FOC_URL}/ccBtnExit`, body }).then(([, res]) => res),

  // Top Menu Select Department
  foInvoiceChgart: (body = defaultBodies.foInvoiceChgartBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceChgart`, body }).then(
      ([, res]) => res
    ),

  // Top Menu Master Folio Member
  foInvoiceMView: (body = defaultBodies.foInvoiceMViewBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceMView`, body }).then(
      ([, res]) => res
    ),

  // Transfer History
  foTransDetailPrepare: (body = defaultBodies.foTransDetailPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foTransDetailPrepare`, body }).then(
      ([, res]) => res
    ),

  // Quick Posting To Guest Folio
  quickPostPrepare: (body = defaultBodies.quickPostPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/quickPostPrepare`, body }).then(
      ([, res]) => res
    ),

  // Auto Transfer
  foInvoiceMiTransfer: (body = defaultBodies.foInvoiceMiTransferBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceMiTransfer`, body }).then(
      ([, res]) => res
    ),
  foInvoiceTransferRoom: (body = defaultBodies.foInvoiceTransferRoomBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceTransferRoom`, body }).then(
      ([, res]) => res
    ),
  foInvoiceCreateLogfile: (body = defaultBodies.foInvoiceCreateLogfileBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceCreateLogfile`, body }).then(
      ([, res]) => res
    ),
  foInvoiceFillRescomment: (body = defaultBodies.foInvoiceFillRescommentBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceFillRescomment`, body }).then(
      ([, res]) => res
    ),
});
