import { defineModule, defineMutations, defineGetters } from 'direct-vuex';
import { FocIndividualCheckoutModel } from './focIndividualCheckoutModel';

const state: FocIndividualCheckoutModel = {
  checkoutSave: {},
  readBill1: {},
  selectedIndividualCheckout: {},
  selectedGroupCheckout: {},
  dialogAutomaticCheckout: false,
  autoCheckoutPrepare: {},
  autoCheckout: {},
  checkoutRes: {},
};

const mutations = defineMutations<FocIndividualCheckoutModel>()({
  SET_CHECKOUT_SAVE(state, payload) {
    state.checkoutSave = payload;
  },
  SET_READ_BILL_1(state, payload) {
    state.readBill1 = payload;
  },
  SET_SELECTED_INDIVIDUAL_CHECKOUT(state, payload) {
    state.selectedIndividualCheckout = payload;
  },
  SET_SELECTED_GROUP_CHECKOUT(state, payload) {
    state.selectedGroupCheckout = payload;
  },
  SET_DIALOG_AUTOMATIC_CHECKOUT(state, payload) {
    state.dialogAutomaticCheckout = payload;
  },
  SET_AUTO_CHECKOUT_PREPARE(state, payload) {
    state.autoCheckoutPrepare = payload;
  },
  SET_AUTO_CHECKOUT(state, payload) {
    state.autoCheckout = payload;
  },
  SET_CHECKOUT_RES(state, payload) {
    state.checkoutRes = payload;
  },
});

const getters = defineGetters<FocIndividualCheckoutModel>()({
  GET_CHECKOUT_SAVE: (state) => {
    return (state.checkoutSave = state.checkoutSave);
  },
  GET_READ_BILL_1: (state) => {
    return (state.readBill1 = state.readBill1);
  },
  GET_SELECTED_INDIVIDUAL_CHECKOUT: (state) => {
    return (state.selectedIndividualCheckout =
      state.selectedIndividualCheckout);
  },
  GET_SELECTED_GROUP_CHECKOUT: (state) => {
    return (state.selectedGroupCheckout = state.selectedGroupCheckout);
  },
  GET_DIALOG_AUTOMATIC_CHECKOUT(state, payload) {
    return (state.dialogAutomaticCheckout = state.dialogAutomaticCheckout);
  },
  GET_AUTO_CHECKOUT_PREPARE(state, payload) {
    return (state.autoCheckoutPrepare = state.autoCheckoutPrepare);
  },
  GET_AUTO_CHECKOUT(state, payload) {
    return (state.autoCheckout = state.autoCheckout);
  },
  GET_CHECKOUT_RES(state, payload) {
    return (state.checkoutRes = state.checkoutRes);
  },
});

const focModule = defineModule({
  namespaced: true,
  state,
  mutations,
  getters,
});

export default focModule;
