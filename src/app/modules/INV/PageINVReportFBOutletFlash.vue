<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchFBOutletFlash :searches="searches" @onSearch="onSearch" />
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
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '../../helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      food: '',
      bev: '',
      date2: '',
      date1: '',
      billDate: '',
      doubleCurrency: '',
      foreignNr: '',
      exchgRate: '',
      searches: {
        departments: [],
        store: [],
      },
    });

    onMounted(async () => {
      const [resDepart] = await Promise.all([
        $api.inventory.FetchAPIINV('fbFlash1Prepare'),
      ]);

      state.food = resDepart.food;
      state.bev = resDepart.bev;
      state.date2 = resDepart.date2;
      state.date1 = resDepart.date1;
      state.billDate = resDepart.billDate;
      state.doubleCurrency = resDepart.doubleCurrency;
      state.foreignNr = resDepart.foreignNr;
      state.exchgRate = resDepart.exchgRate;

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
        PrintJs(state.data, tableHeaders, 'FB Outlet Flash');
      }
    }

    const tableHeaders = [
      {
        label: 'Transfer to Storage',
        field: 'descr',
        name: 'descr',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Cost Allocation',
        field: 'cost-alloc',
        name: 'cost-alloc',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Today Consumed',
        field: 'today-consume',
        name: 'today-consume',
        align: 'right',
        sortable: false,
      },
      {
        label: 'MTD Consumed',
        field: 'mtd-consume',
        name: 'mtd-consume',
        align: 'right',
        sortable: false,
      },
    ];
    const onSearch = (state2) => {
      console.log('test', state2);

      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('fbFlash1List', {
            pvILanguage: '1',
            fromGrp: state2.departments.value,
            food: state.food,
            mainStorage: '1',
            fStore: state2.fromstore.value,
            tStore: state2.tostore.value,
            date1: date.formatDate(state2.date, 'YYYY/MM/DD'),
            date2: state.date2,
            foreignNr: state.foreignNr,
            exchgRate: state.exchgRate,
            doubleCurrency: state.doubleCurrency,
          }),
          charts = response.outputList['output-list'] || [];
          
        state.data = mapping(charts);
      }
      asyncCall();
    };

    const mapping = (data) => {
      return data.map((items) => ({
        descr: items.s.substring(0, 23),
        'cost-alloc': items.s.substring(24, 55),
        'today-consume': items.s.substring(60, 78),
        'mtd-consume': items.s.substring(80, 90),
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
    searchFBOutletFlash: () => import('./components/SearchFBOutletFlash.vue'),
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
