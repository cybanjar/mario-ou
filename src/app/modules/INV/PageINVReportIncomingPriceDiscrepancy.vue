<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchMinimumStockOnHand
        :searches="searches"
        @onSearch="onSearch"
        @filterFn="filterFn"
        @filterFn2="filterFn2"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn @click="doPrint" flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        dense
        :columns="tableHeaders"
        :data="data"
        separator="cell"
        class="table-accounting-date"
        id="printMe"
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
import { mapWithadjuststore } from '~/app/helpers/mapSelectItems.helpers';
import { map_articelnumber } from './utils/params.incomingstockissuedwithpo';
import { date } from 'quasar';
import { tableHeaders } from './tables/incomingPriceDiscrepancy.table';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { InputSearch } from './Input/IncominStockIssuidwithPO';
import { Notify } from 'quasar';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      data: [],
      searches: {
        fromStore: [],
        toStore: [],
        allArt: [],
        toArt: [],
        selectedArt1: [],
        selectedArt2: [],
        inputSearch: InputSearch,
      },
    });

    onMounted(async () => {
      const [resDepart, getArt] = await Promise.all([
        $api.inventory.FetchAPIINV('getStorage'),
        $api.inventory.FetchCommon('getAllArtikel', {
          sorttype: '1',
          lastArt: '0',
          lastArt1: '0',
        }),
      ]);

      state.searches.fromStore = mapWithadjuststore(
        resDepart.tLLager['t-l-lager'],
        ['lager-nr']
      );
      state.searches.toStore = mapWithadjuststore(
        resDepart.tLLager['t-l-lager'],
        ['lager-nr']
      );
      let lastrow = 0;
      state.searches.allArt = map_articelnumber(getArt);
      lastrow = getArt.tLArtikel['t-l-artikel'].length;
      state.searches.selectedArt1 = state.searches.allArt[0];
      state.searches.selectedArt2 = state.searches.allArt[lastrow - 1];
      state.isFetching = false;
    });

    const NotifyCreate1 = (message) =>
      Notify.create({
        message: message,
        type: 'negative',
        position: 'top',
        textColor: 'white',
        timeout: 2000,
      });

    const filterFn = (val, update) => {
      if (val === '') {
        update(() => {
          InputSearch[3].options = state.searches.allArt;
        });
      }
      if (isNaN(val)) {
        update(() => {
          const needle = val;
          InputSearch[3].options = state.searches.allArt.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        });
      } else {
        update(() => {
          const needle = val;
          InputSearch[3].options = state.searches.allArt.filter(
            (v) => v.value.toString().indexOf(needle) > -1
          );
        });
      }
    };

    const filterFn2 = (val, update) => {
      if (val === '') {
        update(() => {
          InputSearch[3].options = state.searches.allArt;
        });
      }
      if (isNaN(val)) {
        update(() => {
          const needle = val;
          InputSearch[3].options = state.searches.allArt.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        });
      } else {
        update(() => {
          const needle = val;
          InputSearch[3].options = state.searches.allArt.filter(
            (v) => v.value.toString().indexOf(needle) > -1
          );
        });
      }
    };

    const onSearch = (state2) => {
      if (state2.date == null) {
        NotifyCreate1('Date is not selected');
      } else if (state2.fromStore == null) {
        NotifyCreate1('From Store is not selected');
      } else if (state2.toStore == null) {
        NotifyCreate1('to Store is not selected');
      } else {
        async function asyncCall() {
          const response = await $api.inventory.FetchAPIINV(
              'priceDiscrepancyReportList',
              {
                sorttype: 1,
                fromLager: state2.fromStore.value,
                toLager: state2.toStore.value,
                fromDate: state2.date.startDate,
                toDate: state2.date.endDate,
                fromArt: state2.fromArt.value,
                toArt: state2.toArt.value,
                miAllChk: state2.shape.value === 1 ? true : false,
                miRecChk: state2.shape.value === 2 ? true : false,
                miOrdChk: state2.shape.value === 3 ? true : false,
              }
            ),
            charts = response['discrepancyInlist']['discrepancy-inlist'] || [];

          state.data = [];
          for (let i = 0; i < charts.length; i++) {
            const dataRow = {};
            const dataItem = charts[i];
            dataRow['datum'] =
              dataItem['datum'] == null || undefined || ''
                ? ' '
                : date.formatDate(dataItem['datum'], 'DD/MM/YYYY');
            dataRow['lager'] = dataItem['lager'];
            dataRow['docunr'] = dataItem['docunr'];
            dataRow['art'] = dataItem['art'];
            dataRow['bezeich'] = dataItem['bezeich'];
            dataRow['in-qty'] = dataItem['in-qty'];
            dataRow['amount'] = formatterMoney(dataItem['amount']);
            dataRow['epreis1'] = formatterMoney(dataItem['epreis1']);
            dataRow['epreis2'] = formatterMoney(dataItem['epreis2']);
            dataRow['lief'] = dataItem['lief'];
            dataRow['dlvnote'] = dataItem['dlvnote'];

            state.data.push(dataRow);
          }
        }
        asyncCall();
      }
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Incoming Price Discrepancy');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      filterFn,
      filterFn2,
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
      doPrint,
    };
  },
  components: {
    SearchMinimumStockOnHand: () =>
      import('./components/SearchIncomingPriceDiscrepancy.vue'),
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
