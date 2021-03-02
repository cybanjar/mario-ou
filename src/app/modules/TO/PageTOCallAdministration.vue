<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <searchIncoming @onSearch="onSearch"/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg" @click="doPrint">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
        <q-btn @click="onClickPostCallToBill" flat round class="q-mr-lg">
          <img :src="require('~/app/icons/TO/Icon-CallAdministration.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        class="table-accounting-date"
        :hide-bottom="hide_bottom"
      >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td :props="props" v-for="col in props.cols.filter(
            col => ['ExtNo', 'date', 'time', 'dialedNumber'].includes(col.name))"
          :key="col.name">{{col.value}}</q-td>
          <q-td @click="onClickDestination(props.row, 'onclick')" v-if="keyRow !== props.row['c-recid']">
              <div
              v-if="props.row.destination.trim().length <= 10"
              :props="props"   
              key="destination"
              >{{props.row.destination.trim()}}
              </div>
              <div
              v-else 
              :props="props" 
              key="destination">
                {{props.row.destination.substring(0,10)+'...'}}
                  <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
                    {{props.row.destination.trim()}}
                  </q-tooltip>
              </div>
          </q-td>
          <q-input autofocus
          @blur="onClickDestination(props.row, 'blur')" 
          borderless  style="width: 90px" 
          v-else 
          v-model="inputDes" dense />
          <q-td :props="props" v-for="col in props.cols.filter(
            col => [
            'PABXrate',
            'guestRate', 
            'duration', 
            'rmno', 
            'billno', 
            'print', 
            'pulse', 
            'line'].includes(col.name)
          )"
          :key="col.name">
          {{col.value}}
          </q-td>

        </q-tr>
      </template>
      </STable>
    </div>
    <dialogCallToBill :dataCallToBill="dataCallToBill"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import {Notify, date} from 'quasar'
import {tableHeaders} from './tables/callAdministration.table'
import { paramsCallsListGoBtn, paramsTable} from './utils/paramsCallAdministrations'
import {PrintJs} from '~/app/helpers/PrintJs'

export default defineComponent({
  setup(_, { root: { $api } }) {
    let callsListPrepare
    const state = reactive({
      isFetching: false,
      data: [],
      keyRow: '',
      inputDes: '',
      radioGroup: 1,
      dataCallToBill: {},
      hide_bottom : false
    });

    // HELPER 
    const NotifyCreate = (mess, col?, type?) => Notify.create({
      message: mess,
      color: col,
      type: type
    });

    // FETCH API
    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.telephoneOperator.fetchApiTelephoneOperator(api, body)
      if (GET_DATA.logicFlag) {        
        callsListPrepare = GET_DATA.logicFlag
      } 
      
      if (GET_DATA.strList['str-list']){
        const data = paramsTable(GET_DATA)
        state.data = GET_DATA.strList['str-list'].concat(data)  
        if (GET_DATA.strList['str-list'].length !== 0) {
          state.isFetching = false
          state.hide_bottom = true
        } else {
          state.isFetching = false
          NotifyCreate('Data not found', 'red')
        }
      }
    }
    onMounted(() => {
      FETCH_API('callsListPrepare')
    })

    const onSearch =  (val) => {
      state.radioGroup = val.groupRadio
      state.isFetching = true
      FETCH_API('callsListGoBtn', paramsCallsListGoBtn(val))
    }

    const onClickDestination = (row, e) => {
      if (state.radioGroup == 0) {        
        if (e !== 'blur') {        
          state.keyRow = row['c-recid']
          state.inputDes = row.destination.trim()
        } else {
          state.keyRow = ''
          FETCH_API('callsListUpdate')
        }
      }
    }

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Call Administration')
      }
    }

    const onClickPostCallToBill = () => {
      state.dataCallToBill = {
        dialogBill: true
      }
    }

    return {
      ...toRefs(state),
      onClickDestination,
      tableHeaders,
      onClickPostCallToBill,
      onSearch,
      doPrint,
      pagination: { page: 1, rowsPerPage: 0 }
    };
  },
  components: {
    searchIncoming: () => import('./components/SearchCallAdministration.vue'),
    dialogCallToBill: () => import('./components/dialogCalltoBill.vue')
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
