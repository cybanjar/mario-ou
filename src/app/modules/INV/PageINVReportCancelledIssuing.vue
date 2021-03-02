<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchCancelledIssuing :searches="searches" @onSearch="onSearch" />
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
import { map_articelnumber } from './utils/params.incomingstockissuedwithpo';
import {
  mapWithadjuststore,
  mapWithadjustmain,
} from '~/app/helpers/mapSelectItems.helpers';
import { tableHeaders } from './tables/CancelledIssuing.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { date } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      data: [],
      showPrice: '',
      searches: {
        availLUntergrup: false,
        departments: [],
        allArt: [],
        allocation: [],
        store: [],
        option: [
          { label: 'Display Material & Engineering Articles', value: 0 },
          { label: 'Material Articles Only', value: 1 },
          { label: 'Engineering Articles Only', value: 2 },
        ],
        pilihan: [
          {
            label: 'By Document Number',
            value: 'document',
          },
          {
            label: 'By Cost Allocation',
            value: 'cost',
          },
          {
            label: 'By Article',
            value: 'article',
          },
          {
            label: 'By Date',
            value: 'date',
          },
        ],
      },
    });

    onMounted(async () => {
      const [
        resPrepare,
        resStorage,
        resAlloc,
        resGroup,
        resArt,
      ] = await Promise.all([
        $api.inventory.FetchAPIINV('cancelStockoutPrepare'),
        $api.inventory.FetchAPIINV('getStorage'),
        $api.inventory.FetchCommon('selectCostDept1'),
        $api.inventory.FetchAPIINV('getInvMainGroup'),
        $api.inventory.FetchCommon('getAllArtikel', {
          sorttype: '1',
          lastArt: '0',
          lastArt1: '0',
        }),
      ]);

      const allocation = resAlloc.allocList['alloc-list'];
      allocation.unshift({ 'rec-id': 0, name: 0, fibu: 0, bezeich: 'ALL' });
      state.searches.allocation = mapAllocation(allocation, 'fibu');
      state.showPrice = resPrepare.showPrice;
      state.searches.availLUntergrup = resPrepare.availLUntergrup;
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

    const mapAllocation = (items, prefix) =>
      items
        ? items.map((item) => ({
            label: `${item[prefix]} - ${item.bezeich}`,
            value: item['fibu'],
          }))
        : [];

    const onSearch = (state2) => {      
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV(
            'cancelStockoutList',
            {
              fromGrp: state2.departments.value,
              miAllocChk: state2.by == 'cost' ? true : false,
              miArticleChk: state2.by == 'article' ? true : false,
              miDocuChk: state2.by == 'document' ? true : false,
              miDateChk: state2.by == 'date' ? true : false,
              fromLager: state2.fromstore.value,
              toLager: state2.tostore.value,
              fromDate: state2.date.startDate,
              toDate: state2.date.endDate,
              fromArt: state2.fromarticle.value,
              toArt: state2.toarticle.value,
              showPrice: state.showPrice,
              costAcct: state2.alloc.value == 0 ? ' ' : state2.alloc.value,
              mattype: state2.display === null ? 0 : state2.display.value,
            }
          ),
          charts = response || [];

        const pbookList = charts.cancelStockout['cancel-stockout'];

        state.data = mapping(pbookList);
      }
      asyncCall();
    };

    const mapping = (data) => {
      return data.map((items) => ({
        datum: date.formatDate(items.datum, 'DD/MM/YYYY'),
        lager: items.lager,
        lscheinnr: items.lscheinnr,
        artnr: items.lscheinnr === '' ? ' ' : items.artnr,
        bezeich: items.bezeich === 'T O T A L' ? 'Total' : items.bezeich,
        'out-qty':
          items.bezeich == ''
            ? ' '
            : items['out-qty'] == 0
            ? ' '
            : items['out-qty'],
        'avrg-price':
          items.bezeich == ''
            ? ' '
            : items['avrg-price'] == 0
            ? ''
            : formatterMoney(items['avrg-price']),
        amount: items.bezeich == '' ? ' ' : formatterMoney(items.amount),
        id: items.id,
        reason: items.reason,
      }));
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Cancelled Incoming');
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
    SearchCancelledIssuing: () =>
      import('./components/SearchCancelledIssuing.vue'),
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
