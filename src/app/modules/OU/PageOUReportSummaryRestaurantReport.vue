<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchSummaryRestaurant :searches="searches" @onSearch="onSearch" />
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
        flat
        bordered
        :data="build"
        :columns="tableHeaders"
        id="printMe"
        separator="cell"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination"
      />
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
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts;
    const state = reactive({
      isFetching: true,
      build: [],
      searches: {
        userList: [],
      },
    });
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('summRestPrepare', {
          currDept: '1',
        }),
      ]);
      responsePrepare = data || [];
      console.log('test', responsePrepare.ttArtnr['tt-artnr']);
    });

    const onSearch = (state2) => {
      async function asyncCall() {
        const dataSummaryRestaurantList = await Promise.all([
          $api.outlet.getOUTableList('summRestList', {
            currDept: '1',
            deptName: responsePrepare.deptName,
            exchgrate: responsePrepare.exchgRate,
            ttArtnr: {
              'tt-artnr': [
                {
                  artnr: responsePrepare.ttArtnr['tt-artnr'][0].artnr,
                  'curr-i': responsePrepare.ttArtnr['tt-artnr'][0][`curr-i`],
                },
              ],
            },
            ldry: responsePrepare.ldry,
            dstore: responsePrepare.dstore,
            clb: responsePrepare.clb,
            zeit2: '86399',
            zeit1: '0',
            fromDate: date.formatDate(state2.date, 'YYYY-MM-DD'),
          }),
        ]);
        console.log(dataSummaryRestaurantList);

        charts = dataSummaryRestaurantList[0] || [];
        state.build = charts['turnover']['turnover'];
        console.log(state2.date, 'data1');
      }
      asyncCall();
    };

    const tableHeaders = [
      {
        label: 'Outlet',
        field: 'name',
        name: 'name',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Pax',
        field: 'belegung',
        name: 'belegung',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Food Harris Cafe',
        field: 'food',
        name: 'food',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Beverange Harris Cafe',
        field: 'beverage',
        name: 'beverage',
        align: 'left',
        sortable: false,
      },
      {
        label: "B'fast Harris Cafe",
        field: 'cigarette',
        name: 'cigarette',
        sortable: false,
      },
      {
        label: 'Other Harris Cafe',
        field: 'discount',
        name: 'discount',
        sortable: false,
      },
      {
        label: 'Service',
        field: 't-service',
        name: 't-service',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Tax',
        field: 't-tax',
        name: 't-tax',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Total',
        field: 't-debit',
        name: 't-debit',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Cash USD',
        field: 'p-cash1',
        name: 'p-cash1',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Cash Rp',
        field: 'p-cash',
        name: 'p-cash',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Transfer',
        field: 'r-transfer',
        name: 'r-transfer',
        align: 'right',
        sortable: false,
      },
      {
        label: 'CC/CL',
        field: 'c-ledger',
        name: 'c-ledger',
        align: 'right',
        sortable: false,
      },
    ];

    function doPrint() {
      if (state.build.length !== 0) {  
        PrintJs(state.build, tableHeaders, 'Report Summary Restaurant Report');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 10,
      },
      doPrint
    };
  },
  components: {
    searchSummaryRestaurant: () =>
      import('./components/SearchSummaryRestaurantReport.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
.mystickyvirtscrolltable {
  height: 410px;
}
</style>