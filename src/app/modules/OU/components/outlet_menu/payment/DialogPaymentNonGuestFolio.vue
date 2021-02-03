<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1100px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-separator />

        <q-card-section style="max-height: 70vh" class="scroll">
          <div class="row q-mx-sm">
            <div class="col-4">
              <SInput class="q-mr-md" outlined v-model="data.name" label-text="Name" data-layout="compact" ref="paymentName" @focus="showKeyboard"/>
            </div>
            <div class="col-8">
              <STable
                class="my-sticky-header-table"
                flat
                bordered
                :loading="isLoading"
                :columns="tableHeaders"
                :data="data.dataFilteredTable"
                row-key="name"
                separator="cell"
                :rows-per-page-options="[10, 13, 16]"
                :pagination.sync="pagination">
                <template v-slot:loading>
                  <q-inner-loading showing color="primary" />
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-white':'bg-white text-black'">
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      @click="onRowClick(props.row)">
                        {{ col.value }}
                    </q-td>
                  </q-tr>
                </template>
              </STable>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-sm">
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
          </div>
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
                <p class="q-ml-md">Confirm selection {{data.dataSelected['bill-name']}} ? </p>
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
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  data: {
    dataTable: any,
    dataFilteredTable: any,
    buttonOkEnable: boolean;
    name: string;
    dataSelected: {},
    overCLFlag: boolean,
    balance: any,
  }
  showConfirmationDialog: boolean;
  title: string;
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
}

export default defineComponent({
  props: {
    showPaymentNonGuestFolio: { type: Boolean, required: true },
    flagSplit: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    dataTable: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      data: {
        dataTable: [],
        dataFilteredTable: [],
        buttonOkEnable: false,
        name: '',
        dataSelected: {},
        overCLFlag: false,
        balance: 0,
      },
      title: '',
      showConfirmationDialog: false,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: '',
      input: null,
      numpadVisible: false,
    });

    watch(
      () => props.showPaymentNonGuestFolio, (showPaymentNonGuestFolio) => {
        if (props.showPaymentNonGuestFolio) {
          state.data.buttonOkEnable = false;
          state.title = 'Guest Non Folio Payment';
          state.data.balance = props.dataTable['dataTable']['saldo']

          console.log('On mount non guest folio : ', props.dataTable);

          getHTParam(1, 879);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentNonGuestFolio,
        set: (val) => {
            emit('onDialogPaymentNonGuestFolio', val, '', {});
        },
    });

    // -- HTTP Request method
    const getHTParam = (caseType, inp) => {
      state.isLoading = true;

      async function asyncCall() {
        const [gethtparam] = await Promise.all([
          $api.outlet.getCommonOutletUserList('getHTParam0', {
            caseType : caseType,
            inpParam: inp
          })
        ]);

        if (gethtparam) {
          const responseHTParam = gethtparam || [];
          const okFlag = responseHTParam['outputOkFlag'];

          console.log('responseHTParam : ', responseHTParam);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          getPrepare();
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

    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rnonstayPrepare', {
            dept : props.dataTable['dataHotelSelected']['num'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response prepare: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataTable = response['q1List']['q1-list'];
          state.data.dataTable.sort(function(a, b) { return (a['bill-name'] > b['bill-name']) ? 1 : ((b['bill-name'] > a['bill-name']) ? -1 : 0);} )
          state.data.dataFilteredTable = state.data.dataTable;
          state.data.overCLFlag = response['overCLFlag'];
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

    const getCheckCreditLimit = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rnonstayCheckCreditlimit', {
            rechnr : state.data.dataSelected['rechnr'],
            pvlLanguage : 1,
            recId : state.data.dataSelected['rec-id'],
            balance : state.data.dataSelected['saldo'],
            overCLFlag : state.data.overCLFlag,
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response getCheckCreditLimit: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.isLoading = false;

          if (props.flagSplit) {
            getPaySplitBill();
          } else {
            emit('onDialogPaymentNonGuestFolio', false, 'ok', response);
          }
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
            bilrecid: state.data.dataSelected['rec-id'],
            currSelect: props.dataTable['dataPrepare']['counter'],
            multiVat: 'false',
            balance: state.data.balance,
            payType: 3,
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
            bilrecid: state.data.dataSelected['rec-id'],
            currSelect: props.dataTable['dataPrepare']['counter'],
            multiVat: 'false',
            balance: state.data.balance,
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
          emit('onDialogPaymentNonGuestFolio', false, 'ok', responsePrepare);
          state.isLoading = false;
        }
      }
      asyncCall();
    }

    const tableHeaders = [
      {
            label: "Bill No", 
            field: "rechnr",
            name: "rechnr",
            align: "right",
        }, {
            label: "Bill Receiver", 
            field: "bill-name",
            name: "bill-name",
            align: "left",
        }, {
            label: "Balance", 
            field: "saldo",
            name: "saldo",
            align: "right",
        },
    ];

    // -- OnClick Listener
    const onRowClick = (dataRow) => {
     console.log(dataRow);

     for (let i = 0; i<state.data.dataFilteredTable.length; i++) {
        const datarow = state.data.dataFilteredTable[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.dataFilteredTable.length; i++) {
        const datarow = state.data.dataFilteredTable[i] as {};          
        if (state.data.dataFilteredTable[i]['rec-id'] == dataRow['rec-id']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.dataFilteredTable = [];
      state.data.dataFilteredTable = dataTable;

      dataRow['selected'] = true;
      state.data.dataSelected = dataRow;
      state.data.name = dataRow['bill-name'];
      state.data.buttonOkEnable = true;
    }

    const onOkDialog = () => {
      state.showConfirmationDialog = true;
    }

    const onCancelDialog = () => {
      emit('onDialogPaymentNonGuestFolio', false, '', {});
    }

    const onClickConfirmation = () => {
      state.showConfirmationDialog = false;
      getCheckCreditLimit();
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

      if (state.layout == 'compact') {
        // onChangeSearchInput(state.data.dataGuestSelected);
        // console.log(state.layout);
      }
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onOkDialog,
      onCancelDialog,
      getPrepare,
      onClickConfirmation,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
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

