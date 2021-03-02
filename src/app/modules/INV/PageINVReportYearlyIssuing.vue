<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchYearlyIssuing :searches="searches" @onSearch="onSearch" />
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
import { mapWithadjustmain } from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      ciDate: '',
      sorttype: '',
      searches: {
        departments: [],
      },
    });

    onMounted(async () => {
      const [resDepart] = await Promise.all([
        $api.inventory.FetchAPIINV('stockOutAnnualPrepare'),
      ]);

      state.ciDate = resDepart.matGrp;
      state.searches.departments = mapWithadjustmain(
        resDepart.tLHauptgrp['t-l-hauptgrp'],
        'endkum'
      );

      state.isFetching = false;
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Yearly Issuing');
      }
    }

    const tableHeaders = [
      {
        label: 'Article Number',
        field: 'artnr',
        name: 'artnr',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Description',
        field: 'bezeich',
        name: 'bezeich',
        align: 'left',
        sortable: false,
      },
      {
        label: 'January',
        field: 'qty1',
        name: 'qty1',
        sortable: false,
      },
      {
        label: 'February',
        field: 'qty2',
        name: 'qty2',
        align: 'right',
        sortable: false,
      },
      {
        label: 'March',
        field: 'qty3',
        name: 'qty3',
        align: 'right',
        sortable: false,
      },
      {
        label: 'April',
        field: 'qty4',
        name: 'qty4',
        align: 'right',
        sortable: false,
      },
      {
        label: 'May',
        field: 'qty5',
        name: 'qty5',
        align: 'right',
        sortable: false,
      },
      {
        label: 'June',
        field: 'qty6',
        name: 'qty6',
        align: 'right',
        sortable: false,
      },
      {
        label: 'July',
        field: 'qty7',
        name: 'qty7',
        align: 'right',
        sortable: false,
      },
      {
        label: 'August',
        field: 'qty8',
        name: 'qty8',
        sortable: false,
      },
      {
        label: 'September',
        field: 'qty9',
        name: 'qty9',
        sortable: false,
      },
      {
        label: 'October',
        field: 'qty10',
        name: 'qty10',
        sortable: false,
      },
      {
        label: 'November',
        field: 'qty11',
        name: 'qty11',
        sortable: false,
      },
      {
        label: 'December',
        field: 'qty12',
        name: 'qty12',
        sortable: false,
      },
      {
        label: 'Total',
        field: 'tot-qty',
        name: 'tot-qty',
        sortable: false,
      },
    ];

    const onSearch = (state2) => {
      state.sorttype = state2.shape;
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV(
            'stockOutAnnualList',
            {
              pvILanguage: 1,
              sorttype: state2.shape,
              fromGrp: state2.departments.value,
              mm: date.formatDate(state2.date, 'MM'),
              yy: date.formatDate(state2.date, 'YY'),
            }
          ),
          charts = response.strList['str-list'] || [];
          
        const pbookList = maps(charts);
        state.data = pbookList;
      }
      asyncCall();
    };

    const maps = (items) =>
      items
        ? items.map((item) => ({
            num: item.num,
            artnr: item.artnr,
            bezeich: item.bezeich,
            qty1:
              state.sorttype == '0'
                ? item.qty[0]
                : state.sorttype == '1'
                ? item.avrg[0]
                : item.amt[0],
            qty2:
              state.sorttype == '0'
                ? item.qty[1]
                : state.sorttype == '1'
                ? item.avrg[1]
                : item.amt[1],
            qty3:
              state.sorttype == '0'
                ? item.qty[2]
                : state.sorttype == '1'
                ? item.avrg[2]
                : item.amt[2],
            qty4:
              state.sorttype == '0'
                ? item.qty[3]
                : state.sorttype == '1'
                ? item.avrg[3]
                : item.amt[3],
            qty5:
              state.sorttype == '0'
                ? item.qty[4]
                : state.sorttype == '1'
                ? item.avrg[4]
                : item.amt[4],
            qty6:
              state.sorttype == '0'
                ? item.qty[5]
                : state.sorttype == '1'
                ? item.avrg[5]
                : item.amt[5],
            qty7:
              state.sorttype == '0'
                ? item.qty[6]
                : state.sorttype == '1'
                ? item.avrg[6]
                : item.amt[6],
            qty8:
              state.sorttype == '0'
                ? item.qty[7]
                : state.sorttype == '1'
                ? item.avrg[7]
                : item.amt[7],
            qty9:
              state.sorttype == '0'
                ? item.qty[8]
                : state.sorttype == '1'
                ? item.avrg[8]
                : item.amt[8],
            qty10:
              state.sorttype == '0'
                ? item.qty[9]
                : state.sorttype == '1'
                ? item.avrg[9]
                : item.amt[9],
            qty11:
              state.sorttype == '0'
                ? item.qty[10]
                : state.sorttype == '1'
                ? item.avrg[10]
                : item.amt[10],
            qty12:
              state.sorttype == '0'
                ? item.qty[11]
                : state.sorttype == '1'
                ? item.avrg[11]
                : item.amt[11],
            'tot-qty':
              state.sorttype == '0'
                ? item['tot-qty']
                : state.sorttype == '2'
                ? item['tot-amt']
                : '',
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
    SearchYearlyIssuing: () => import('./components/SearchYearlyIssuing.vue'),
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
