<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchFBReconciliation :searches="searches" @onSearch="onSearch" />
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
import { tableHeaders } from './tables/fbReconciliation.table';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      food: ' ',
      bev: ' ',
      date1: ' ',
      date2: ' ',
      searches: {
        departments: [],
        date: { start: new Date(), end: new Date() },
        summary: false,
      },
    });

    onMounted(async () => {
      const [resPrepare, resMain] = await Promise.all([
        $api.inventory.FetchAPIINV('fbReconsilePrepare'),
        $api.inventory.FetchAPIINV('getInvMainGroup'),
      ]);

      state.food = resPrepare.food;
      state.bev = resPrepare.bev;
      state.date2 = date.formatDate(resPrepare.toDate, 'DD/MM/YY');
      const tdate = date.formatDate(resPrepare.toDate, 'YYYY-MM-DD');
      state.searches.date.end = new Date(tdate);

      const dd = '01';
      const mmyy = date.formatDate(resPrepare.toDate, 'MM/YY');
      const mmyyyy = date.formatDate(resPrepare.toDate, 'YYYY-MM');
      state.date1 = dd + '/' + mmyy;
      const fdate = mmyyyy + '-' + dd;
      state.searches.date.start = new Date(fdate);

      const coba = resMain.tLHauptgrp['t-l-hauptgrp'];
      coba.unshift({ endkum: 0, bezeich: 'ALL' });
      state.searches.departments = mapWithadjustmain(coba, 'endkum');

      state.isFetching = false;
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'FB Reconciliation');
      }
    }
    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('fbReconsileList', {
            pvILanguage: '1',
            caseType:
              state2.fromDeptVal.value == 1
                ? state.food
                : state2.fromDeptVal.value == 2
                ? state.bev
                : 0,
            fromDate: state.date1,
            toDate: state.date2,
            fromGrp: state2.fromDeptVal.value,
            miOpt: state2.summary,
            date1: date.formatDate(state2.date.start, 'DD/MM/YY'),
            date2: date.formatDate(state2.date.end, 'DD/MM/YY'),
          }),
          charts = response['fbreconsileList']['fbreconsile-list'] || [];

        state.data = charts;
      }
      asyncCall();
    };

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
    SearchFBReconciliation: () =>
      import('./components/SearchFBReconciliation.vue'),
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
tr.selected td {
  background-color: #2d00e2 !important;
  color: #fff;
}
</style>
