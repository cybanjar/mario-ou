<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchDetailMovingStock :searches="searches" @onSearch="onSearch" />
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
import { date } from 'quasar';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      sBezeich: '',
      priceDecimal: '',
      showPrice: '',
      availLArtikel: '',
      searches: {
        departments: [],
        allArt: [],
      },
    });

    onMounted(async () => {
      const [resDepart, resArt] = await Promise.all([
        $api.inventory.FetchAPIINV('stockMovelistPrepare', {
          sBezeich: '*',
          inpArtnr: '0000000',
        }),
        $api.inventory.FetchCommon('getAllArtikel', {
          sorttype: '1',
          lastArt: '0',
          lastArt1: '0',
        }),
      ]);

      state.sBezeich = resDepart.sBezeich;
      state.priceDecimal = resDepart.priceDecimal;
      state.showPrice = resDepart.showPrice;
      state.availLArtikel = resDepart.availLArtikel;
      state.searches.allArt = map_articelnumber(resArt);

      state.isFetching = false;
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Detail Moving Stock');
      }
    }

    const tableHeaders = [
      {
        label: 'Date',
        field: 'datum',
        name: 'datum',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Transaction Code',
        field: 'lscheinnr',
        name: 'lscheinnr',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Initial Quantity',
        field: 'init-qty',
        name: 'init-qty',
        sortable: false,
      },
      {
        label: 'Initial Value',
        field: 'init-val',
        name: 'init-val',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Incoming Quantity',
        field: 'in-qty',
        name: 'in-qty',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Incoming Value',
        field: 'in-val',
        name: 'in-val',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Outgoing Quantity',
        field: 'out-qty',
        name: 'out-qty',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Outgoing Value',
        field: 'out-val',
        name: 'out-val',
        align: 'right',
        sortable: false,
      },
      {
        label: 'Remark',
        field: 'note',
        name: 'note',
        align: 'right',
        sortable: false,
      },
      {
        label: 'ID',
        field: 'ID',
        name: 'ID',
        sortable: false,
      },
    ];

    const onSearch = (state2) => {     
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('stockMovelistList', {
            pvILanguage: '1',
            sArtnr: state2.article.value,
            showPrice: state.showPrice,
            fromLager: state2.From,
            toLager: state2.To,
          }),
          charts = response.stockMovelist['stock-movelist'] || [];
        state.data = maps(charts);
      }
      asyncCall();
    };

    const maps = (items) =>
      items
        ? items.map((item) => ({
            datum: date.formatDate(item.datum, 'DD/MM/YYYY'),
            lscheinnr: item.lscheinnr,
            'init-qty': item['init-qty'],
            'init-val': item['init-val'],
            'in-qty': item['in-qty'],
            'in-val': item['in-val'],
            'out-qty': item['out-qty'],
            'out-val': item['out-val'],
            note: item['note'],
            ID: item['id'] == '' ? '' : item['id'],
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
    SearchDetailMovingStock: () =>
      import('./components/SearchDetailMovingStock.vue'),
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
