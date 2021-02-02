<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="max-width: 1500px;width:1100px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section style="max-height: 70vh" class="scroll">
          <div class="row">
            <div class="col-4">
              <div class="q-ma-sm row q-gutter-xs">
                <div class="col">
                  <SInput v-model="data.balance" outlined  label-text="Balance" :disable="true" readonly/>
                </div>
              </div>

              <div class="q-ma-sm row q-gutter-xs">
                <div class="col">
                  <SInput outlined v-model="data.room" label-text="Room" @change="(v) => { getReturnZinr(data.zinr); }" data-layout="numeric" ref="paymentRoom" @focus="showKeyboard"/>
                </div>
              </div>

              <div class="q-ma-sm row q-gutter-xs">
                <div class="col">
                  <SInput outlined v-model="data.remark" type="textarea" label-text="Remark" :disable="true" readonly/>
                </div>
              </div>
            </div>
            <div class="col-8">
              <div class="q-pa-sm">
                <STable
                  class="my-sticky-header-table"
                  flat
                  bordered
                  :loading="isLoading"
                  :columns="tableHeaders"
                  :data="data.dataDetail"
                  row-key="name"
                  separator="cell"
                  :rows-per-page-options="[10, 13, 16]"
                  :pagination.sync="pagination"
                >
                  <template v-slot:loading>
                    <q-inner-loading showing color="primary" />
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-white':'bg-white text-black'">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        @click="onRowClickTable(props.row)">
                          {{ col.value }}
                      </q-td>
                    </q-tr>
                  </template>
                </STable>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <vue-touch-keyboard 
            id="keyboard"
            :options="options" 
            v-if="numpadVisible" 
            :layout="layout" 
            :cancel="hideKeyboard" 
            :accept="acceptKeyboard" 
            :next="acceptKeyboard"
            :input="input"
            :close="hideKeyboard" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog" />
        </q-card-actions>

        <q-dialog v-model="showConfirmationDialog" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirm selection ?</q-toolbar-title>
            </q-toolbar>

          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-md-2">
                <q-avatar icon="mdi-help" color="negative" text-color="white" />
              </div>
              <div class="col-md-10">                  
                <p class="q-ml-md">Confirm your selection? </p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline color="primary" label="Cancel" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmation()" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog> 
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    dataResponse: {};
    buttonOkEnable: boolean;
    balance: any;
    room: string;
    remark: string;
    dataSelected: null;
  }
  title: string;
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
  showConfirmationDialog: boolean,
}

export default defineComponent({
  props: {
    showPaymentGuestFolio: { type: Boolean, required: true },
    flagSplit: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    dataTable: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataResponse: {},
        buttonOkEnable: false,
        balance: 0,
        room: '',
        remark: '',
        dataSelected: null,
      },
      title: '',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: 'numeric',
      input: null,
      numpadVisible: false,
      showConfirmationDialog: false,
    });

    watch(
      () => props.showPaymentGuestFolio, (showPaymentGuestFolio) => {
        if (props.showPaymentGuestFolio) {
          state.data.buttonOkEnable = false;
          state.title = 'Guest Folio Payment';
          state.data.balance = props.dataTable['dataTable']['saldo']
          getPrepare();
          console.log('data table : ', props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentGuestFolio,
        set: (val) => {
            emit('onDialogPaymentGuestFolio', val, '', {});
        },
    });

    // -- HTTP Request method
    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rzinrPrepare ', {
            pvILanguage: 1,
            dept:props.dataTable['dataPrepare']['currDept'],
            zinr: props.dataTable['dataTable']['tischnr'],
            hResnr: props.dataTable['dataTable']['resnr'],
            hReslinnr:props.dataTable['dataTable']['reslinnr'],
            balance: props.dataTable['dataTable']['saldo'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response rzinrPrepare: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataResponse = response;

          let dataTable = response['q1List']['q1-list'];
          // for (let i = 0; i<dataTable.length; i++) {
          //   const datarow = dataTable[i] as {};
          //   datarow['pos'] = i;
          //   dataTable.push(datarow);
          // }
          
          state.data.dataDetail = dataTable.slice();
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
      }
      asyncCall();
    }

    const getReturnZinr = () => {
      state.isLoading = true;

      console.log({
        pvILanguage: 0,
        dept:props.dataTable['dataPrepare']['currDept'],
        room: state.data.room,
        caseType: 1,
        deptMbar: state.data.dataResponse['deptMbar'],
        deptLdry: state.data.dataResponse['deptLdry'],
      })

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rzinrPrepare ', {
            pvILanguage: 1,
            dept:props.dataTable['dataPrepare']['currDept'],
            room: state.data.room,
            caseType: 1,
            deptMbar: state.data.dataResponse['deptMbar'],
            deptLdry: state.data.dataResponse['deptLdry'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response return: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          let dataTable = response['q1List']['q1-list'];
          // for (let i = 0; i<dataTable.length; i++) {
          //   const datarow = dataTable[i] as {};
          //   datarow['pos'] = i;
          //   dataTable.push(datarow);
          // }
          
          state.data.dataDetail = dataTable;
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
      }
      asyncCall();
    }

    const getBtnExit = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rzinrBtnExit', {
            pvILanguage: 1,
            flCode: state.data.dataResponse['flcode'],
            code: state.data.dataSelected['code'],
            resnr: state.data.dataSelected['resnr'],
            reslinnr: state.data.dataSelected['reslinnr'],
            balance: state.data.balance,
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response rzinrBtnExit: ', response);
          state.data.dataSelected['bilrecid'] = response['bilrecid'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (response['msgStr'] == '' && response['msgStr1'] == '' && response['msgStr2'] == '') {
            state.showConfirmationDialog = true;
          } else {
            Notify.create({
              message: response['msgStr'] + "\n" + response['msgStr1'] + "\n" + response['msgStr2'],
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
      }
      asyncCall();
    }

    const getMicrosBtn = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvMicrosBtnTransfer', {
            hBillRecid : props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
            balanceForeign : props.dataTable['dataTable']['dataopentable']['balanceForeign'],
            balance : state.data.balance,
            transfStr: ' ',
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response restInvMicrosBtnTransfer: ', response);

          props.dataTable['dataPayment'] = response;

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.isLoading = false;
          emit('onDialogPaymentGuestFolio', false, 'ok', response);
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
      }
      asyncCall();
    }

     const getPaySplitBill = () => {
      console.log('REQUEST : ', {
        		pvILanguage: 0,
            recIdHBill: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
            bilrecid: state.data.dataSelected['bilrecid'],
            currSelect: props.dataTable['dataPrepare']['counter'],
            multiVat: 'false',
            balance: -state.data.balance,
            payType: 2,
            transdate: '',
            exchgRate: props.dataTable['dataPrepare']['exchgRate'],
            foreignRate: props.dataTable['dataPrepare']['foreignRate'],
            dept: props.dataTable['dataPrepare']['currDept'],
            changeStr: ' ',
            addZeit: 0,
            hogaCard: 0,
            cancelStr: " ",
            currWaiter: props.dataTable['dataPrepare']['currWaiter'],
            currRoom: " ",
            userInit: dataStoreLogin['userInit'],
            ccComment: " ",
            guestnr: state.data.dataSelected['resnr'],
            tischnr: props.dataTable['dataTable']['tischnr'],
            doubleCurrency: props.dataTable['dataPrepare']['doubleCurrency'],
            amountForeign: -state.data.balance
          });
      
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('splitbillBtnTransferPaytypegt1', {
        		pvILanguage: 0,
            recIdHBill: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
            bilrecid: state.data.dataSelected['bilrecid'],
            currSelect: props.dataTable['dataPrepare']['counter'],
            multiVat: 'false',
            balance: -state.data.balance,
            payType: 2, //room transfer 2
            transdate: '',
            exchgRate: props.dataTable['dataPrepare']['exchgRate'],
            foreignRate: props.dataTable['dataPrepare']['foreignRate'],
            dept: props.dataTable['dataPrepare']['currDept'],
            changeStr: ' ',
            addZeit: 0,
            hogaCard: 0,
            cancelStr: " ",
            currWaiter: props.dataTable['dataPrepare']['currWaiter'],
            currRoom: " ",
            userInit: dataStoreLogin['userInit'],
            ccComment: " ",
            guestnr: state.data.dataSelected['resnr'],
            tischnr: props.dataTable['dataTable']['tischnr'],
            doubleCurrency: props.dataTable['dataPrepare']['doubleCurrency'],
            amountForeign: -state.data.balance
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          console.log('splitbillBtnTransferPaytypegt1 : ', responsePrepare);
          responsePrepare['flagPay'] = 'full';
          responsePrepare['payment'] = state.data.balance;
          emit('onDialogPaymentGuestFolio', false, 'ok', responsePrepare);
          state.isLoading = false;
        }
      }
      asyncCall();
    }
    

    const tableHeaders = [
      {
            label: "RmNo", 
            field: "zinr",
            name: "zinr",
            align: "left",
        }, {
            label: "No", 
            field: "billnr",
            name: "billnr",
            align: "right",
        },{
            label: "Guest Name", 
            field: "g-name",
            name: "g-name",
            align: "left",
        },{
            label: "Arrival", 
            field: "ankunft",
            name: "ankunft",
            align: "left",
        },{
            label: "Depart", 
            field: "depart",
            name: "depart",
            align: "left",
        },{
            label: "Nation", 
            field: "nation1",
            name: "nation1",
            align: "left",
        },
    ];

    // -- onClick listener 
    const onClickConfirmation = () => {
      if (props.flagSplit) {
        getPaySplitBill();
      } else {
        getMicrosBtn();
      }
    }

    const onRowClickTable = (dataRow) => {
      console.log(dataRow);

     for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as {};
        if (state.data.dataDetail[i]['resnr'] == dataRow['resnr'] && 
            state.data.dataDetail[i]['billnr'] == dataRow['billnr'] && 
            state.data.dataDetail[i]['zinr'] == dataRow['zinr'] && 
            state.data.dataDetail[i]['reslinnr'] == dataRow['reslinnr']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.dataDetail = [];
      state.data.dataDetail = dataTable;

      dataRow['selected'] = true;
      state.data.dataSelected = dataRow;
      state.data.remark = state.data.dataSelected['bemerk'];
      state.data.room = state.data.dataSelected['zinr'];
      state.data.buttonOkEnable = true;
    }

    const onOkDialog = () => {
      console.log(state.data.dataSelected);

      if (state.data.dataSelected == null) {
        Notify.create({
          message: 'Select guest first',
          color: 'red',
        });
      } else {
        let flCode = 0;
        if (state.data.dataSelected['dataSelected'] != '' && (props.dataTable['dataPrepare']['currDept'] == state.data.dataResponse['deptMbar'] || props.dataTable['dataPrepare']['currDept'] == state.data.dataResponse['deptLdry'])) {
          flCode = 1;
          state.data.dataResponse['flcode'] = flCode;
          console.log('flCode', flCode);
          getBtnExit();
        } else if (state.data.dataSelected['dataSelected'] != '' && (props.dataTable['dataPrepare']['currDept'] != state.data.dataResponse['deptMbar'] || props.dataTable['dataPrepare']['currDept'] != state.data.dataResponse['deptLdry'])) {
          flCode = 2;
          state.data.dataResponse['flcode'] = flCode;
          console.log('flCode', flCode);
          getBtnExit();
        }

      }

    }

    const onCancelDialog = () => {
      state.data.remark = '';
      state.data.dataSelected = null;
      state.data.room = '';
      state.data.balance = 0;
      emit('onDialogPaymentGuestFolio', false, '', {});
    }

    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 

      if (!state.numpadVisible) {
        state.numpadVisible = true;
      }      
    }

    const hideKeyboard = () => {
      state.numpadVisible = false;
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClickTable,
      onOkDialog,
      onCancelDialog,
      getReturnZinr,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      onClickConfirmation,
      pagination: { rowsPerPage: 0 },
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.total-budget {
  border-radius: 4px;
  border: 1px solid $primary;

  span {
    display: inline-block;
    padding: 4px 11px;

    &:first-child {
      border-right: 1px solid $primary;
    }

    &:last-child {
      flex: 1;
      text-align: right;
    }
  }
}

#keyboard {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1000;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;

	padding: 1em;

	background-color: #EEE;
	box-shadow: 0px -3px 10px rgba(black, 0.3);

	border-radius: 10px;
}
</style>

