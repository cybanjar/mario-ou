import { defineModule, defineMutations, defineGetters } from 'direct-vuex';
import { FocState } from '../models/storeModel';

const state: FocState = {
  prepare: {},
  parentBills: [],
  selectedParentBills: {},
  parentBillsInvoice: {},
  childBills: [],
  creditCard: [],
  articles: [],
  articlesPayment: [],
  readGuest: [],
  transferHistory: [],
};

const mutations = defineMutations<FocState>()({
  SET_PREPARE(state, prepare) {
    state.prepare = prepare;
  },
  SET_PARENT_BILLS(state, parentBills) {
    parentBills.map((e, i) => {
      e.indexFoc = i;
    });
    state.parentBills = parentBills;
  },
  SET_SELECTED_PARENT_BILLS(state, selectedParentBills) {
    state.selectedParentBills = selectedParentBills;
  },
  SET_PARENT_BILLS_INVOICE(state, parentBillsInvoice) {
    state.parentBillsInvoice = parentBillsInvoice;
  },
  SET_CHILD_BILLS(state, childBills) {
    state.childBills = childBills;
  },
  SET_CREDIT_CARD(state, creditCard) {
    state.creditCard = creditCard;
  },
  SET_ARTICLES(state, articles) {
    state.articles = articles;
  },
  SET_ARTICLES_PAYMENT(state, articlesPayment) {
    state.articlesPayment = articlesPayment;
  },
  SET_READ_GUEST(state, readGuest) {
    state.readGuest = readGuest;
  },
  SET_TRANSFER_HISTORY(state, transferHistory) {
    state.transferHistory = transferHistory;
  },
});

const getters = defineGetters<FocState>()({
  GET_PREPARE: (state) => (state.prepare = state.prepare),
  GET_PARENT_BILLS: (state) => (state.parentBills = state.parentBills),
  GET_SELECTED_PARENT_BILLS: (state) =>
    (state.selectedParentBills = state.selectedParentBills),
  GET_PARENT_BILLS_INVOICE: (state) =>
    (state.parentBillsInvoice = state.parentBillsInvoice),
  GET_CHILD_BILLS: (state) => (state.childBills = state.childBills),
  GET_CREDIT_CARD: (state) => (state.creditCard = state.creditCard),
  GET_ARTICLES: (state) => (state.articles = state.articles),
  GET_ARTICLES_PAYMENT: (state) =>
    (state.articlesPayment = state.articlesPayment),
  GET_READ_GUEST: (state) => (state.readGuest = state.readGuest),
  GET_TRANSFER_HISTORY: (state) =>
    (state.transferHistory = state.transferHistory),
});

const focModule = defineModule({
  namespaced: true,
  state,
  mutations,
  getters,
});

export default focModule;
