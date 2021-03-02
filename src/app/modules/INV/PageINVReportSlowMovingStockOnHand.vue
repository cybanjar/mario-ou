<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchSlowMovingStockOnHand :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round @click="doPrint">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        dense
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :hide-bottom="false"
        class="table-accounting-date"
        flat
        bordered
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
import {
  mapWithadjuststore,
  mapWithadjustmain,
} from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';
import { tableHeaders } from './tables/slowMovingStockOnHand.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      showPrice: '',
      searches: {
        departments: [],
        store: [],
      },
    });

    onMounted(async () => {
      const [resDepart] = await Promise.all([
        $api.inventory.FetchAPIINV('slowMovingPrepare'),
      ]);
      state.showPrice = resDepart.showPrice;

      state.searches.departments = mapWithadjustmain(
        resDepart.tLHauptgrp['t-l-hauptgrp'],
        'endkum'
      );
      state.searches.store = mapWithadjuststore(
        resDepart.tLLager['t-l-lager'],
        ['lager-nr']
      );

      state.isFetching = false;
    });

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('slowMovingList', {
            storeNo: state2.store.value,
            mainGrp: state2.departments.value,
            tage: state2.day !== '' ? state2.day : 0,
            showPrice: state.showPrice,
          }),
          charts = response['sList']['s-list'] || [];

        state.data = maps(charts);
      }
      asyncCall();
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Slow Moving Stock On Hand');
      }
    }

    const maps = (items) =>
      items
        ? items.map((item) => ({
            artnr: item.artnr,
            name: item.name,
            'min-oh': item['min-oh'],
            'curr-oh': item['curr-oh'],
            avrgprice: formatterMoney(item['avrgprice']),
            'ek-aktuell': formatterMoney(item['ek-aktuell']),
            datum: date.formatDate(item.datum, 'DD/MM/YYYY'),
          }))
        : [];

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      doPrint,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchSlowMovingStockOnHand: () =>
      import('./components/SearchSlowMovingStockOnHand.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
tr.selected td {
  background-color: #2d00e2 !important;
  color: #fff;
}
</style>
