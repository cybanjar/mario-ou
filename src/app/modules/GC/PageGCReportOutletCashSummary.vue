<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchReportOutletCashSummary :search="search" @onSearch="onSearch"/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round @click="doPrint">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
        flat bordered
      >
      </STable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  onMounted,
} from '@vue/composition-api';
import {tableHeaders}  from './tables/ReportOutletCashSummary.table'
import {outletcashsummary, data_map, oprtions, table_data} from './utils/params.reportOutletCashSummary'
import {date} from 'quasar'
import {PrintJs} from '~/app/helpers/PrintJs'

export default defineComponent({
    setup(_, {root: {$api}}){
      const state = reactive({
        data : [],
        hide_bottom: false,
        search: {
          date: null,
          createdId: [],
          departement: [],
          exchgRate: 0,
          oprtions: [],
        }
      })

      const FETCH_API = async (api, body?) => {
        const GET_DATA = await $api.generalCashier.FetchOU(api, body)
        switch (api) {
          case 'restdayMercurePrepare':            
            const datadate = date.formatDate(GET_DATA.fromDate, 'YYYY, MM, DD')
            state.search.date = new Date(datadate),
            state.search.createdId = data_map(GET_DATA)
            state.search.departement = outletcashsummary(GET_DATA)
            state.search.exchgRate = GET_DATA.exchgRate
            state.search.oprtions = oprtions
            break;
          default:
            state.data = table_data(GET_DATA)
            if (state.data.length !== 0) {
              state.hide_bottom = true
            }
            break;
        }
      }

      onMounted(() => {
        FETCH_API('restdayMercurePrepare')
      })

      const onSearch = (value) => {
        let dataBinelist = []
        for (const x of value.cretedid) {
          dataBinelist.push(x.data)
        }
        
        FETCH_API('restdayMercureBtnGo', {
          blineList:{
            'bline-list': dataBinelist,
          },
          shift: value.shift.value,
          fromDate: date.formatDate(value.date, 'MM/DD/YY'),
          exchgRate: state.search.exchgRate
        })
      }

    function doPrint() {
      if (state.data.length !== 0) {     
        PrintJs(state.data, tableHeaders, 'Outlet Cash Summary')   
      }
    }
      return {
        ...toRefs(state),
        tableHeaders,
        onSearch,
        doPrint
      }
    },
    components: {
        SearchReportOutletCashSummary: () => import('./components/Report/SearchReportOutletCashSummary.vue')
    }
})
</script>