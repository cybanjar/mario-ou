<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchCancelledIncoming :searches="searches" @onSearch="onSearch" />
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
  mapWithadjustmain,
  mapWithadjuststore,
} from '~/app/helpers/mapSelectItems.helpers';
import { tableHeaders } from './tables/cancelledIncoming.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '../../helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
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
      const [resPrepare] = await Promise.all([
        $api.inventory.FetchAPIINV('cancelStockInPrepare'),
      ]);

      state.showPrice = resPrepare.showPrice;
      const coba = resPrepare.tLLager['t-l-lager'];
      coba.unshift({ ['lager-nr']: 0, bezeich: 'ALL' });
      state.searches.departments = mapWithadjuststore(coba, ['lager-nr']);
      const test = resPrepare.tLHauptgrp['t-l-hauptgrp'];
      test.unshift({ endkum: 0, bezeich: 'ALL' });
      state.searches.store = mapWithadjustmain(test, 'endkum');

      state.isFetching = false;
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Cancelled Incoming');
      }
    }

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('cancelStockInLoad', {
            pvILanguage: '1',
            allSupp: state2.all,
            sorttype: state2.shape,
            fromGrp: state2.main.value,
            store: state2.store.value,
            fromDate: state2.date.startDate,
            toDate: state2.date.endDate,
            showPrice: state.showPrice,
            fromSupp: state2.all ? ' ' : state2.supplierVal,
          }),
          charts =
            Mapping(response['cancelStockinList']['cancel-stockin-list']) || [];
        state.data = charts;
      }
      asyncCall();
    };

    const Mapping = (data) => {
      return data.map((items) => ({
        datum: items.datum,
        lager: items.lager,
        lief: items.lief,
        art: items.art,
        bezeich: items.bezeich,
        unit: items.unit,
        epreis: formatterMoney(items.epreis),
        ['in-qty']: items['in-qty'],
        amount: formatterMoney(items.amount),
        dlvnote: items.dlvnote,
        note: items.note,
        reason: items.reason,
        invnr: items.invnr,
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
    SearchCancelledIncoming: () =>
      import('./components/SearchCancelledIncoming.vue'),
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
