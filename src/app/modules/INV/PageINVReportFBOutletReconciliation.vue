<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchFBOutletReconciliation :searches="searches" @onSearch="onSearch" />
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
import { mapWithadjustmain } from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';
import { tableHeaders } from './tables/fbOutletReconciliation.table';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      data: [],
      food: '',
      bev: '',
      ldry: '',
      dstore: '',
      doubleCurrency: '',
      foreignNr: '',
      exchgRate: '',
      toDate: '',
      fromDate: '',
      billDate: '',
      searches: {
        departments: [],
      },
    });

    onMounted(async () => {
      const [resPrepare] = await Promise.all([
        $api.inventory.FetchAPIINV('fbReconsile1Prepare'),
      ]);

      state.food = resPrepare.food;
      state.bev = resPrepare.bev;
      state.ldry = resPrepare.ldry;
      state.dstore = resPrepare.dstore;
      state.foreignNr = resPrepare.foreignNr;
      state.doubleCurrency = resPrepare.doubleCurrency;
      state.exchgRate = resPrepare.exchgRate;
      state.toDate = resPrepare.toDate;
      state.fromDate = resPrepare.fromDate;
      state.billDate = resPrepare.billDate;
      state.searches.departments = mapWithadjustmain(
        resPrepare.tLHauptgrp['t-l-hauptgrp'],
        'endkum'
      );

      state.isFetching = false;
    });

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('fbReconsile1List', {
            pvILanguage: 1,
            fromGrp: state2.departments.value,
            food: state.food,
            bev: state.bev,
            fromDate: date.formatDate(state.fromDate, 'D/M/YY'),
            toDate: date.formatDate(state.toDate, 'D/M/YY'),
            date1: state2.date.startDate,
            date2: state2.date.endDate,
            miOptChk: 1,
            doubleCurrency: state.doubleCurrency,
            exchgRate: state.exchgRate,
            foreignNr: state.foreignNr,
          }),
          charts = response || [];

        const pbookList = charts.outputList['output-list'];

        state.data = pbookList;
      }
      asyncCall();
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'FB Outlet Reconciliation');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      doPrint,
    };
  },
  components: {
    SearchFBOutletReconciliation: () =>
      import('./components/SearchFBOutletReconciliation.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
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
</style>
