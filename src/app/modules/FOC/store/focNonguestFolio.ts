import { defineModule, defineMutations, defineGetters } from 'direct-vuex';
import { FocNonguestFolioModel } from './focNonguestFolioModel';

const state: FocNonguestFolioModel = {
  // Modal Dialogs
  dialogNonguestFolio: false,

  // Icons
  iconBillReceiverAddress: '',
  iconReservationRemark: '',

  // Apis
  getHTParam0: {},
  selectBill1: {},
  loadHotelDepartment: [],
  nsMainLogic: {},
  nsOpenBill: {},

  // States
  selectedHotel: {},
  selectedBill1: {},
};

const mutations = defineMutations<FocNonguestFolioModel>()({
  // Modal Dialogs
  SET_DIALOG_NONGUEST_FOLIO(state, payload) {
    state.dialogNonguestFolio = payload;
  },

  // Icons
  SET_ICON_BILL_RECEIVER_ADDRESS(state, payload) {
    state.iconBillReceiverAddress = payload;
  },
  SET_ICON_RESERVATION_REMARK(state, payload) {
    state.iconReservationRemark = payload;
  },

  // Apis
  SET_GET_HT_PARAM_0(state, payload) {
    state.getHTParam0 = payload;
  },
  SET_SELECT_BILL_1(state, payload) {
    state.selectBill1 = payload;
  },
  SET_LOAD_HOTEL_DEPARTMENT(state, payload) {
    state.loadHotelDepartment = payload;
  },
  SET_NS_MAIN_LOGIC(state, payload) {
    state.nsMainLogic = payload;
  },
  SET_NS_OPEN_BILL(state, payload) {
    state.nsOpenBill = payload;
  },

  // States
  SET_SELECTED_HOTEL(state, payload) {
    state.selectedHotel = payload;
  },
  SET_SELECTED_BILL_1(state, payload) {
    state.selectedBill1 = payload;
  },
});

const getters = defineGetters<FocNonguestFolioModel>()({
  // Modal Dialogs
  GET_DIALOG_NONGUEST_FOLIO: (state) => {
    return (state.dialogNonguestFolio = state.dialogNonguestFolio);
  },

  // Icons
  GET_ICON_BILL_RECEIVER_ADDRESS: (state) =>
    (state.iconBillReceiverAddress = state.iconBillReceiverAddress),
  GET_ICON_RESERVATION_REMARK: (state) =>
    (state.iconReservationRemark = state.iconReservationRemark),

  // Apis
  GET_GET_HT_PARAM_0: (state) => {
    return (state.getHTParam0 = state.getHTParam0);
  },
  GET_SELECT_BILL_1: (state) => {
    return (state.selectBill1 = state.selectBill1);
  },
  GET_LOAD_HOTEL_DEPARTMENT: (state) => {
    return (state.loadHotelDepartment = state.loadHotelDepartment);
  },
  GET_NS_MAIN_LOGIC: (state) => {
    return (state.nsMainLogic = state.nsMainLogic);
  },
  GET_NS_OPEN_BILL: (state) => {
    return (state.nsOpenBill = state.nsOpenBill);
  },

  // States
  GET_SELECTED_HOTEL: (state) => {
    return (state.selectedHotel = state.selectedHotel);
  },
  GET_SELECTED_BILL_1: (state) => {
    return (state.selectedBill1 = state.selectedBill1);
  },
});

const focModule = defineModule({
  namespaced: true,
  state,
  mutations,
  getters,
});

export default focModule;
