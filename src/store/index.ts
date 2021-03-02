import Vue from 'vue';
import Vuex from 'vuex';
import { createDirectStore } from 'direct-vuex';

import layout from '~/layouts/store';
import auth from '~/app/auth/auth.store';
import focGuestFolio from '~/app/modules/FOC/store/focGuestFolio';
import focMasterFolio from '~/app/modules/FOC/store/focMasterFolio';
import focNonguestFolio from '~/app/modules/FOC/store/focNonguestFolio';
import focIndividualCheckout from '~/app/modules/FOC/store/focIndividualCheckout';
import inv from '~/app/modules/INV/store';
import gc from '~/app/modules/GC/store';

Vue.use(Vuex);

const {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
} = createDirectStore({
  modules: {
    layout,
    auth,
    focGuestFolio,
    focMasterFolio,
    focNonguestFolio,
    focIndividualCheckout,
    inv,
    gc,
  },
});

export default () => {
  return store.original;
};

export {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
};

export type AppStore = typeof store;
declare module 'vuex' {
  interface Store<S> {
    direct: AppStore;
  }
}
