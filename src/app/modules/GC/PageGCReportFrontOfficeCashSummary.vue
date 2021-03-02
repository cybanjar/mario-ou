<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchReportFrontOfficeCashSummary 
        @onSearch="onSearch" 
        @Summary="Summary"
        :search="search"/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" @click="doPrint" />
        </q-btn>
      </div>
      <STable
        v-if="(!sumary)"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        class="table-accounting-date"
        flat bordered
        :hide-bottom="hide_bottom"
        id="printMe"
      />
      <STable
        v-else
        :columns="columns"
        :data="dataSummary"
        :rows-per-page-options="[0]"
        class="table-accounting-date"
        flat bordered
        :hide-bottom="hide_bottom2"
      />
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
import {tableHeaders, columns}  from './tables/ReportFrontOfficeCashSummary.table'
import {data_map, data_table} from './utils/params.reportFrontOffice'
import {date} from 'quasar'
import {PrintJs} from '~/app/helpers/PrintJs'

export default defineComponent({
    setup(_, {root: {$api}}){
      let fromDate, summary1, cashArt
      const state = reactive({
        search: {
          username: [],
          date: null
        },
        data : [],
        hide_bottom: false,
        hide_bottom2: false,
        sumary: false,
        dataSummary: []
      })
      const FETCH_DATA = async (api, body?) => {
          const GET_DATA = await $api.generalCashier.FetchAPI(api, body)
          switch(api){
            case 'foDaysalePrepare':
              const _toDate = date.formatDate(GET_DATA.p110, 'YYYY, MM, DD')
              state.search.username = data_map(GET_DATA)
              state.search.date = new Date(_toDate)
              fromDate = GET_DATA.fromDate
              break;
            case 'foDaysaleList1':
              state.data = data_table(GET_DATA)
              summary1 = GET_DATA.summary1.summary1
              cashArt = GET_DATA.cashArt['cash-art']
              if(state.data.length !== 0){
                state.hide_bottom = true
              }
              break;
            default: 
              const data_summary = GET_DATA.outputList['output-list']
              data_summary.shift()
              data_summary.shift()
              const lengthdata = data_summary[0].str.split('').length
              let xi = ''
              let dataKu = ''
              for (let i = 0; i < lengthdata; i++) {
                xi += '='
              }
              for(const i of data_summary){
                if (i.str !== xi) {
                  const ixx = i.str.split(' ')
                  for(const ix of ixx){
                    if (ix !== '') {
                      dataKu += ix + ' '
                    }
                  }
                  dataKu += '+'
                }
              }
              if (state.dataSummary.length == 0) {
                dataKu.split('+').map(x => {
                  if (x !== '') {                  
                    const xi = x.split(' ')
                    const ix = {
                      username : xi[0],
                      usd: xi[1],
                      set: xi[2],
                      deposit: xi[3],
                      deposit2: xi[4],
                      ex1: xi[5],
                      ex2: xi[6],
                      ex3: xi[7],
                      total: xi[8]
                    }
                    state.dataSummary.push(ix)
                  }
                })
              }
              if (state.dataSummary.length !== 0) {
                state.hide_bottom2 = true
              }
              break;
          }
      }

      onMounted(() => {
        FETCH_DATA('foDaysalePrepare')
      })

      const Summary = (e) => {
        state.sumary = e
        state.dataSummary = []
         state.hide_bottom2 = false
      }

      const onSearch = (val) => {
        let _billDate = date.formatDate(state.search.date, 'YYYY-MM-DD')
        let dataBinelist = []
          if(val.checbox1){
            for(const i of state.search.username){
              dataBinelist.push(i.data)
            }
          } else {
            for(const i of val.cretedid){
              dataBinelist.push(i.data)
            }
          }
        if(val.checbox2){
          FETCH_DATA('foDaysaleList', {
            blineList:{
              'bline-list': dataBinelist,
            },
            summary1: {
              summary1: summary1
            },
            cashArt: {
              'cash-art': cashArt
            }
          })
        } else {
          let dataBinelist1 = []
          if(val.checbox1){
            for(const i of state.search.username){
              dataBinelist1.push(i.data)
            }
          } else {
            for(const i of val.cretedid){
              dataBinelist1.push(i.data)
            }
          }
          FETCH_DATA('foDaysaleList1', {
            blineList:{
              'bline-list': dataBinelist1,
            },
            pvILanguage: 1,
            shift: val.Shift.value,
            fromDate: fromDate,
            toDate: _billDate
          })
        }
      }

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Front Office Cash Summary')
      }
    }
      return {
        ...toRefs(state),
          tableHeaders,
          onSearch,
          Summary,
          columns,
          doPrint
      }
    },
    components: {
        SearchReportFrontOfficeCashSummary: () => import('./components/Report/SearchReportFrontOfficeCashSummary.vue')
    }
})
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
  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }

</style>