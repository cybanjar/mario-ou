import { DoRequest } from '../config/repository';

const COMMON_URL = 'Common';
const VHP_FOC_URL = 'vhpFOC';

export interface FrontOfficeCashierEndpoints {
  // Guest Folio
  foInvoicePrepare: any;
  foInvoiceCheckZahlungsart: any;
  foInvoice1Prepare: any;
  billListFOInvoice: any;
  getHTParam0: any;
  selectBill: any;
  readResLine: any;
  readGuest: any;
  foInvoiceBtnNewInv: any;
  foInvoicePostDate: any;
  foInvoiceCheckout: any;
  readMasterBill: any;
  readBill1: any;
  foInvoiceChangeBillAdr: any;
  foInvoiceChangeCommentSave: any;
  foInvoiceChangeBillnr1: any;
  foInvoiceChangeBillnr2: any;
  foInvoiceChangeBillnr3: any;
  foInvoiceMasterBill: any;

  // Nonguest Folio
  selectBill1: any;
  nsMainLogic: any;
  nsOpenBill: any;

  // Master Folio
  mbMainLogic: any;
  selectBill2: any;
  mbOpenBill: any;

  // Closed folio
  ReadBillHis: any;

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
  loadArtikelTwo: any;
  selectPGuest: any;
  readCurrency: any;
  quickPostCreateBill: any;

  // Auto Transfer
  foInvoiceMiTransfer: any;
  foInvoiceTransferRoom: any;
  foInvoiceCreateLogfile: any;
  foInvoiceFillRescomment: any;
  foInvoiceChangeCommentPrepare: any;

  // Individual Checkout
  checkoutSave: any;
  arlListFOInvoice: any;
  checkoutRes: any;

  // Group Checkout
  checkoutGroupPrepare: any;
  checkoutGroupSave: any;
  autoCheckoutPrepare: any;
  autoCheckout: any;

  // Deposit
  depositAdminPrepare: any;
  depositAdmin1: any;
  depositRefundPrepare: any;
  depositRefundBtnExit: any;
  depositPayPrepare: any;
  depositPayBtnExit: any;
  depositAdminPrintReceipt1: any;

  // Money Change Posting
  moneyExchgPrepare: any;
  getReadArticle1: any;
  moneyExchgSave: any;
  foInvoiceBillUpdate: any;
  foInvoiceSplitBline: any;
  readBillLine1: any;
  foInvoiceCalcUnitPrice: any;
}

const defaultBodies = {
  // Guest Folio
  foInvoicePrepareBody: {
    bilFlag: 0,
  },
  foInvoiceCheckZahlungsartBody: {
    bilRecid: 26985,
  },
  foInvoice1PrepareBody: {
    inpRechnr: 0,
  },
  billListFOInvoiceBody: {
    bilFlag: 0,
    bilRecid: 91104,
    room: '',
    vipflag: false,
    fillCo: true,
    doubleCurrency: false,
    foreignRate: false,
  },
  getHTParam0Body: {
    casetype: 2,
    inpParam: 110,
  },
  selectBillBody: {
    pvILanguage: 1,
    sorttype: 1,
    zinr: ' ',
    bilInt: 0,
    currGastnr: 0,
    gastname: '',
    toName: ' ',
    rechnr: 0,
  },
  readResLineBody: {
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
  readGuestBody: {
    caseType: 1,
    gastNo: 36613,
    gname: ' ',
    fname: ' ',
  },
  foInvoiceBtnNewInvBody: {},
  foInvoicePostDateBody: {},
  foInvoiceCheckoutBody: {},
  readMasterBillBody: {},
  readBill1Body: {},
  foInvoiceChangeBillAdrBody: {},
  foInvoiceChangeCommentPrepareBody: {},
  foInvoiceChangeCommentSaveBody: {},
  foInvoiceChangeBillnr1Body: {},
  foInvoiceChangeBillnr2Body: {},
  foInvoiceChangeBillnr3Body: {},
  foInvoiceMasterBillBody: {},

  // Nonguest Folio
  selectBill1Body: {},
  nsMainLogicBody: {},
  nsOpenBillBody: {},

  // Master Folio
  mbMainLogicBody: {},
  selectBill2Body: {},
  mbOpenBillBody: {},

  // Closed Folio
  ReadBillHisBody: {},

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
    userInit: '01',
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
  loadArtikel2Body: {},
  selectPGuestBody: {},
  readCurrencyBody: {},
  quickPostCreateBillBody: {},

  // Auto Transfer
  foInvoiceMiTransferBody: {},
  foInvoiceTransferRoomBody: {},
  foInvoiceCreateLogfileBody: {},
  foInvoiceFillRescommentBody: {},

  // Individual Checkout
  checkoutSaveBody: {},
  arlListFOInvoiceBody: {},
  checkoutResBody: {},

  // Group Checkout
  checkoutGroupPrepareBody: {},
  checkoutGroupSaveBody: {},
  autoCheckoutPrepareBody: {},
  autoCheckoutBody: {},

  // Deposit
  depositAdminPrepareBody: {},
  depositAdmin1Body: {},
  depositRefundPrepareBody: {},
  depositRefundBtnExitBody: {},
  depositPayPrepareBody: {},
  depositPayBtnExitBody: {},
  depositAdminPrintReceipt1Body: {},

  // Money Change Posting
  moneyExchgPrepareBody: {},
  getReadArticle1Body: {},
  moneyExchgSaveBody: {},
  foInvoiceBillUpdateBody: {},
  foInvoiceSplitBlineBody: {},
  readBillLine1Body: {},
  foInvoiceCalcUnitPriceBody: {},

  moneyEchgSaveBody: {},
};

export default (doFetch: DoRequest): FrontOfficeCashierEndpoints => ({
  // Guest Folio
  foInvoicePrepare: (body = defaultBodies.foInvoicePrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoicePrepare`, body }).then(
      ([, res]) => res
    ),
  foInvoiceCheckZahlungsart: (
    body = defaultBodies.foInvoiceCheckZahlungsartBody
  ) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceCheckZahlungsart`, body }).then(
      ([, res]) => res
    ),
  foInvoice1Prepare: (body = defaultBodies.foInvoice1PrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoice1Prepare`, body }).then(
      ([, res]) => res
    ),
  billListFOInvoice: (body = defaultBodies.billListFOInvoiceBody) =>
    doFetch({ url: `${VHP_FOC_URL}/billListFOInvoice`, body }).then(
      ([, res]) => res
    ),
  getHTParam0: (body = defaultBodies.getHTParam0Body) =>
    doFetch({ url: `${COMMON_URL}/getHTParam0`, body }).then(([, res]) => res),
  selectBill: (body = defaultBodies.selectBillBody) =>
    doFetch({ url: `${COMMON_URL}/selectBill`, body }).then(
      ([, res]) => res?.b1List?.['b1-list']
    ),
  readResLine: (body = defaultBodies.readResLineBody) =>
    doFetch({ url: `${COMMON_URL}/readResLine`, body }).then(
      ([, res]) => res?.tResLine?.['t-res-line']
    ),
  readGuest: (body = defaultBodies.readGuestBody) =>
    doFetch({ url: `${COMMON_URL}/readGuest`, body }).then(
      ([, res]) => res?.tGuest?.['t-guest']
    ),
  foInvoiceBtnNewInv: (body = defaultBodies.foInvoiceBtnNewInvBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceBtnNewInv`, body }).then(
      ([, res]) => res
    ),
  foInvoicePostDate: (body = defaultBodies.foInvoicePostDateBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoicePostDate`, body }).then(
      ([, res]) => res
    ),
  foInvoiceCheckout: (body = defaultBodies.foInvoiceCheckoutBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceCheckout`, body }).then(
      ([, res]) => res
    ),
  readMasterBill: (body = defaultBodies.readMasterBillBody) =>
    doFetch({ url: `${VHP_FOC_URL}/readMasterBill`, body }).then(
      ([, res]) => res
    ),
  readBill1: (body = defaultBodies.readBill1Body) =>
    doFetch({ url: `${COMMON_URL}/readBill1`, body }).then(([, res]) => res),
  foInvoiceChangeBillAdr: (body = defaultBodies.foInvoiceChangeBillAdrBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceChangeBillAdr`, body }).then(
      ([, res]) => res
    ),
  foInvoiceChangeCommentPrepare: (
    body = defaultBodies.foInvoiceChangeCommentPrepareBody
  ) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceChangeCommentPrepare`, body }).then(
      ([, res]) => res
    ),
  foInvoiceChangeCommentSave: (
    body = defaultBodies.foInvoiceChangeCommentSaveBody
  ) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceChangeCommentSave`, body }).then(
      ([, res]) => res
    ),
  foInvoiceChangeBillnr1: (body = defaultBodies.foInvoiceChangeBillnr1Body) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceChangeBillnr1`, body }).then(
      ([, res]) => res
    ),
  foInvoiceChangeBillnr2: (body = defaultBodies.foInvoiceChangeBillnr2Body) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceChangeBillnr2`, body }).then(
      ([, res]) => res
    ),
  foInvoiceChangeBillnr3: (body = defaultBodies.foInvoiceChangeBillnr3Body) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceChangeBillnr3`, body }).then(
      ([, res]) => res
    ),
  foInvoiceMasterBill: (body = defaultBodies.foInvoiceMasterBillBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceMasterBill`, body }).then(
      ([, res]) => res
    ),

  // Nonguest Folio
  selectBill1: (body = defaultBodies.selectBill1Body) =>
    doFetch({ url: `${VHP_FOC_URL}/selectBill1`, body }).then(
      ([, res]) => res?.b1List?.['b1-list']
    ),

  nsMainLogic: (body = defaultBodies.nsMainLogicBody) =>
    doFetch({ url: `${VHP_FOC_URL}/nsMainLogic`, body }).then(([, res]) => res),

  nsOpenBill: (body = defaultBodies.nsOpenBillBody) =>
    doFetch({ url: `${VHP_FOC_URL}/nsOpenBill`, body }).then(([, res]) => res),

  // Master Folio
  mbMainLogic: (body = defaultBodies.mbMainLogicBody) =>
    doFetch({ url: `${VHP_FOC_URL}/mbMainLogic`, body }).then(([, res]) => res),
  selectBill2: (body = defaultBodies.selectBill2Body) =>
    doFetch({ url: `${VHP_FOC_URL}/selectBill2`, body }).then(([, res]) => res),
  mbOpenBill: (body = defaultBodies.mbOpenBillBody) =>
    doFetch({ url: `${VHP_FOC_URL}/mbOpenBill`, body }).then(([, res]) => res),
  ReadBillHis: (body = defaultBodies.ReadBillHisBody) =>
    doFetch({ url: `${VHP_FOC_URL}/ReadBillHis`, body }).then(([, res]) => res),

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
  loadArtikelTwo: (body = defaultBodies.loadArtikel2Body) =>
    doFetch({ url: `${COMMON_URL}/loadArtikel2`, body }).then(([, res]) => res),
  selectPGuest: (body = defaultBodies.selectPGuestBody) =>
    doFetch({ url: `${COMMON_URL}/selectPGuest`, body }).then(([, res]) => res),
  readCurrency: (body = defaultBodies.readCurrencyBody) =>
    doFetch({ url: `${COMMON_URL}/readCurrency`, body }).then(([, res]) => res),
  quickPostCreateBill: (body = defaultBodies.quickPostCreateBillBody) =>
    doFetch({ url: `${VHP_FOC_URL}/quickPostCreateBill`, body }).then(
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

  // Individual Checkout
  checkoutSave: (body = defaultBodies.checkoutSaveBody) =>
    doFetch({ url: `${VHP_FOC_URL}/checkoutSave`, body }).then(
      ([, res]) => res
    ),
  arlListFOInvoice: (body = defaultBodies.arlListFOInvoiceBody) =>
    doFetch({ url: `${VHP_FOC_URL}/arlListFOInvoice`, body }).then(
      ([, res]) => res
    ),
  checkoutRes: (body = defaultBodies.checkoutResBody) =>
    doFetch({ url: `${VHP_FOC_URL}/checkoutRes`, body }).then(([, res]) => res),
  checkoutGroupPrepare: (body = defaultBodies.checkoutGroupPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/checkoutGroupPrepare`, body }).then(
      ([, res]) => res
    ),
  checkoutGroupSave: (body = defaultBodies.checkoutGroupSaveBody) =>
    doFetch({ url: `${VHP_FOC_URL}/checkoutGroupSave`, body }).then(
      ([, res]) => res
    ),
  autoCheckoutPrepare: (body = defaultBodies.autoCheckoutPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/autoCheckoutPrepare`, body }).then(
      ([, res]) => res
    ),
  autoCheckout: (body = defaultBodies.autoCheckoutBody) =>
    doFetch({ url: `${VHP_FOC_URL}/autoCheckout`, body }).then(
      ([, res]) => res
    ),

  // Deposit

  depositAdminPrepare: (body = defaultBodies.depositAdminPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/depositAdminPrepare`, body }).then(
      ([, res]) => res
    ),

  depositAdmin1: (body = defaultBodies.depositAdmin1Body) =>
    doFetch({ url: `${VHP_FOC_URL}/depositAdmin1`, body }).then(
      ([, res]) => res
    ),

  depositRefundPrepare: (body = defaultBodies.depositRefundPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/depositRefundPrepare`, body }).then(
      ([, res]) => res
    ),

  depositRefundBtnExit: (body = defaultBodies.depositRefundBtnExitBody) =>
    doFetch({ url: `${VHP_FOC_URL}/depositRefundBtnExit`, body }).then(
      ([, res]) => res
    ),

  depositPayPrepare: (body = defaultBodies.depositPayPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/depositPayPrepare`, body }).then(
      ([, res]) => res
    ),

  depositPayBtnExit: (body = defaultBodies.depositPayBtnExitBody) =>
    doFetch({ url: `${VHP_FOC_URL}/depositPayBtnExit`, body }).then(
      ([, res]) => res
    ),

  depositAdminPrintReceipt1: (
    body = defaultBodies.depositAdminPrintReceipt1Body
  ) =>
    doFetch({ url: `${VHP_FOC_URL}/depositAdminPrintReceipt1`, body }).then(
      ([, res]) => res
    ),

  // Money Change Posting
  moneyExchgPrepare: (body = defaultBodies.moneyExchgPrepareBody) =>
    doFetch({ url: `${VHP_FOC_URL}/moneyExchgPrepare`, body }).then(
      ([, res]) => res
    ),
  getReadArticle1: (body = defaultBodies.getReadArticle1Body) =>
    doFetch({ url: `${COMMON_URL}/getReadArticle1`, body }).then(
      ([, res]) => res
    ),
  readBillLine1: (body = defaultBodies.readBillLine1Body) =>
    doFetch({ url: `${COMMON_URL}/readBillLine1`, body }).then(
      ([, res]) => res
    ),
  moneyExchgSave: (body = defaultBodies.moneyEchgSaveBody) =>
    doFetch({ url: `${VHP_FOC_URL}/moneyExchgSave`, body }).then(
      ([, res]) => res
    ),
  foInvoiceBillUpdate: (body = defaultBodies.foInvoiceBillUpdateBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceBillUpdate`, body }).then(
      ([, res]) => res
    ),
  foInvoiceSplitBline: (body = defaultBodies.foInvoiceSplitBlineBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceSplitBline`, body }).then(
      ([, res]) => res
    ),
  foInvoiceCalcUnitPrice: (body = defaultBodies.foInvoiceCalcUnitPriceBody) =>
    doFetch({ url: `${VHP_FOC_URL}/foInvoiceCalcUnitPrice`, body }).then(
      ([, res]) => res
    ),
});
