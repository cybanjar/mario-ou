import { defineModule, defineMutations, defineGetters } from 'direct-vuex';
import { InvState } from '../models/store'
const state: InvState = {
    prepare: {},
    table: {},
    price: {},
}

const mutations = defineMutations<InvState>()({
    SET_PREPARE(state, prepare) {
        state.prepare = prepare;
      },
    SET_TABLE(state, table) {
        state.table = table
    },
    SET_PRICE(state, price) {
        state.price = price
    },
})

const getters = defineGetters<InvState>()({
    GET_PREPARE: (state) => (state.prepare = state.prepare),
    GET_TABLE: (state) => (state.table = state.table),
    GET_PRICE: (state) => (state.price = state.price),
})

const invModule = defineModule({
    namespaced: true,
    state,
    mutations,
    getters,
})

export default invModule