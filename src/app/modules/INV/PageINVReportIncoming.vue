<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchIncoming :searches="searches" @onSearch="onSearch" />
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
// import { labels, getLabels } from '~/app/helpers/getLabels.helpers';
import { date } from 'quasar';
import { tableHeaders } from './tables/incoming.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '../../helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      lKreditRecid: '',
      longDigit: '',
      showPriceprepare: '',
      searches: {
        departments: [],
        store: [],
      },
    });

    onMounted(async () => {
      const [resPrepare, resMaingroup, resStore] = await Promise.all([
        $api.inventory.FetchAPIINV('receivingReportPrepare', {
          userInit: '01',
          apRecid: '0',
        }),
        $api.inventory.FetchAPIINV('getInvMainGroup'),
        $api.inventory.FetchAPIINV('getStorage'),
      ]);

      state.lKreditRecid = resPrepare.lKreditRecid;
      state.longDigit = resPrepare.longDigit;
      state.showPriceprepare = resPrepare.showPrice;
      state.searches.departments = mapWithadjustmain(
        resMaingroup.tLHauptgrp['t-l-hauptgrp'],
        'endkum'
      );
      state.searches.store = mapWithadjuststore(resStore.tLLager['t-l-lager'], [
        'lager-nr',
      ]);
      state.isFetching = false;
    });

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV(
            'receivingReportList',
            {
              pvILanguage: '1',
              lastArtnr: '?',
              lieferantRecid: state2.all ? '0' : state2.supplierVal,
              lKreditRecid: state.lKreditRecid,
              longDigit: state.longDigit,
              showPrice: state.showPriceprepare,
              store: state2.store.value,
              allSupp: state2.all,
              sorttype: state2.shape,
              fromGrp: state2.fromMain.value,
              toGrp: state2.toMain.value,
              fromDate: state2.date.startDate,
              toDate: state2.date.endDate,
              userInit: '01',
              apRecid: '0',
              taxcodeList: {
                'taxcode-list': [
                  {
                    taxcode: '',
                    taxamount: '0',
                  },
                ],
              },
            }
          ),
          charts = response['strList']['str-list'] || [];
        state.data = [];

        for (let i = 0; i < charts.length; i++) {
          const dataRow = {};
          const dataItem = charts[i];

          dataRow['DATE'] =
            dataItem['DATE'] == null || undefined || ''
              ? ' '
              : date.formatDate(dataItem['DATE'], 'DD/MM/YYYY');
          dataRow['st'] = dataItem['st'] == 0 ? '' : dataItem['st'];
          dataRow['supplier'] = dataItem['supplier'];
          dataRow['artnr'] = dataItem['artnr'] == 0 ? '' : dataItem['artnr'];
          dataRow['DESCRIPTION'] = dataItem['DESCRIPTION'];
          dataRow['d-unit'] = dataItem['d-unit'];
          dataRow['price'] =
            dataItem['price'] == 0 ? '' : formatterMoney(dataItem['price']);
          dataRow['inc-qty'] =
            dataItem['inc-qty'] == 0 ? '' : dataItem['inc-qty'];
          dataRow['amount'] =
            dataItem['amount'] == 0 ? '' : formatterMoney(dataItem['amount']);
          dataRow['docu-no'] = dataItem['docu-no'];
          dataRow['ID'] = dataItem['ID'];
          dataRow['deliv-note'] = dataItem['deliv-note'];
          dataRow['invoice-nr'] = dataItem['invoice-nr'];

          state.data.push(dataRow);
        }
      }
      asyncCall();
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Incoming');
      }
    }

    const groupHeaders = (cols) => cols.filter((col) => col.name !== 'actions');
    const actionHeader = (cols) => cols.find((col) => col.name === 'actions');
    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      groupHeaders,
      actionHeader,
      pagination: { page: 1, rowsPerPage: 0 },
      doPrint,
    };
  },
  components: {
    searchIncoming: () => import('./components/SearchIncoming.vue'),
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
