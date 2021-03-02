<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchMonthlyInterstoreTransfer
        :searches="searches"
        @onSearch="onSearch"
      />
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
      >
      </STable>
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
import { map_articelnumber } from './utils/params.incomingstockissuedwithpo';
import {
  mapWithadjuststore,
  mapWithadjustmain,
} from '~/app/helpers/mapSelectItems.helpers';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      data: [],
      longDigit: '',
      sorttype: '',
      showPrice: '',
      searches: {
        availUnter: false,
        departments: [],
        store: [],
        allArt: [],
        option: [
          { label: 'Display Material & Engineering Articles', value: 0 },
          { label: 'Material Articles Only', value: 1 },
          { label: 'Engineering Articles Only', value: 2 },
        ],
      },
    });

    onMounted(async () => {
      const [resPrepare, resStorage, resGroup, resArt] = await Promise.all([
        $api.inventory.FetchAPIINV('stockTranslistPrepare'),
        $api.inventory.FetchAPIINV('getStorage'),
        $api.inventory.FetchAPIINV('getInvMainGroup'),
        $api.inventory.FetchCommon('getAllArtikel', {
          sorttype: '1',
          lastArt: '0',
          lastArt1: '0',
        }),
      ]);

      console.log('data', resPrepare.availUnter);

      state.searches.availUnter = resPrepare.availUnter;
      state.longDigit = resPrepare.longDigit;
      state.searches.allArt = map_articelnumber(resArt);
      state.searches.store = mapWithadjuststore(
        resStorage.tLLager['t-l-lager'],
        ['lager-nr']
      );
      const coba = resGroup.tLHauptgrp['t-l-hauptgrp'];
      coba.unshift({ endkum: 0, bezeich: 'ALL' });
      state.searches.departments = mapWithadjustmain(coba, 'endkum');
      state.isFetching = false;
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Monthly Inter-store Transfer');
      }
    }

    const tableHeaders = [
      {
        label: 'From Storage',
        field: 'f-bezeich',
        name: 'f-bezeich',
        align: 'left',
        sortable: false,
      },
      {
        label: 'To Storage',
        field: 't-bezeich',
        name: 't-bezeich',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Article Number',
        field: 'artnr',
        name: 'artnr',
        sortable: false,
      },
      {
        label: 'Description',
        field: 'bezeich',
        name: 'bezeich',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Quantity',
        field: 'qty',
        name: 'qty',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Amount',
        field: 'val',
        name: 'val',
        align: 'right',
        sortable: false,
      },
      {
        label: 'MTD Quantity',
        field: 't-qty',
        name: 't-qty',
        align: 'right',
        sortable: false,
      },
      {
        label: 'MTD Amount',
        field: 't-val',
        name: 't-val',
        align: 'right',
        sortable: false,
      },
    ];

    const onSearch = (state2) => {
      state.sorttype = state2.shape;

      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV(
            'stockTranslistList',
            {
              pvILanguage: 1,
              mainGrp: state2.departments.value,
              sorttype: state2.shape,
              mattype: state2.display === null ? 0 : state2.display.value,
              fromLager: state2.fromstore.value,
              toLager: state2.tostore.value,
              fromArt: state2.fromarticle.value,
              toArt: state2.toarticle.value,
              fromDate: state2.date.startDate,
              toDate: state2.date.endDate,
            }
          ),
          charts = response.tList['t-list'] || [];
        state.data = mapping(charts);
      }
      asyncCall();
    };

    const mapping = (data) => {
      return data.map((items) => ({
        'f-bezeich': items['f-bezeich'],
        't-bezeich': items['t-bezeich'],
        artnr: items.artnr,
        bezeich: items.bezeich,
        qty: items.qty,
        val: formatterMoney(items.val),
        't-qty': items['t-qty'],
        't-val': formatterMoney(items['t-val']),
      }));
    };
    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      doPrint,
    };
  },
  components: {
    SearchMonthlyInterstoreTransfer: () =>
      import('./components/SearchMonthlyInter-storeTransfer.vue'),
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
