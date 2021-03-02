import { defineModule, defineMutations, defineGetters } from 'direct-vuex';
import { FocMasterFolioModel } from './focMasterFolioModel';

const state: FocMasterFolioModel = {
  // Modal Dialogs
  dialogMasterFolio: false,

  // Icons
  iconBillReceiverAddress: '',
  iconReservationRemark: '',

  // Apis
  mbMainLogic: {},
  getHTParam0: {},
  selectBill2: {},
  mbOpenBill: {},
  loadHotelDepartment: [],

  // States
  selectedHotel: {},
  selectedBill2: {},
};

const mutations = defineMutations<FocMasterFolioModel>()({
  // Modal Dialogs
  SET_DIALOG_MASTER_FOLIO(state, payload) {
    state.dialogMasterFolio = payload;
  },

  // Icons
  SET_ICON_BILL_RECEIVER_ADDRESS(state, payload) {
    state.iconBillReceiverAddress = payload;
  },
  SET_ICON_RESERVATION_REMARK(state, payload) {
    state.iconReservationRemark = payload;
  },

  // Apis
  SET_MB_MAIN_LOGIC(state, payload) {
    state.mbMainLogic = payload;
  },
  SET_GET_HT_PARAM_0(state, payload) {
    state.getHTParam0 = payload;
  },
  SET_SELECT_BILL_2(state, payload) {
    state.selectBill2 = payload;
  },
  SET_MB_OPEN_BILL(state, payload) {
    state.mbOpenBill = payload;
  },
  SET_LOAD_HOTEL_DEPARTMENT(state, payload) {
    state.loadHotelDepartment = payload;
  },

  // States
  SET_SELECTED_HOTEL(state, payload) {
    state.selectedHotel = payload;
  },
  SET_SELECTED_BILL_2(state, payload) {
    state.selectedBill2 = payload;
  },
});

const getters = defineGetters<FocMasterFolioModel>()({
  // Modal Dialogs
  GET_DIALOG_MASTER_FOLIO: (state) => {
    return (state.dialogMasterFolio = state.dialogMasterFolio);
  },

  // Icons
  GET_ICON_BILL_RECEIVER_ADDRESS: (state) =>
    (state.iconBillReceiverAddress = state.iconBillReceiverAddress),
  GET_ICON_RESERVATION_REMARK: (state) =>
    (state.iconReservationRemark = state.iconReservationRemark),

  // Apis
  GET_MB_MAIN_LOGIC: (state) => {
    return (state.mbMainLogic = state.mbMainLogic);
  },
  GET_GET_HT_PARAM_0: (state) => {
    return (state.getHTParam0 = state.getHTParam0);
  },
  GET_SELECT_BILL_2: (state) => {
    return (state.selectBill2 = state.selectBill2);
  },
  GET_MB_OPEN_BILL: (state) => {
    return (state.mbOpenBill = state.mbOpenBill);
  },
  GET_LOAD_HOTEL_DEPARTMENT: (state) => {
    return (state.loadHotelDepartment = state.loadHotelDepartment);
  },

  // States
  GET_SELECTED_HOTEL: (state) => {
    return (state.selectedHotel = state.selectedHotel);
  },
  GET_SELECTED_BILL_2: (state) => {
    return (state.selectedBill2 = state.selectedBill2);
  },
});

const focModule = defineModule({
  namespaced: true,
  state,
  mutations,
  getters,
});

export default focModule;
