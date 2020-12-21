import { defineModule, defineMutations, defineGetters } from 'direct-vuex';
import { GCState } from '../models/store'

const state: GCState = {
    selectAPInvoicePrepare: {}
}
const mutations = defineMutations<GCState>()({
    SET_APINVOICE(state, selectAPInvoicePrepare) {
        state.selectAPInvoicePrepare = selectAPInvoicePrepare;
      },
})

const getters = defineGetters<GCState>()({
    GET_APINVOICE: (state) => (state.selectAPInvoicePrepare = state.selectAPInvoicePrepare),
})

const gcModule = defineModule({
    namespaced: true,
    state,
    mutations,
    getters,
})

export default gcModule