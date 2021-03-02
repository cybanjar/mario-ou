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
        <q-btn flat round @click="doPrint">
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
        flat
        bordered
      >
        <template #header="props">
          <q-tr style="height: 40px" :props="props">
            <q-th
              :props="props"
              v-for="col in props.cols.filter(
                (items) => !['actions'].includes(items.name)
              )"
              :key="col.name"
            >
              {{ col.label }}
            </q-th>
            <q-th
              style="z-index: 3"
              :props="props"
              key="actions"
              class="fixed-col right"
              >{{ props.label }}</q-th
            >
          </q-tr>
        </template>

        <template #body="props">
          <q-tr
            :props="props"
            @click="onRowClick(props.row)"
            :class="{
              selected: props.row.selected,
            }"
          >
            <q-td
              :key="col.name"
              :props="props"
              v-for="col in props.cols.filter((items) =>
                ['datum', 'lscheinnr', 'f-bezeich', 'deptName'].includes(
                  items.name
                )
              )"
            >
              {{ col.value }}
            </q-td>
            <q-td
              :props="props"
              key="artnr"
              :class="props.row['t-status'] == 2 ? 'bg-red text-white' : null"
            >
              {{ props.row.artnr }}
            </q-td>
            <q-td
              :key="col.name"
              :props="props"
              v-for="col in props.cols.filter(
                (items) =>
                  ![
                    'datum',
                    'lscheinnr',
                    'f-bezeich',
                    'deptName',
                    'artnr',
                    'actions',
                  ].includes(items.name)
              )"
            >
              {{ col.value }}
            </q-td>
            <q-td class="fixed-col right" :props="props.row.actions">
              <q-icon
                v-if="props.row.einzelpreis !== props.row.price"
                name="mdi-dots-vertical"
              >
                <q-menu
                  :props="props"
                  auto-close
                  anchor="bottom right"
                  self="top right"
                >
                  <q-list
                    v-if="props.row.einzelpreis !== props.row.price"
                    :props="props"
                  >
                    <q-item
                      :disable="props.row.appStr == 'Y' ? true : false"
                      clickable
                      v-ripple
                      @click="editItem(props.row)"
                    >
                      <q-item-section>Modify</q-item-section>
                    </q-item>
                    <q-item
                      :disable="props.row.appStr == 'Y' ? true : false"
                      clickable
                      v-ripple
                      @click="insertOther(props.row)"
                    >
                      <q-item-section>Insert Other</q-item-section>
                    </q-item>
                    <q-item
                      :disable="
                        props.row.appStr == 'Y'
                          ? props.row['t-status'] == 2
                            ? true
                            : false
                          : true
                      "
                      clickable
                      v-ripple
                      @click="outgoingStock(props.row)"
                    >
                      <q-item-section>Outgoing Stock</q-item-section>
                    </q-item>
                    <q-item
                      :disable="props.row.appStr == 'Y' ? true : false"
                      clickable
                      v-ripple
                      @click="deleteRow(props.row)"
                    >
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </STable>
      <DialogTypeStore :dialog="dialog" @trans_code="trans_code" />
      <AddInterStoreTransfer
        :child_dialog="child_dialog"
        @addInsert="addInsert"
        @approved="approved"
        @saveData="saveDataModify"
      />
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm"
              >Are you sure delete the stock article {{ 1101002 }} - Avocado
              ?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              @click="deleteData"
              flat
              label="Ok"
              color="primary"
              v-close-popup
            />
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
import { tableHeaders, use_input1, use_input, tableDialogNew } from './tables/storeRequisition';
import {use_inputEDIT, use_inputEDIT1 } from './Input/InputStoreReq'
import {my_date} from './utils/MyDate'
import { Notify, date } from 'quasar';
import { users, store_req } from './utils/store';
import { PrintJs } from '~/app/helpers/PrintJs';
import {
  data,
  departments,
  input_header,
  data_table,
  data_modify,
  dataTable_modify,
  deletevalueinput,
  data_insert,
  data_initialstock,
} from './utils/params.store_req';
import { store } from '~/store';
import moment from 'moment';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let rowDelete,
      vals,
      chart,
      recidLOphdr,
      groupp,
      approve,
      dataRowEdit,
      keyDataModify;

    let user = users.users;
    const state = reactive({
      isFetching: false,
      hide_bottom: false,
      searches: {
        departments: [],
        articelNumber: [],
      },
      dialog: {
        dialog: false,
        data: [] as any,
        hide_butoom: false,
        dataCostCenterList: [],
        loadingSave: false,
        dialog_child1: true,
      },
      child_dialog: {
        dialog: false,
        actual: ['From Store', 'To Store'],
        actual1: ['Total Amount'],
        tableDialog: [],
        keyApprove: 'approve',
        data: [],
        hide_bottom: false,
        valApprove: false,
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
    });

    const notyfyCreate = (mess, col, type?) => {
      return Notify.create({
        type: type,
        message: mess,
        color: col,
      });
    };

    const actionNotify = (mess) => {
      return Notify.create({
        message: mess,
        color: 'primary',
        position: 'center',
        timeout: 0,
        actions: [
          {
            label: 'No',
            color: 'white',
            handler: () => {
              /* ... */
            },
            size: 'sm',
          },
          {
            label: 'Yes',
            color: 'white',
            handler: () => {
              state.child_dialog.dialog = false;
              const data = state.insertData as any;
              FETCH_DATA('sStockoutBtnGo', {
                opList: {
                  'op-list': data.opList['op-list'],
                },
                pvILanguage: '1',
                outType: data.outType,
                currLager: data.currLager,
                // "jobnr": "0",
                // "costAcct" : "",
                // "transdate" : "01/14/19",
                // "tDatum" : "01/14/19",
                transfered: 'true',
                tLschein: data.lscheinnr,
                toStock: '4',
                lscheinnr: data.lscheinnr,
                bedienerNr: '1',
                qty: '1',
                tAmount: data.tAmoun,
              });
            },
            size: 'sm',
          },
        ],
      });
    };

    const FETCH_DATA = async (api, body?, ky?) => {
      const [GET_DATA, GET_COMMON] = await Promise.all([
        $api.inventory.FetchAPIINV(api, body),
        $api.inventory.FetchCommon(api, body),
      ]);
      switch (api) {
        case 'storeRequestPrepare':
          chart = GET_DATA;
          store.commit.inv.SET_PREPARE(chart);
          const xii = departments(GET_DATA);
          input_header(GET_DATA, xii);
          state.searches.articelNumber =
            GET_DATA.tempLArtikel['temp-l-artikel'];
          state.searches.departments = xii;
          break;
        case 'storeReqPrepare':
          break;
        case 'storeReqInsPrepare':
          state.insertData = GET_DATA;
          if (ky == 'insert') {
            data_insert(GET_DATA, dataRowEdit);
          } else {
            data_initialstock(GET_DATA, dataRowEdit);
          }
          state.child_dialog.data = dataTable_modify(GET_DATA);
          if (state.child_dialog.data.length !== 0) {
            state.child_dialog.hide_bottom = true;
          } else {
            state.child_dialog.hide_bottom = false;
          }
          break;
        case 'chgStoreRequestLoadData':
          state.editData = GET_DATA;
          approve = GET_DATA.opList['op-list'][0];
          state.child_dialog.data = dataTable_modify(GET_DATA);
          if (state.child_dialog.data.length !== 0) {
            state.child_dialog.hide_bottom = true;
          } else {
            state.child_dialog.hide_bottom = false;
          }
          data_modify(GET_DATA, dataRowEdit);
          break;
        case 'storeRequestInitDisp':
          recidLOphdr = GET_DATA.recidLOphdr;
          break;
        case 'storeRequestNewLscheinnr':
          input_header(GET_DATA);
          break;
        case 'getHelpInvArticle':
          input_header(GET_COMMON);
          break;
        case 'storeRequestChgPrepare':
          store.commit.inv.SET_TABLE(GET_DATA);
          if (GET_DATA.showPrice == 'true') {
            state.child_dialog.tableDialog = tableDialogNew;
          } else {
            state.child_dialog.tableDialog = tableDialogNew.filter(
              (col: any) => !['amount', 'unitPrice'].includes(col.field)
            );
          }
          break;
        case 'getBediener':
          tBediener(GET_COMMON, ky);
          break;
        case 'storeRequestCheckQty':
          if (GET_DATA.itsOk == 'false') {
            notyfyCreate(GET_DATA.msgStr, 'red');
          } else {
            if (ky !== 'modify') {
              save_data();
            } else {
              save_modify();
            }
          }
          break;
        // Save DATA
        case 'storeRequestBtnGo':
          state.dialog.loadingSave = true;
          setTimeout(() => {
            state.dialog.loadingSave = false;
            state.dialog.dialog_child1 = false;
            if (GET_DATA.opList) {
              notyfyCreate('Sukses', 'green', 'positive');
              sukses();
            } else {
              notyfyCreate('Gagal', 'red');
            }
          }, 1000);
          break;
        // save Modify
        case 'chgStoreRequestSaveData':
          break;
        case 'selectCostDept1':
          state.dialog.dataCostCenterList = GET_COMMON.costList[
            'cost-list'
          ].map((items) => ({
            name: items.name,
            num: items.num,
            ['rec-id']: items['rec-id'],
            selected: false,
          }));
          break;
        case 'storeRequestCreateOpList1':
          const xi = store_req.prepare.GET_PRICE;
          if (ky !== 'addInsert') {
            if (use_input1[2].value !== '') {
              state.dialog.data.push(data_table(GET_DATA, xi, groupp));
              if (state.dialog.data.length !== 0) {
                state.dialog.hide_butoom = true;
                for (const i of use_input1.filter(
                  (x) => !['Departement', 'Date'].includes(x.name)
                )) {
                  i.value = '';
                }
                use_input[2].value = '';
              }
            }
            if (use_input1[3].value !== '') {
              state.dialog.data.push(data_table(GET_DATA, xi, groupp));
              if (state.dialog.data.length !== 0) {
                state.dialog.hide_butoom = true;
                for (const i of use_input1.filter(
                  (x) => !['Departement', 'Date'].includes(x.name)
                )) {
                  i.value = '';
                }
                use_input[3].value = '';
              }
            }
          } else {
            if (use_inputEDIT[2].value !== '') {
              state.child_dialog.data.push(data_table(GET_DATA, xi, groupp));
              if (state.child_dialog.data.length !== 0) {
                state.child_dialog.hide_bottom = true;
                for (const i of use_inputEDIT1.filter(
                  (x) => !['Departement', 'Date'].includes(x.name)
                )) {
                  i.value = '';
                }
                use_inputEDIT[2].value = '';
              }
            }

            if (use_inputEDIT[3].value !== '') {
              state.child_dialog.data.push(data_table(GET_DATA, xi, groupp));
              if (state.child_dialog.data.length !== 0) {
                state.child_dialog.hide_bottom = true;
                for (const i of use_inputEDIT1.filter(
                  (x) => !['Departement', 'Date'].includes(x.name)
                )) {
                  i.value = '';
                }
                use_inputEDIT[3].value = '';
              }
            }
          }
          break;
        case 'checkPermission':
          if (GET_COMMON.zugriff == 'true') {
            state.child_dialog.valApprove = true;
          } else {
            state.child_dialog.valApprove = false;
            notyfyCreate('Sorry, No Access Right', 'red');
          }
          break;
        case 'storeRequestInsertArticle':
          break;
        case 'sStockoutBtnGo':
          break;
        default:
          if (GET_DATA.itExist == 'true') {
            state.data = data(GET_DATA);
            if (state.data.length !== 0) {
              state.isFetching = false;
              state.hide_bottom = true;
            }
          } else {
            state.isFetching = false;
            Notify.create({
              type: 'negative',
              message: 'data not found',
            });
          }
          break;
      }
    };

    onMounted(() => {
      FETCH_DATA('storeRequestPrepare', {
        userInit: user.userInit,
      });
      FETCH_DATA('storeReqPrepare');
      FETCH_DATA('storeRequestInitDisp');
      FETCH_DATA('selectCostDept1');
      FETCH_DATA('storeRequestChgPrepare', {
        userInit: user.userInit,
      });
    });

    const tBediener = (value, ky) => {
      const x = store_req.prepare.GET_PRICE[0];
      if (x.betriebsnr == 0) {
        FETCH_DATA(
          'storeRequestCreateOpList1',
          {
            opListArtnr: x.artnr,
            opListFuellflag: value.tBediener['t-bediener'][0]['nr'],
            opListStornogrund: '00000000000000000000',
            currLager: 1,
          },
          ky
        );
      }
    };

    const save_data = () => {
      FETCH_DATA('storeRequestBtnGo', {
        opList: {
          'op-list': [
            {
              anzahl0: '500',
              anzahl: '1',
              fibu: '',
              fibu10: '',
              sRecid: use_input[3].value,
            },
          ],
        },
        sRecid: use_input[3].value,
        userInit: user.userInit,
        tLschein: use_input[0].value,
        releaseFlag: true,
        transferred: true,
        showPrice: true,
      });
    };

    const save_modify = () => {
      FETCH_DATA('chgStoreRequestSaveData', {
        opList: {
          opList: [
            {
              anzahl0: approve.anzahl0,
              anzahl: approve.anzahl,
              warenwert: approve.warenwert,
              fibu: '',
              fibu10: '',
              sRecid: approve['s-recid'],
            },
          ],
        },
        sRecid: approve['s-recid'],
        userInit: '01',
        tLschein: approve.lscheinnr,
        releaseFlag: true,
        transferred: true,
        showPrice: state.child_dialog.valApprove,
      });
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Store Requisition');
      }
    }

    const onSearch = (val) => {
      console.log('sukses', val.date.startDate);
      console.log('sukses', date.formatDate(val.date.startDate, 'MM/DD/YY'));
      if (val.fromDept !== null && val.toDept !== null) {
        // const startDate = my_date(val.date.startDate)
        // const endDate = my_date(val.date.endDate)
        
        vals = val;
        state.isFetching = true;
        FETCH_DATA('storeReqCreateList', {
          fromDate: date.formatDate(val.date.startDate, 'MM/DD/YY'),
          toDate: date.formatDate(val.date.endDate, 'MM/DD/YY'),
          fromDept: val.fromDept.value,
          toDept: val.toDept.value,
          currLschein: val.ReqNumber == '' ? ' ' : val.ReqNumber,
          showPrice: true,
        });
      } else {
        Notify.create({
          type: 'negative',
          message: 'data not found',
        });
      }
    };

    function my_date(mydate) {
      const dDate = String(moment(mydate, 'DD/MM/YYYY').date()).padStart(
        2,
        '0'
      );
      const dMonth = String(moment(mydate, 'DD/MM/YYYY').month() + 1).padStart(
        2,
        '0'
      );
      const dYear = String(moment(mydate, 'DD/MM/YYYY').year()).substr(-2);
      return moment(`${dMonth}/${dDate}/${dYear}`, 'MM/DD/YY');
    }

    const select = (val) => {
      state.child_dialog.dialog = true;
      state.dialog = val;
    };

    const close = (val) => {
      state.child_dialog.dialog = val;
      state.dialog = val;
    };

    function select1() {
      state.child_dialog.dialog = false;
      Notify.create({
        type: 'positive',
        message: 'success',
      });
    }

    const addData = () => {
      state.dialog.dialog = true;
      state.dialog.dialog_child1 = true;
      state.child_dialog.keyApprove = '';
      for (const i of use_input) {
        i.value = '';
      }
      for (const i of use_input1) {
        i.value = '';
      }
    };

    const editItem = (row) => {
      state.child_dialog.data = [];
      keyDataModify = 'editItem';
      deletevalueinput();
      const data = row['stornogrund'];
      dataRowEdit = row;
      if (data == '') {
        state.child_dialog.actual = ['From Store', 'To Store'];
        state.child_dialog.actual1 = ['Total Amount'];
      } else {
        state.child_dialog.actual = ['From Store'];
        state.child_dialog.actual1 = ['Account', 'Total Amount'];
      }
      state.child_dialog.keyApprove = 'approve';
      state.child_dialog.dialog = true;
      FETCH_DATA('chgStoreRequestLoadData', {
        userInit: '01',
        tDatum: date.formatDate(row.datum, 'MM/DD/YY'),
        tLschein: row.lscheinnr,
        tAmount: '0',
        lscheinnr: '',
      });
    };

    const insertOther = (row) => {
      keyDataModify = 'insertOther';
      for (const i of use_inputEDIT.filter((x) =>
        ['From Store', 'To Store', 'Account'].includes(x.name)
      )) {
        i.disable = false;
      }
      for (const i of use_inputEDIT1.filter((x) =>
        [
          'Departement',
          'Date',
          'Stock Articel Name',
          'Quantity Mess Unit',
        ].includes(x.name)
      )) {
        i.disable = false;
      }
      state.child_dialog.data = [];
      deletevalueinput();
      state.child_dialog.keyApprove = '';
      dataRowEdit = row;
      const data = row;
      if (data['stornogrund'] == '') {
        state.child_dialog.actual = ['From Store', 'To Store'];
        state.child_dialog.actual1 = ['Total Amount'];
      } else {
        state.child_dialog.actual = ['From Store'];
        state.child_dialog.actual1 = ['Account', 'Total Amount'];
      }
      FETCH_DATA(
        'storeReqInsPrepare',
        {
          userInit: '01',
          tDatum: date.formatDate(data.datum, 'MM/DD/YY'),
          tLschein: data.lscheinnr,
        },
        'insert'
      );
      FETCH_DATA('getHelpInvArticle', {
        currLager: 5,
        recipe: false,
        sorttype: '0',
        sArtnr: '0',
        sBezeich: ' ',
      });
      state.child_dialog.dialog = true;
    };

    const outgoingStock = (row) => {
      state.child_dialog.data = [];
      deletevalueinput();
      keyDataModify = 'outgoingStock';
      state.child_dialog.keyApprove = '';
      dataRowEdit = row;
      const data = row;
      if (data['stornogrund'] == '') {
        state.child_dialog.actual = ['From Store', 'To Store'];
        state.child_dialog.actual1 = ['Total Amount'];
      } else {
        state.child_dialog.actual = ['From Store'];
        state.child_dialog.actual1 = ['Account', 'Total Amount'];
      }
      FETCH_DATA('storeReqInsPrepare', {
        userInit: '01',
        tDatum: date.formatDate(data.datum, 'MM/DD/YY'),
        tLschein: data.lscheinnr,
      });
      state.child_dialog.dialog = true;
    };

    const deleteRow = (row) => {
      rowDelete = row;
      state.confirm = true;
    };

    const sukses = () => {
      FETCH_DATA('storeReqCreateList', {
        fromDate: date.formatDate(vals.date.start, 'MM/DD/YY'),
        toDate: date.formatDate(vals.date.end, 'MM/DD/YY'),
        fromDept: vals.fromDept.value,
        toDept: vals.toDept.value,
        currLschein: vals.ReqNumber == '' ? ' ' : vals.ReqNumber,
        showPrice: true,
      });
    };

    const trans_code = (val, group) => {
      if (val == '1') {
        groupp = group;
        FETCH_DATA('storeRequestNewLscheinnr', {
          lscheinnr: `R${chart.transdate
            .substring(2)
            .replace('-', '')
            .replace('-', '')}001`,
          s: `R${chart.transdate
            .substring(2)
            .replace('-', '')
            .replace('-', '')}`,
          recidLOphdr: recidLOphdr,
        });
        FETCH_DATA('getHelpInvArticle', {
          currLager: 5,
          recipe: false,
          sorttype: '0',
          sArtnr: '0',
          sBezeich: ' ',
        });
      }

      if (val == '2') {
        FETCH_DATA('getBediener', {
          userNo: '',
          userInit: users.users.userInit,
        });
      }

      if (val == '3') {
        let onhand, artNr, qty, hasil;
        for (const i of state.dialog.data) {
          artNr = i.articelNumber;
          onhand = i.onhand;
          qty = i.quantity;
          if (parseInt(qty) < parseInt(onhand) || qty == '0') {
            hasil = parseInt(qty);
          }
        }
        FETCH_DATA('storeRequestCheckQty', {
          opList: {
            'op-list': [
              {
                artnr: artNr,
                anzahl: hasil,
                'lager-nr': use_input[1].value['value'],
              },
            ],
          },
        });
      }
    };

    const approved = (val) => {
      if (val) {
        FETCH_DATA('checkPermission', {
          arrayNr: '41',
          expectedNr: '2',
          userInit: users.users.userInit,
        });
      }
    };

    const saveDataModify = (val) => {
      if (keyDataModify == 'editItem') {
        state.child_dialog.dialog = val;
        let onhand, artNr, qty, hasil;
        for (const i of state.child_dialog.data) {
          artNr = i.articelNumber;
          onhand = i.onhand;
          qty = i.quantity;
          if (parseInt(qty) < parseInt(onhand) || qty == '0') {
            hasil = parseInt(qty);
          }
        }
        FETCH_DATA(
          'storeRequestCheckQty',
          {
            opList: {
              'op-list': [
                {
                  artnr: artNr,
                  anzahl: hasil,
                  'lager-nr': use_input[1].value['value'],
                },
              ],
            },
          },
          'modify'
        );
      }
      if (keyDataModify == 'insertOther') {
        state.child_dialog.dialog = val;
        let onhand, artNr, qty, hasil;
        for (const i of state.child_dialog.data) {
          artNr = i.articelNumber;
          onhand = i.onhand;
          qty = i.quantity;
          if (parseInt(qty) < parseInt(onhand) || qty == '0') {
            hasil = parseInt(qty);
          }
        }
        FETCH_DATA('storeRequestInsertArticle', {
          opList: {
            'op-list': [
              {
                'new-flag': 'yes',
                pos: '37',
                anzahl: '1',
                artnr: artNr,
                warenwert: '21445.05',
                'lager-nr': '1',
                stornogrund: '',
              },
            ],
          },
          transdate: '01/14/19',
          currLager: '1',
          deptno: '201',
          transferred: 'yes',
          toStock: '9',
          userInit: users.users.userInit,
          lscheinnr: 'R190114008',
        });
      }

      if (keyDataModify == 'outgoingStock') {
        actionNotify('Confirm your transaction?');
      }
    };

    const addInsert = () => {
      FETCH_DATA(
        'getBediener',
        {
          userNo: '',
          userInit: users.users.userInit,
        },
        'addInsert'
      );
    };

    const onRowClick = (datarow) => {
      for (const i of state.data) {
        i.selected = false;
      }
      datarow['selected'] = true;
    };

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
      approved,
      saveDataModify,
      addInsert,
      onRowClick,
      doPrint,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    searchIncoming: () => import('./components/SearchStoreRequisition.vue'),
    DialogTypeStore: () => import('./components/DialogTypeStoreReq.vue'),
    AddInterStoreTransfer: () =>
      import('./components/ChildComponent/AddInterStoreTransfer1.vue'),
  },
});
</script>

<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 2;
    }

    &:first-child th {
      top: 0;
    }
  }
}
</style>
