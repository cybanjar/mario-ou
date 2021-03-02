<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchStockOnHand :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        dense
        :columns="tableHeaders"
        :data="data"
        separator="cell"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination"
      ></STable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { mapWithPrefix } from '~/app/helpers/mapSelectItems.helpers';
import { tableHeaders } from './tables/stockOnHand.table';
import { date } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let dataLists;

//test
    const state = reactive({
      isFetching: true,
      data: [],
      fromStore: null,
      toStore: null,
      mainGrp: null,
      sortBy: 1,
      zero: false,
      global: false,
      showPrice: true,
      searches: {
        maingrp: [],
        store: [],
      },
      test: "",
    });

    onMounted(async () => {
      const response = await $api.inventory.FetchAPIINV('stockOnHandPrepare');
      state.searches.store = mapWithPrefix(response.tLLager['t-l-lager'], [
        'lager-nr',
      ]);
      state.searches.maingrp = mapWithPrefix(
        response.tLHauptgrp['t-l-hauptgrp'],
        ['endkum']
      );
      state.showPrice = response.showPrice;
      state.isFetching = false;
    });

    const onSearch = async (state2) => {
      console.log({
        allFlag: state2.global,
        showPrice: state.showPrice,
        zeroFlag: state2.zero,
        fromGrp: state2.mainGrp.value,
        subGrp: '0',
        fromLager: state2.fromStore.value,
        toLager: state2.toStore.value,
        sorttype: state2.sortBy,
        mattype: '0',
      });
      
      const response = await $api.inventory.FetchAPIINV('stockOnHandList',{
        allFlag: state2.global,
        showPrice: state.showPrice,
        zeroFlag: state2.zero,
        fromGrp: state2.mainGrp.value,
        subGrp: '0',
        fromLager: state2.fromStore.value,
        toLager: state2.toStore.value,
        sorttype: state2.sortBy,
        mattype: '0',
      });
      dataLists = response.sohList?.['soh-list'] || [];
      state.data = dataLists;
    };

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchStockOnHand: () => import('./components/SearchStockOnHand.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
