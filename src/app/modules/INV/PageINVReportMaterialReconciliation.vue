<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchMaterialReconciliation :searches="searches" @onSearch="onSearch" />
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
import { tableHeaders } from './tables/materialReconciliation.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      searches: {
        departments: [],
        store: [],
      },
    });

    onMounted(async () => {
      const [resDepart] = await Promise.all([
        $api.inventory.FetchAPIINV('matReconsilePrepare'),
      ]);

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
        PrintJs(state.data, tableHeaders, 'Material Reconciliation');
      }
    }

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('matReconsileList', {
            pvILanguage: '1',
            toDate: date.formatDate(state2.date, 'YYYY/MM/DD'),
            lagerNo: state2.store == undefined ? 0 : state2.store,
            fromMain: state2.fromdepartments.value,
            toMain: state2.todepartments.value,
          }),
          charts = response['artBestand']['art-bestand'] || [];

        state.data = mapping(charts);
      }
      asyncCall();
    };

    const mapping = (data) => {
      return data.map((items) => ({
        'inv-acct': items['inv-acct'],
        bezeich: items.bezeich,
        prevval: formatterMoney(items.prevval),
        inval: formatterMoney(items.inval),
        outval: formatterMoney(items.outval),
        actval: formatterMoney(items.actval),
        adjust: items.adjust,
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
    SearchMaterialReconciliation: () =>
      import('./components/SearchMaterialReconciliation.vue'),
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
