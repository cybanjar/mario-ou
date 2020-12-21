<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchDepartmentCalls :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
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
import { tableHeaders } from './tables/departmentCalls.table';
import { Notify, date } from 'quasar';


export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: false,
      data: [],
      doubleCurrency: '',
      priceDecimal: '',
      cost1: '',
      cost2: '',
      hide_bottom: false,
      stateCostCenter: [] as any,
      searches: {
        departments: [],
      },
    });

    const mapWithNum = (data) => {
      return data.map(x => ({
          label: `${x.name}-${x.num}`,
          value: x.num
      }))
    }

    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.telephoneOperator
      .fetchApiTelephoneOperator(api, body)
      switch (api) {
        case 'deptCallsPrepare':          
          state.stateCostCenter = GET_DATA.costList["cost-list"];
          state.doubleCurrency = GET_DATA.doubleCurrency;
          state.priceDecimal = GET_DATA.priceDecimal;
          state.cost1 = GET_DATA.cost1;
          state.cost2 = GET_DATA.cost2;
          const cc= GET_DATA.costList['cost-list'];
          const status = cc
          status.unshift({ num: 0, name: 'ALL' });
          state.searches.departments = mapWithNum(status);
          state.isFetching = false;
          break;
      
        default:
          charts = GET_DATA || [];
          state.data = charts.outputList['output-list'];
          if(charts.length !== 0){
            state.hide_bottom = true
          }
          break;
      }

    }

    onMounted(() => {
      FETCH_API('deptCallsPrepare')      
    });

    const onSearch = (state2) => {
      FETCH_API('deptCallsList', {
        costList: {'cost-list': state.stateCostCenter},
        sorttype: state2.shape,
        costCenter: state2.fromCostCenter.value,
        toCc: state2.toCostCenter.value,
        priceDecimal: state.priceDecimal,
        fromDate:  date.formatDate(state2.date.start, 'DD/MM/YYYY'),
        toDate:  date.formatDate(state2.date.end, 'DD/MM/YYYY'),
        doubleCurrency: state.doubleCurrency,
      })
    };
    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    SearchDepartmentCalls: () => import('./components/SearchDepartmentCalls.vue'),
  },
});
</script>

<style lang="scss" scoped>
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
