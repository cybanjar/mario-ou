<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOutletSoldMenu :searches="searches" @onSearch="onSearch" />
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
        :loading="isFetching"
        dense
        flat
        bordered
        :data="build"
        :columns="tableHeaders"
        id="printMe"
        separator="cell"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination"
      />
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
import { mapOU, mapGroup } from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';
// import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts;
    const state = reactive({
      isFetching: true,
      build: [],
      searches: {
        date: {start: (new Date()), end: (new Date())},
        // date: {
        //   startDate: '01-01-2019', 
        //   endDate: '14-01-2019',
        // },
        dataPrepare: {},
        deptList: [],
        fromDept: [],
        fromDeptVal: {},
        toDept: [],
        toDeptVal: {},
        categoryData: [],
        filteredCategoryData: [],
        sortByVal: { label: 'By Description', value: 1 },
        detailed: false,
        byFactor: false,
        allSub: true,
        sortType: 1,
        flagListDisable: true
      },
    });
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
        label: 'Quantity',
        field: 'qty',
        name: 'qty',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Percentage',
        field: 'proz1',
        name: 'proz1',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Unit Price',
        field: 'epreis',
        name: 'epreis',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Unit Cost',
        field: 'cost',
        name: 'cost',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Ratio',
        field: 'margin',
        name: 'margin',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Sales',
        field: 't-sales',
        name: 't-sales',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Cost',
        field: 't-cost',
        name: 't-cost',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Ratio',
        field: 't-margin',
        name: 't-margin',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Percentage',
        field: 'proz2',
        name: 'proz2',
        align: 'right',
        sortable: false,
        // format: (val) => (val == 0) ? '' : formatThousands(val),
      },
    ];
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('fbSalesCostsAnalPrepare', {
          fromDept: '1',
          toDept: '99',
        }),
      ]);
      responsePrepare = data || [];
      state.searches.dataPrepare = responsePrepare;
      const dataItem = responsePrepare.tWgrpdep['t-wgrpdep'];

      // selected item all sub group
      for(let i in dataItem) {
        dataItem[i]['selected'] = true;
        dataItem[i]['position'] = i;
      }
      state.searches.categoryData = dataItem;
      state.searches.filteredCategoryData = dataItem.slice();
      
      // state.searches.fromDept = mapGroup(
      //   responsePrepare.tHoteldpt['t-hoteldpt'],
      //   'depart',
      //   'num'
      // );
      // state.searches.toDept = mapGroup(
      //   responsePrepare.tHoteldpt['t-hoteldpt'],
      //   'depart',
      //   'num'
      // );

      const fdate = new Date(state.searches.dataPrepare['fromDate']);
      const toDate = new Date(state.searches.dataPrepare['toDate']);
      state.searches.date.start = fdate;
      state.searches.date.end = toDate;

      const deptList = responsePrepare.tHoteldpt['t-hoteldpt'];
      const allDept = [] as any;

      for (let i = 0; i<deptList.length; i++) {
        const datarow = deptList[i];
        const deptnum = deptList[i]['num'];
        const mindept = state.searches.dataPrepare['fromDept'];
        const maxdept = state.searches.dataPrepare['toDept'];

        if (deptnum >= mindept) {
          if (deptnum == maxdept) {
              allDept.push(datarow);
              break;
          } else {
              allDept.push(datarow);
          }
        } 
      }      

      state.searches.dataPrepare['tHoteldpt']['t-hoteldpt'] = allDept;
      state.searches.fromDept = mapOU(state.searches.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
      state.searches.toDept = mapOU(state.searches.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
      state.searches.deptList = state.searches.fromDept; 

      for (let i = 0; i<state.searches.fromDept.length; i++) {
        const currFromDept = state.searches.dataPrepare['fromDept'];
        if (currFromDept == state.searches.fromDept[i]['value']) {
          state.searches.fromDeptVal = state.searches.fromDept[i];
          break;
        }
      }

      for (let i = 0; i<state.searches.toDept.length; i++) {
        const currToDept = state.searches.dataPrepare['toDept'];
        if (currToDept == state.searches.toDept[i]['value']) {
          state.searches.toDeptVal = state.searches.toDept[i];
          break;
        }
      }
      state.isFetching = false;
    });

    const onSearch = (state2) => {
      console.log('Request : ', 
        {
            subgrList: {
              'subgr-list': state2.filteredCategoryData,
            },
            sorttype: state2.sortType,
            fromDept: state2.fromDeptVal.value,
            toDept: state2.toDeptVal.value,
            dstore: '0',
            ldryDept: state.searches.dataPrepare['ldryDept'],
            allSub: true,
            fromDate: date.formatDate(state2['date']['start'], 'MM/DD/YYYY'),
            toDate: date.formatDate(state2['date']['end'], 'MM/DD/YYYY'),
            fact1: '1',
            exchgRate: state.searches.dataPrepare['exchgRate'],
            vatIncluded: state.searches.dataPrepare['vatIncluded'],
            miSubgrp: true,
            detailed: state2.detailed,
            currSort: state2.sortByVal.value,
            shortFlag: true,
          }
      );
      
      async function asyncCall() {
        const dataOutletSoldMenuList = await Promise.all([
          $api.outlet.getOUTableList('fbSalesCostsAnalList', {
            subgrList: {
              'subgr-list': state2.filteredCategoryData,
            },
            sorttype: state2.sortType,
            fromDept: state2.fromDeptVal.value,
            toDept: state2.toDeptVal.value,
            dstore: '0',
            ldryDept: state.searches.dataPrepare['ldryDept'],
            allSub: true,
            fromDate: date.formatDate(state2['date']['start'], 'MM/DD/YYYY'),
            toDate: date.formatDate(state2['date']['end'], 'MM/DD/YYYY'),
            fact1: '1',
            exchgRate: state.searches.dataPrepare['exchgRate'],
            vatIncluded: state.searches.dataPrepare['vatIncluded'],
            miSubgrp: true,
            detailed: state2.detailed,
            currSort: state2.sortByVal.value,
            shortFlag: true,
          }),
        ]);
        charts = dataOutletSoldMenuList[0].fbCostAnalyst['fb-cost-analyst'] || [];
        state.build = charts;
      }
      asyncCall();
    };

    function doPrint() {
      if (state.build.length !== 0) {  
        PrintJs(state.build, tableHeaders, 'Outlet Sold menu');
      }
    }
    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 10,
      },
      doPrint
    };
  },
  components: {
    searchOutletSoldMenu: () => import('./components/SearchOutletSoldMenu.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
.mystickyvirtscrolltable {
  height: 410px;
}
</style>