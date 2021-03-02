<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchAdjustmentResult :searches="searches" @onSearch="onSearch" />
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
import { tableHeaders } from './tables/adjustmentResult.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '../../helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      matGrp: '',
      p221: '',
      p224: '',
      searches: {
        departments: [],
        store: [],
      },
    });

    onMounted(async () => {
      const [resDepart] = await Promise.all([
        $api.inventory.FetchAPIINV('invAdjustlistPrepare'),
      ]);

      state.matGrp = resDepart.matGrp;
      state.p221 = resDepart.p221;
      state.p224 = resDepart.p224;
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

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Adjustment Result');
      }
    }

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('invAdjustlistList', {
            sorttype: state2.shape,
            currLager: state2.store.value,
            fromGrp: state2.departments.value,
            transdate: state.matGrp == state2.shape ? state.p221 : state.p224,
          }),
          charts = response || [];

        const pbookList = mapRoom(charts.cList['c-list']);
        const Amount = charts.totAmount;
        const Average = charts.totAvrgAmount;
        const listData = {
          key: Number.MAX_VALUE,
          artnr: '',
          bezeich: 'Total',
          munit: '',
          inhalt: '',
          qty: '',
          qty1: '',
          ['avrg-amount']: formatterMoney(Average),
          amount: formatterMoney(Amount),
          fibukonto: '',
          ['cost-center']: '',
        };
        state.data = pbookList.concat(listData);
      }
      asyncCall();
    };

    const mapRoom = (data) => {
      return data.map((items) => ({
        artnr: items.munit == '' ? '' : items.artnr,
        bezeich: items.bezeich,
        munit: items.munit,
        inhalt: items.munit == '' ? '' : items.inhalt,
        qty: items.munit == '' ? '' : items.qty,
        qty1: items.munit == '' ? '' : items.qty1,
        ['avrg-amount']:
          items.munit == '' ? '' : formatterMoney(items['avrg-amount']),
        amount: items.munit == '' ? '' : formatterMoney(items.amount),
        fibukonto: items.fibukonto,
        ['cost-center']: items['cost-center'],
      }));
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
    searchAdjustmentResult: () =>
      import('./components/SearchAdjustmentResult.vue'),
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
