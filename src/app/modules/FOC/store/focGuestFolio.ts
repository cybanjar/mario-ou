import { defineModule, defineMutations, defineGetters } from 'direct-vuex';
import { FocGuestFolioModel } from './focGuestFolioModel';

const state: FocGuestFolioModel = {
  creditCard: [],
  // Guest Folio
  dialogGuestFolio: false,
  dialogPrintFolio: false,
  dialogCheckOut: false,
  dialogTransferTransaction: false,
  dialogAutoTransfer: false,
  dialogTransferHistory: false,
  dialogCreditCard: false,
  dialogPrintCallCharge: false,
  dialogMasterFolioMember: false,
  dialogMoneyChangePosting: false,
  dialogMoneyChangePostingRn: false,
  dialogMasterBill: false,
  dialogCreateMasterBill: false,
  dialogPassword: false,
  dialogDepositPayment: false,
  dialogDepositRefund: false,
  dialogFcer: false,
  dialogError: false,
  dialogRemark: false,
  dialogBackDate: false,
  errorMessage: {},
  foInvoicePrepare: {},
  loadHotelDepartment: {},
  getHTParam0: {},
  selectBill: {},
  billListFOInvoice: {},
  selectedBill: {},
  bookJournArtMBillMember: {},
  foInvoiceMiTransfer: {},
  readGuest: {},
  checkPermission: {},
  bilFlag: 1,
  transdate: '',
  foInvoiceChangeBillAdr: {},
  iconBillReceiverAddress: '',
  iconReservationRemark: '',
  iconSearch: '',
  foInvoiceChangeCommentPrepare: {},
  foTransDetailPrepare: {},
  foInvoiceMasterBill: {},
  readMasterBill: {},
  dialogQptgf: false,
  dialogQptgfRn: false,
  quickPostPrepare: {},
  loadArtikel2: {},
  selectPGuest: {},
  selectedPGuest: {},
  depositAdminPrepare: {},
  depositAdmin1: {},
  depositRefundPrepare: {},
  depositRefundBtnExit: {},
  depositPayPrepare: {},
  depositPayBtnExit: {},
  depositAdminPrintReceipt1: {},
  moneyExchgPrepare: {},
  getReadArticle1: {},
  getReadArticle: {},
  moneyExchgSave: {},
  readCurrency: {},
  selectedTBillLine: {},
  dialogCancelReason: false,
  preparePosting: {},
  dialogSplitItem: false,
};

const mutations = defineMutations<FocGuestFolioModel>()({
  SET_CREDIT_CARD(state, creditCard) {
    state.creditCard = creditCard;
  },
  // Guest Folio
  SET_DIALOG_GUEST_FOLIO(state, payload) {
    state.dialogGuestFolio = payload;
  },
  SET_DIALOG_PRINT_FOLIO(state, payload) {
    state.dialogPrintFolio = payload;
  },
  SET_DIALOG_CHECKOUT(state, payload) {
    state.dialogCheckOut = payload;
  },
  SET_DIALOG_TRANSFER_TRANSACTION(state, payload) {
    state.dialogTransferTransaction = payload;
  },
  SET_DIALOG_AUTO_TRANSFER(state, payload) {
    state.dialogAutoTransfer = payload;
  },
  SET_DIALOG_TRANSFER_HISTORY(state, payload) {
    state.dialogTransferHistory = payload;
  },
  SET_DIALOG_CREDIT_CARD(state, payload) {
    state.dialogCreditCard = payload;
  },
  SET_DIALOG_PRINT_CALL_CHARGE(state, payload) {
    state.dialogPrintCallCharge = payload;
  },
  SET_DIALOG_MASTER_FOLIO_MEMBER(state, payload) {
    state.dialogMasterFolioMember = payload;
  },
  SET_DIALOG_MONEY_CHANGE_POSTING(state, payload) {
    state.dialogMoneyChangePosting = payload;
  },
  SET_DIALOG_MONEY_CHANGE_POSTING_RN(state, payload) {
    state.dialogMoneyChangePostingRn = payload;
  },
  SET_DIALOG_MASTER_BILL(state, payload) {
    state.dialogMasterBill = payload;
  },
  SET_DIALOG_CREATE_MASTER_BILL(state, payload) {
    state.dialogCreateMasterBill = payload;
  },
  SET_DIALOG_PASSWORD(state, payload) {
    state.dialogPassword = payload;
  },
  SET_DIALOG_DEPOSIT_PAYMENT(state, payload) {
    state.dialogDepositPayment = payload;
  },
  SET_DIALOG_DEPOSIT_REFUND(state, payload) {
    state.dialogDepositRefund = payload;
  },
  SET_DIALOG_ERROR(state, payload) {
    state.dialogError = payload;
  },
  SET_DIALOG_REMARK(state, payload) {
    state.dialogRemark = payload;
  },
  SET_DIALOG_BACK_DATE(state, payload) {
    state.dialogBackDate = payload;
  },
  SET_DIALOG_FCER(state, payload) {
    state.dialogFcer = payload;
  },
  SET_ERROR_MESSAGE(state, payload) {
    state.errorMessage = payload;
  },
  SET_FO_INVOICE_PREPARE(state, payload) {
    state.foInvoicePrepare = payload;
  },
  SET_LOAD_HOTEL_DEPARTMENT(state, payload) {
    state.loadHotelDepartment = payload;
  },
  SET_GET_HT_Param_0(state, payload) {
    state.getHTParam0 = payload;
  },
  SET_SELECT_BILL(state, payload) {
    payload.map((e, i) => {
      e.indexFoc = i;
    });
    state.selectBill = payload;
  },
  SET_BILL_LIST_FO_INVOICE(state, payload) {
    payload.tBillLine['t-bill-line'].map((e, i) => {
      e.indexFoc = i;
    });
    state.billListFOInvoice = payload;
  },
  SET_SELECTED_BILL(state, payload) {
    state.selectedBill = payload;
  },
  SET_BOOK_JOURNAL_ART_M_BILL_MEMBER(state, payload) {
    state.bookJournArtMBillMember = payload;
  },
  SET_FO_INVOICE_MI_TRANSFER(state, payload) {
    state.foInvoiceMiTransfer = payload;
  },
  SET_READ_GUEST(state, payload) {
    state.readGuest = payload;
  },
  SET_CHECK_PERMISSION(state, payload) {
    state.checkPermission = payload;
  },
  SET_BIL_FLAG(state, payload) {
    state.bilFlag = payload;
  },
  SET_TRANSDATE(state, payload) {
    state.transdate = payload;
  },
  SET_FO_INVOICE_CHANGE_BILL_ADR(state, payload) {
    state.foInvoiceChangeBillAdr = payload;
  },
  SET_ICON_BILL_RECEIVER_ADDRESS(state, payload) {
    state.iconBillReceiverAddress = payload;
  },
  SET_ICON_RESERVATION_REMARK(state, payload) {
    state.iconReservationRemark = payload;
  },
  SET_ICON_SEARCH(state, payload) {
    state.iconSearch = payload;
  },
  SET_FO_INVOICE_CHANGE_COMMENT_PREPARE(state, payload) {
    state.foInvoiceChangeCommentPrepare = payload;
  },
  SET_FO_TRANS_DETAIL_PREPARE(state, payload) {
    state.foTransDetailPrepare = payload;
  },
  SET_FO_INVOICE_MASTER_BILL(state, payload) {
    state.foInvoiceMasterBill = payload;
  },
  SET_READ_MASTER_BILL(state, payload) {
    state.readMasterBill = payload;
  },
  SET_DIALOG_QPTGF(state, payload) {
    state.dialogQptgf = payload;
  },
  SET_DIALOG_QPTGF_RN(state, payload) {
    state.dialogQptgfRn = payload;
  },
  SET_QUICK_POSTING_PREPARE(state, payload) {
    state.quickPostPrepare = payload;
  },
  SET_LOAD_ARTIKEL_2(state, payload) {
    state.loadArtikel2 = payload;
  },
  SET_SELECT_P_GUEST(state, payload) {
    state.selectPGuest = payload;
  },
  SET_SELECTED_P_GUEST(state, payload) {
    state.selectedPGuest = payload;
  },
  SET_DEPOSIT_ADMIN_PREPARE(state, payload) {
    state.depositAdminPrepare = payload;
  },
  SET_DEPOSIT_ADMIN1(state, payload) {
    state.depositAdmin1 = payload;
  },
  SET_DEPOSIT_REFUND_PREPARE(state, payload) {
    state.depositRefundPrepare = payload;
  },
  SET_DEPOSIT_REFUND_BTN_EXIT(state, payload) {
    state.depositRefundBtnExit = payload;
  },
  SET_DEPOSIT_PAY_PREPARE(state, payload) {
    state.depositPayPrepare = payload;
  },
  SET_DEPOSIT_PAY_BTN_EXIT(state, payload) {
    state.depositPayBtnExit = payload;
  },
  SET_DEPOSIT_ADMIN_PRINT_RECEIPT1(state, payload) {
    state.depositAdminPrintReceipt1 = payload;
  },
  SET_MONEY_EXCHG_PREPARE(state, payload) {
    state.moneyExchgPrepare = payload;
  },
  SET_GET_READ_ARTICLE(state, payload) {
    state.getReadArticle = payload;
  },
  SET_GET_READ_ARTICLE1(state, payload) {
    state.getReadArticle1 = payload;
  },
  SET_MONEY_EXCHG_SAVE(state, payload) {
    state.moneyExchgSave = payload;
  },
  SET_READ_CURRENCY(state, payload) {
    state.readCurrency = payload;
  },
  SET_SELECTED_TBILL_LINE(state, payload) {
    state.selectedTBillLine = payload;
  },
  SET_DIALOG_CANCEL_REASON(state, payload) {
    state.dialogCancelReason = payload;
  },
  SET_PREPRAE_POSTING(state, payload) {
    state.preparePosting = payload;
  },
  SET_DIALOG_SPLIT_ITEM(state, payload) {
    state.dialogSplitItem = payload;
  },
});

const getters = defineGetters<FocGuestFolioModel>()({
  GET_CREDIT_CARD: (state) => (state.creditCard = state.creditCard),
  // Guest Folio
  GET_DIALOG_GUEST_FOLIO: (state) => {
    return (state.dialogGuestFolio = state.dialogGuestFolio);
  },
  GET_DIALOG_PRINT_FOLIO: (state) => {
    return (state.dialogPrintFolio = state.dialogPrintFolio);
  },
  GET_DIALOG_CHECKOUT: (state) => {
    return (state.dialogCheckOut = state.dialogCheckOut);
  },
  GET_DIALOG_TRANSFER_TRANSACTION: (state) => {
    return (state.dialogTransferTransaction = state.dialogTransferTransaction);
  },
  GET_DIALOG_AUTO_TRANSFER: (state) => {
    return (state.dialogAutoTransfer = state.dialogAutoTransfer);
  },
  GET_DIALOG_TRANSFER_HISTORY: (state) => {
    return (state.dialogTransferHistory = state.dialogTransferHistory);
  },
  GET_DIALOG_CREDIT_CARD: (state) => {
    return (state.dialogCreditCard = state.dialogCreditCard);
  },
  GET_DIALOG_PRINT_CALL_CHARGE: (state) => {
    return (state.dialogPrintCallCharge = state.dialogPrintCallCharge);
  },
  GET_DIALOG_MASTER_FOLIO_MEMBER: (state) => {
    return (state.dialogMasterFolioMember = state.dialogMasterFolioMember);
  },
  GET_DIALOG_MONEY_CHANGE_POSTING: (state) => {
    return (state.dialogMoneyChangePosting = state.dialogMoneyChangePosting);
  },
  GET_DIALOG_MONEY_CHANGE_POSTING_RN: (state) => {
    return (state.dialogMoneyChangePostingRn =
      state.dialogMoneyChangePostingRn);
  },
  GET_DIALOG_MASTER_BILL: (state) => {
    return (state.dialogMasterBill = state.dialogMasterBill);
  },
  GET_DIALOG_CREATE_MASTER_BILL: (state) => {
    return (state.dialogCreateMasterBill = state.dialogCreateMasterBill);
  },
  GET_DIALOG_PASSWORD: (state) => {
    return (state.dialogPassword = state.dialogPassword);
  },
  GET_DIALOG_DEPOSIT_PAYMENT: (state) => {
    return (state.dialogDepositPayment = state.dialogDepositPayment);
  },
  GET_DIALOG_DEPOSIT_REFUND: (state) => {
    return (state.dialogDepositRefund = state.dialogDepositRefund);
  },
  GET_DIALOG_FCER: (state) => {
    return (state.dialogFcer = state.dialogFcer);
  },
  GET_DIALOG_ERROR: (state) => {
    return (state.dialogError = state.dialogError);
  },
  GET_DIALOG_REMARK: (state) => {
    return (state.dialogRemark = state.dialogRemark);
  },
  GET_DIALOG_BACK_DATE: (state) => {
    return (state.dialogBackDate = state.dialogBackDate);
  },
  GET_ERROR_MESSAGE: (state) => {
    return (state.errorMessage = state.errorMessage);
  },
  GET_FO_INVOICE_PREPARE: (state) => {
    return (state.foInvoicePrepare = state.foInvoicePrepare);
  },
  GET_LOAD_HOTEL_DEPARTMENT: (state) => {
    return (state.loadHotelDepartment = state.loadHotelDepartment);
  },
  GET_GET_HT_Param_0: (state) => {
    return (state.getHTParam0 = state.getHTParam0);
  },
  GET_SELECT_BILL: (state) => {
    return (state.selectBill = state.selectBill);
  },
  GET_BILL_LIST_FO_INVOICE: (state) => {
    return (state.billListFOInvoice = state.billListFOInvoice);
  },
  GET_SELECTED_BILL: (state) => {
    return (state.selectedBill = state.selectedBill);
  },
  GET_BOOK_JOURNAL_ART_M_BILL_MEMBER: (state) => {
    return (state.bookJournArtMBillMember = state.bookJournArtMBillMember);
  },
  GET_FO_INVOICE_MI_TRANSFER: (state) => {
    return (state.foInvoiceMiTransfer = state.foInvoiceMiTransfer);
  },
  GET_READ_GUEST: (state) => {
    return (state.readGuest = state.readGuest);
  },
  GET_CHECK_PERMISSION: (state) => {
    return (state.checkPermission = state.checkPermission);
  },
  GET_BIL_FLAG: (state) => {
    return (state.bilFlag = state.bilFlag);
  },
  GET_TRANSDATE: (state) => {
    return (state.transdate = state.transdate);
  },
  GET_FO_INVOICE_CHANGE_BILL_ADR: (state) =>
    (state.foInvoiceChangeBillAdr = state.foInvoiceChangeBillAdr),
  GET_ICON_BILL_RECEIVER_ADDRESS: (state) =>
    (state.iconBillReceiverAddress = state.iconBillReceiverAddress),
  GET_ICON_RESERVATION_REMARK: (state) =>
    (state.iconReservationRemark = state.iconReservationRemark),
  GET_ICON_SEARCH: (state) => (state.iconSearch = state.iconSearch),
  GET_FO_INVOICE_CHANGE_COMMENT_PREPARE(state) {
    return (state.foInvoiceChangeCommentPrepare =
      state.foInvoiceChangeCommentPrepare);
  },
  GET_FO_TRANS_DETAIL_PREPARE(state) {
    return (state.foTransDetailPrepare = state.foTransDetailPrepare);
  },
  GET_FO_INVOICE_MASTER_BILL(state) {
    return (state.foInvoiceMasterBill = state.foInvoiceMasterBill);
  },
  GET_READ_MASTER_BILL(state) {
    return (state.readMasterBill = state.readMasterBill);
  },
  GET_DIALOG_QPTGF(state) {
    return (state.dialogQptgf = state.dialogQptgf);
  },
  GET_DIALOG_QPTGF_RN(state) {
    return (state.dialogQptgfRn = state.dialogQptgfRn);
  },
  GET_QUICK_POSTING_PREPARE(state) {
    return (state.quickPostPrepare = state.quickPostPrepare);
  },
  GET_LOAD_ARTIKEL_2(state) {
    return (state.loadArtikel2 = state.loadArtikel2);
  },
  GET_SELECT_P_GUEST(state) {
    return (state.selectPGuest = state.selectPGuest);
  },
  GET_SELECTED_P_GUEST(state) {
    return (state.selectedPGuest = state.selectedPGuest);
  },
  GET_DEPOSIT_ADMIN_PREPARE(state) {
    return (state.depositAdminPrepare = state.depositAdminPrepare);
  },
  GET_DEPOSIT_ADMIN1(state) {
    return (state.depositAdmin1 = state.depositAdmin1);
  },
  GET_DEPOSIT_REFUND_PREPARE(state) {
    return (state.depositRefundPrepare = state.depositRefundPrepare);
  },
  GET_DEPOSIT_REFUND_BTN_EXIT(state) {
    return (state.depositRefundBtnExit = state.depositRefundBtnExit);
  },
  GET_DEPOSIT_PAY_PREPARE(state) {
    return (state.depositPayPrepare = state.depositPayPrepare);
  },
  GET_DEPOSIT_PAY_BTN_EXIT(state) {
    return (state.depositPayBtnExit = state.depositPayBtnExit);
  },
  GET_DEPOSIT_ADMIN_PRINT_RECEIPT1(state) {
    return (state.depositAdminPrintReceipt1 = state.depositAdminPrintReceipt1);
  },
  GET_MONEY_EXCHG_PREPARE(state) {
    return (state.moneyExchgPrepare = state.moneyExchgPrepare);
  },
  GET_GET_READ_ARTICLE(state) {
    return (state.getReadArticle = state.getReadArticle);
  },
  GET_GET_READ_ARTICLE1(state) {
    return (state.getReadArticle1 = state.getReadArticle1);
  },
  GET_MONEY_EXCHG_SAVE(state) {
    return (state.moneyExchgSave = state.moneyExchgSave);
  },
  GET_READ_CURRENCY(state) {
    return (state.readCurrency = state.readCurrency);
  },
  GET_SELECTED_TBILL_LINE(state) {
    return (state.selectedTBillLine = state.selectedTBillLine);
  },
  GET_DIALOG_CANCEL_REASON(state) {
    return (state.dialogCancelReason = state.dialogCancelReason);
  },
  GET_PREPARE_POSTING(state) {
    return (state.preparePosting = state.preparePosting);
  },
  GET_DIALOG_SPLIT_ITEM(state) {
    return (state.dialogSplitItem = state.dialogSplitItem);
  },
});

const focModule = defineModule({
  namespaced: true,
  state,
  mutations,
  getters,
});

export default focModule;
