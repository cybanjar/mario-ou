<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchMinimumStockOnHand :searches="searches" @onSearch="onSearch" />
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
        separator="cell"
        class="table-accounting-date"
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
import { tableHeaders } from './tables/maximumStockOnHand.table';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      tes: '',
      flogical: true,
      data: [],
      showPrice: '',
      permission: [],
      searches: {
        departments: [],
        fromStore: [],
        toStore: [],
      },
      dataRow: {},
    });

    onMounted(async () => {
      const [resDepart, getBediener, getFLogical] = await Promise.all([
        $api.inventory.FetchAPIINV('maxOHPrepare'),
        $api.inventory.FetchCommon('getBediener', {
          userNo: '',
          userInit: '01',
        }),
        $api.inventory.FetchCommon('getHTParam0', {
          casetype: 1,
          inpParam: 246,
        }),
      ]);

      state.showPrice = resDepart.showPrice;

      state.searches.departments = mapWithadjustmain(
        resDepart.tLHauptgrp['t-l-hauptgrp'],
        'endkum'
      );
      state.searches.fromStore = mapWithadjuststore(
        resDepart.tLLager['t-l-lager'],
        ['lager-nr']
      );
      state.searches.toStore = mapWithadjuststore(
        resDepart.tLLager['t-l-lager'],
        ['lager-nr']
      );

      state.flogical = getFLogical.flogical;

      state.permission = getBediener['tBediener']['t-bediener'].map(
        (a) => a.permissions
      );
      state.tes = state.permission[0].toString();
      state.isFetching = false;
    });

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('maxOHList', {
            sorttype: state2.shape,
            mainGrp: state2.departments.value,
            fromStore3: state2.fromStore.value,
            toStore3: state2.toStore.value,
            showPrice:
              state.permission[0].substring(21, 22) !== '0' ? 'Yes' : 'No',
          }),
          charts = response['maxOnhandList']['max-onhand-list'] || [];

        state.data = [];
        for (let i = 0; i < charts.length; i++) {
          state.dataRow = {};
          const dataItem = charts[i];

          state.dataRow['artnr'] = dataItem['artnr'] == 0 ? '' : dataItem['artnr'];
          state.dataRow['name'] = dataItem['name'];
          state.dataRow['max-oh'] =
            dataItem['artnr'] == 0 && dataItem['max-oh'] == 0
              ? ''
              : formatterMoney(dataItem['max-oh']);
          state.dataRow['curr-oh'] =
            dataItem['artnr'] == 0 && dataItem['curr-oh'] == 0
              ? ''
              : formatterMoney(dataItem['curr-oh']);
          state.dataRow['avrgprice'] =
            state.flogical && dataItem['artnr'] != 0
              ? formatterMoney(dataItem['avrgprice'])
              : '';
          state.dataRow['ek-aktuell'] =
            state.flogical && dataItem['artnr'] != 0
              ? formatterMoney(dataItem['ek-aktuell'])
              : '';
          state.dataRow['datum'] =
            dataItem['datum'] == null || undefined || ''
              ? ' '
              : date.formatDate(dataItem['datum'], 'DD/MM/YYYY');

          state.data.push(state.dataRow);
        }
      }
      asyncCall();
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Maximum Stock OnHand');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
      doPrint,
    };
  },
  components: {
    SearchMinimumStockOnHand: () =>
      import('./components/SearchMinimumStockOnHand.vue'),
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
