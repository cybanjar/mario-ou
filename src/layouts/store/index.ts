import { defineModule, defineMutations } from 'direct-vuex';
import { LayoutState } from '../models/storeModel';

const state: LayoutState = {
  currentModule: null,
};

const mutations = defineMutations<LayoutState>()({
  SET_CURRENT_MODULE(state, currentModule: LayoutState['currentModule']) {
    state.currentModule = currentModule;
  },
});

const layoutModule = defineModule({
  namespaced: true,
  state,
  mutations,
});

export default layoutModule;
