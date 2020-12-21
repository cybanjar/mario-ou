<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <searchIncoming :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn @click="addData" flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="25" />
        </q-btn>
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
        flat bordered
      >
        <template #body-cell-artnr="props">
          <q-td 
          :props="props" 
          :class="props.row['t-status'] == 2 ? 'bg-red text-white' : null"
          >{{props.row.artnr}}</q-td>
        </template>

        <template #header-cell-fibukonto="props">
          <q-th :props="props" class="fixed-col left">{{ props.col.label}}</q-th>
        </template>

        <template #body-cell-fibukonto="props">
          <q-td :props="props" class="fixed-col left">{{ props.row.fibukonto}}</q-td>
        </template>

        <template #header-cell-actions="props">
          <q-th :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="fixed-col right">
            <q-icon 
              v-if="props.row.einzelpreis !== props.row.price"
              name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list v-if="props.row.einzelpreis !== props.row.price">
                  <q-item 
                  :disable="props.row.appStr == 'Y' ? true :  false" 
                  clickable v-ripple 
                  @click="editItem(props.row)">
                    <q-item-section >Modify</q-item-section>
                  </q-item>
                  <q-item 
                  :disable=" props.row.appStr == 'Y' ? true : false " 
                  clickable v-ripple 
                  @click="insertOther(props.row)">
                    <q-item-section >Insert Other</q-item-section>
                  </q-item>
                  <q-item 
                  :disable="props.row.appStr == 'Y'?
                  props.row['t-status'] == 2 ? true : false : true" 
                  clickable v-ripple 
                  @click="outgoingStock(props.row)">
                    <q-item-section >Outgoing Stock</q-item-section>
                  </q-item>
                  <q-item 
                  :disable="props.row.appStr == 'Y' ? true : false"  
                  clickable v-ripple 
                  @click="deleteRow(props.row)">
                  <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
      </STable>
      <DialogTypeStore :dialog="dialog" @trans_code="trans_code"/>
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm">Are you sure delete the stock article {{1101002}} - Avocado ?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn @click="deleteData" flat label="Ok" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
import { tableHeaders, use_input1, use_input } from './tables/storeRequisition';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper'
import { Notify, date } from 'quasar';
import {users, store_req} from './utils/store'
import {data, departments, input_header, data_table} from './utils/params.store_req'
import {store} from '~/store'

export default defineComponent({
  setup(_, { root: { $api } }) {
    let rowDelete, vals, chart, recidLOphdr, groupp
    let user = users.users
    const state = reactive({
      isFetching: false,
      hide_bottom: false,
      searches: {
        departments: [],
        articelNumber: []
      },
      dialog: {
        dialog : false,
        data: [] as any,
        hide_butoom: false,
        dataCostCenterList: []
      },
      dialog1: true,
      dialogTransfer: false,
      transfer: null,
      data: [],
      insertData: [],
      editData: [],
      trueAndFalse: false,
      confirm: false,
      fromDept: '',
      toDept: '',
      keyApprove: '',
      editKey: ''
    });

      const notyfyCreate = (mess, col) => {
        return Notify.create({
                message: mess,
                color: col,
              });
      }

    
    const FETCH_DATA = async (api, body?) => {
      const [GET_DATA, GET_COMMON] = await Promise.all([
        $api.inventory.FetchAPIINV(api, body),
        $api.inventory.FetchCommon(api, body)
      ]) 
      switch (api) {
        case 'storeRequestPrepare':
          chart = GET_DATA
          store.commit.inv.SET_PREPARE(chart)
          const xii = departments(GET_DATA)
          input_header(GET_DATA, xii)
          state.searches.articelNumber = GET_DATA.tempLArtikel['temp-l-artikel']
          state.searches.departments = xii
          break;
        case 'storeReqPrepare':
          break;
        case 'storeReqInsPrepare':
          state.insertData = GET_DATA
          break;
        case 'chgStoreRequestLoadData':
          state.editData = GET_DATA
          break;
        case 'storeRequestInitDisp':
          recidLOphdr = GET_DATA.recidLOphdr
          break;
        case 'storeRequestNewLscheinnr':
          input_header(GET_DATA)
          break;
        case 'getHelpInvArticle':
          input_header(GET_COMMON)
          break;
        case 'storeRequestChgPrepare':
          store.commit.inv.SET_TABLE(GET_DATA)
          break;
        case 'getBediener':
          tBediener(GET_COMMON)
          break;
        case 'storeRequestCheckQty':
          if (GET_DATA.itsOk == 'false') {
            notyfyCreate(
              GET_DATA.msgStr, 'red'
            );
          } else {
            save_data()
          }
          break;
        case 'chgStoreRequestSaveData':
          console.log('sukses', GET_DATA)
          break;
        case 'selectCostDept1':
          state.dialog.dataCostCenterList = GET_COMMON.costList['cost-list'].map((items) => ({
            name: items.name,
            num: items.num,
            ['rec-id'] : items['rec-id'],
            selected : false
          }))
          break;
        case 'storeRequestCreateOpList1':
          const xi = store_req.prepare.GET_PRICE
          if(use_input1[1].value !== '' 
          && use_input1[1].value !== '') {
            state.dialog.data.push(data_table(GET_DATA, xi, groupp))
            if(state.dialog.data.length !== 0){
              state.dialog.hide_butoom = true
              for(const i of use_input1.filter(x => ![
                'Departement'
              ].includes(x.name))){
                i.value = ''
              }
              use_input[3].value = ''
            }
          }
          break;
        default:
          if(GET_DATA.itExist == 'true'){
          state.data = data(GET_DATA)
            if (state.data.length !== 0) {
              state.isFetching = false;
              state.hide_bottom = true;
            }
          } else {
            state.isFetching = false;
            Notify.create({
            type: 'negative',
            message: 'data not found'
        })
          }
          break;
      }
    }

    onMounted( () => {
      FETCH_DATA('storeRequestPrepare',{
        userInit: user.userInit
      })
      FETCH_DATA('storeReqPrepare')
      FETCH_DATA('storeRequestInitDisp')
      FETCH_DATA('selectCostDept1')
      FETCH_DATA('storeRequestChgPrepare', {
        userInit: user.userInit
      })
    });

    const tBediener = (value) => {
      const x = store_req.prepare.GET_PRICE[0]
      if (x.betriebsnr == 0) {
        FETCH_DATA('storeRequestCreateOpList1', {
          "opListArtnr": x.artnr,
          "opListFuellflag": value.tBediener['t-bediener'][0]['nr'],
          "opListStornogrund": "00000000000000000000",
          "currLager" : 1
        })
      }
    }

    const save_data = () => {
      FETCH_DATA('chgStoreRequestSaveData', {
        "opList" : {
          "op-list" : [{
               "anzahl0" : "500",
               "anzahl" : "1",
               "fibu" : "",
               "fibu10" : "",
               "sRecid" : 1214580
               }]
         },
        "sRecid" : use_input1[1].value['value'],
        "userInit" : user.userInit,
        "tLschein" : use_input[0].value,
        "releaseFlag" : true,
        "transferred" : true,
        "showPrice" : true
      })
    }

    const onSearch = (val) => {
      if (val.fromDept !== null && val.toDept !== null) {
        vals = val;
        state.isFetching = true;
        FETCH_DATA('storeReqCreateList', {
          fromDate: date.formatDate(val.date.start, 'MM/DD/YY'),
          toDate: date.formatDate(val.date.end, 'MM/DD/YY'),
          fromDept: val.fromDept.value,
          toDept: val.toDept.value,
          currLschein: val.ReqNumber == ''? ' ' : val.ReqNumber ,
          showPrice: true,
        })
      } else {
        Notify.create({
          type: 'negative',
          message: 'data not found'
        })
      }
    };
    const select = (val) => {
      state.dialogTransfer = true;
      state.dialog = val;
    };
    const close = (val) => {
      state.dialogTransfer = val;
      state.dialog = val;
    };

    function select1() {
      state.dialogTransfer = false;
      Notify.create({
        type: 'positive',
        message: 'success'
      })
    }


    const addData = () => {
      state.dialog.dialog = true
      state.keyApprove = ''
    }

    const editItem = (row) => {
      const data = row['stornogrund']
      if (data == '') {
      state.editKey = '1'
      } else {
      state.editKey = '2'
      }
      state.keyApprove = 'approve'
      state.dialogTransfer = true
      FETCH_DATA('chgStoreRequestLoadData', {
        userInit: '01',
        tDatum: date.formatDate(row.datum, 'MM/DD/YY'),
        tLschein: row.lscheinnr,
        tAmount: '0',
        lscheinnr: ''
      })
    }

    const insertOther = (row) => {
      state.keyApprove = ''
      const data = row
      if (data['stornogrund'] == '') {
        state.editKey = '1'
      } else {
        state.editKey = '2'
      }
      FETCH_DATA('storeReqInsPrepare', {
          userInit: '01',
          tDatum: date.formatDate(data.datum, 'MM/DD/YY'),
          tLschein: data.lscheinnr
        })
      state.dialogTransfer = true
    }

    const outgoingStock = (row) => {
      state.keyApprove = ''
      const data = row
      if (data['stornogrund'] == '') {
        state.editKey = '1'
      } else {
        state.editKey = '2'
      }
      FETCH_DATA('storeReqInsPrepare', {
        userInit: '01',
        tDatum: date.formatDate(data.datum, 'MM/DD/YY'),
        tLschein: data.lscheinnr
      })
      state.dialogTransfer = true
    }

    const deleteRow = (row) => {
      rowDelete = row
      state.confirm = true
    } 

    const sukses = () => {
        FETCH_DATA('storeReqCreateList', {
          fromDate: date.formatDate(vals.date.start, 'MM/DD/YY'),
          toDate: date.formatDate(vals.date.end, 'MM/DD/YY'),
          fromDept: vals.fromDept.value,
          toDept: vals.toDept.value,
          currLschein: vals.ReqNumber == ''? ' ' : vals.ReqNumber ,
          showPrice: true,
        })
    }

    const trans_code = (val, group) => {
      if(val == '1'){
        groupp = group
        FETCH_DATA('storeRequestNewLscheinnr', {
          lscheinnr: `R${chart.transdate
              .substring(2)
              .replace('-', '')
              .replace('-', '')}001`,
          s: `R${chart.transdate
              .substring(2)
              .replace('-', '')
              .replace('-', '')}`,
          recidLOphdr: recidLOphdr
        })
        FETCH_DATA('getHelpInvArticle', {
            currLager: 5,
            recipe: false,
            sorttype: '0',
            sArtnr: '0',
            sBezeich: ' ',
        })
      } else if(val == '2') {
        FETCH_DATA('getBediener', {
          userNo: '',
          userInit: users.users.userInit
        })
      } else if(val == '3') {
      let onhand, artNr, qty, hasil
      for(const i of state.dialog.data){
        artNr = i.articelNumber
        onhand = i.onhand
        qty = i.quantity
        if (parseInt(qty) < parseInt(onhand) || qty == '0') {
          hasil = parseInt(qty)
        }
      }
        FETCH_DATA('storeRequestCheckQty', {
          opList : {
            "op-list": [{
              artnr: artNr,
              anzahl: hasil,
              'lager-nr': use_input[1].value['value']
            }]
          }
        })
      }
    }


    return {
      ...toRefs(state),
      tableHeaders,
      addData,
      insertOther,
      outgoingStock,
      editItem,
      deleteRow,
      select1,
      onSearch,
      close,
      select,
      sukses,
      trans_code,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    searchIncoming: () => import('./components/SearchStoreRequisition.vue'),
    DialogTypeStore: () => import('./components/DialogTypeStoreReq.vue')
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
