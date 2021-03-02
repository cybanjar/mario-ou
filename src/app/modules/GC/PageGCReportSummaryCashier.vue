<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchReportSummaryCashier @onSearch="onSearch" :search="search"/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" @click="doPrint"/>
        </q-btn>
      </div>
      <STable
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
        flat bordered
        id="printMe"
      >
        <template #header-cell-fibukonto="props">
            <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
          </template>
  
          <template #body-cell-fibukonto="props">
            <q-td :props="props" class="fixed-col left">{{ props.row.fibukonto }}</q-td>
          </template>
  
          <template #header-cell-actions="props">
            <q-th style="z-index: 4;" :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
          </template>
  
          <template v-slot:body="props">
              <q-tr :props="props" @click="onRowClick(props.row)" 
              :class="{
                selected : props.row.selected
              }">
               <q-td 
               :key="col.name" 
               :props="props" 
               v-for="col in props.cols">
                  {{col.value}} 
               </q-td>
              </q-tr>
          </template>
      </STable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  onMounted
} from '@vue/composition-api';
import {tableHeaders}  from './tables/ReportSummaryCashier.table'
import {data_table} from './utils/params.summaryCashier'
import {date} from 'quasar'
import {PrintJs} from '~/app/helpers/PrintJs'

export default defineComponent({
    setup(_, {root: {$api}}){
      const state = reactive({
          search: null,
          data: [],
          hide_bottom: false
      })
      
      const FETCH_DATA = async (api, body) => {
          const [GET_DATA, GET_COMMON ]= await Promise.all([
            $api.generalCashier.FetchAPI(api, body),
            $api.generalCashier.FetchCommon(api, body)
          ]) 
          switch(api){
            case 'getHTParam0':
                const _date = date.formatDate(GET_COMMON.fdate, 'YYYY, MM, DD') 
                state.search = new Date(_date)
                break;
            default:
              state.data = data_table(GET_DATA)
              if (state.data.length !== 0) {
                state.hide_bottom = true
              }
                break;
          }
      }

      const onSearch = (val) => {
        const _date = date.formatDate(val, 'YYYY-MM-DD')
        
        FETCH_DATA('summCashier', {
          "pvILanguage" : 1,
          "toDate" : _date,
          "shortFlag" : 1,
          "foreignFlag" : 240
        })
      }

        const onRowClick = (datarow) => {
          for(const i of state.data){
            i.selected = false
          }
          datarow['selected'] = true;
        }

      onMounted(() => {
          FETCH_DATA('getHTParam0', {
            "casetype" : 2,
            "inpParam" : 110
          })
      })

    function doPrint() {
      if (state.data.length !== 0) {   
        PrintJs(state.data, tableHeaders, 'Summary Cashier')     
      }
    }
      return {
          ...toRefs(state),
          tableHeaders,
          onSearch,
          onRowClick,
          doPrint
      }
    },
    components: {
        SearchReportSummaryCashier: () => import('./components/Report/SearchReportSummaryCashier.vue')
    }
})
</script>

<style lang="scss" scoped>
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