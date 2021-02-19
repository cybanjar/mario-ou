<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:600px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <q-space />
            </div>

              <div class="col">
                <SInput outlined v-model="data.balance" label-text="Balance" :disable="true" readonly/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
            
            </div>

            <div class="col">
              <SInput outlined v-model="data.name" label-text="Name" @change="(v) => { onChangeSearchInput(); }" data-layout="compact" ref="paymentName" @focus="showKeyboard"/>
            </div>
          </div>

          <q-btn
            color="primary"
            label="View Member"
            @click="onClickMember()" />
        </q-card-section>

        <q-card-section>
          <div class="q-pa-sm">
            <STable
              hide-bottom
              :loading="isLoading"
              :columns="tableHeaders"
              :data="data.filteredDataTable"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[0]"
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
                    @click="onRowClickTable(props.row)">
                      {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </STable>
          </div>

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

        <q-dialog v-model="showDialogConfirmation" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirm</q-toolbar-title>
            </q-toolbar>

          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-md-2">
                <q-avatar icon="mdi-help" color="negative" text-color="white" />
              </div>
              <div class="col-md-10">                  
                <p class="q-ml-md">Confirm selection?</p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmation()" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showDialogMemberDetail" persistent>
          <q-card style="max-width: 1500px;width:550px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Member of Master Bill</q-toolbar-title>
            </q-toolbar>

            <q-card-section class="row items-center">
              <div class="q-pa-sm">
                <STable
                  hide-bottom
                  :loading="isLoading"
                  :columns="tableHeadersMemberDetail"
                  :data="data.dataDetailMember"
                  row-key="name"
                  separator="cell"
                  :rows-per-page-options="[0]"
                  :pagination.sync="pagination">
                  <template v-slot:loading>
                    <q-inner-loading showing color="primary" />
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-white':'bg-white text-black'">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props">
                          {{ col.value }}
                      </q-td>
                    </q-tr>
                  </template>
                </STable>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmationDetail()" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-card-actions align="right">
          <q-btn outline color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog"/>
        </q-card-actions>
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
    buttonOkEnable: boolean;
    balance: any;
    name: any;
    filteredDataTable: any,
    dataSelected: null,
    dataDetailMember: any;
  }
  title: string;
  showDialogMemberDetail: boolean;
  showDialogConfirmation: boolean;
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
}

export default defineComponent({
  props: {
    showPaymentMasterFolio: { type: Boolean, required: true },
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
        buttonOkEnable: false,
        balance: 0,
        name: '',
        filteredDataTable: [],
        dataSelected: null,
        dataDetailMember: [],
      },
      title: '',
      showDialogMemberDetail: false,
      showDialogConfirmation: false,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: '',
      input: null,
      numpadVisible: false,
    });

    watch(
      () => props.showPaymentMasterFolio, (showPaymentMasterFolio) => {
        if (props.showPaymentMasterFolio) {
          state.data.buttonOkEnable = false;
          state.title = 'Master Folio Payment';
          state.data.balance = props.dataTable['dataTable']['saldo'];
          state.data.dataSelected = null;

          getRMaster();

          // console.log("On Mount Master Folio : ", props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentMasterFolio,
        set: (val) => {
            emit('onDialogPaymentMasterFolio', val, '', {});
        },
    });

    // HTTP Request Method
    const getRMaster = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rmaster', {
            hRecid: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          // console.log('response rmaster: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.data.dataDetail = response['q1List']['q1-list'];
          state.data.filteredDataTable = state.data.dataDetail;
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
          $api.outlet.getOUPrepare('rmasterCheckCreditlimit', {
            billGastnr: state.data.dataSelected['gastnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          // console.log('response rmasterCheckCreditlimit: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (state.data.dataSelected['saldo'] > response['klimit']) {
            Notify.create({
              message: 'OVER Credit Limit found!! \nGiven Limit = ' + response['klimit'],
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          if (props.flagSplit) {
            getPaySplitBill();
            // console.log('SPLIT');
          } else {
            emit('onDialogPaymentMasterFolio', false, 'ok', response);
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

    const getMasterMemberPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('mastmemberPrepare', {
            billno: state.data.dataSelected['rechnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          // console.log('response mastmemberPrepare: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.data.dataDetailMember = response['q1List']['q1-list'];
          state.isLoading = false;
          state.showDialogMemberDetail = true;
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
      // console.log('REQUEST : ', {
      //   		pvILanguage: 0,
      //       recIdHBill: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
      //       bilrecid: state.data.dataSelected['rec-id'],
      //       currSelect: props.dataTable['dataPrepare']['counter'],
      //       multiVat: 'false',
      //       balance: state.data.balance,
      //       payType: 3,
      //       transdate: '',
      //       exchgRate: props.dataTable['dataPrepare']['exchgRate'],
      //       foreignRate: props.dataTable['dataPrepare']['foreignRate'],
      //       dept: props.dataTable['dataPrepare']['currDept'],
      //       changeStr: ' ',
      //       addZeit: 0,
      //       hogaCard: 0,
      //       cancelStr: " ",
      //       currWaiter: props.dataTable['dataPrepare']['currWaiter'],
      //       currRoom: " ",
      //       userInit: dataStoreLogin['userInit'],
      //       ccComment: " ",
      //       guestnr: state.data.dataSelected['gastnr'],
      //       tischnr: props.dataTable['dataTable']['tischnr'],
      //       doubleCurrency: props.dataTable['dataPrepare']['doubleCurrency'],
      //       amountForeign: state.data.balance
      //     });
      
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('splitbillBtnTransferPaytypegt1', {
        		pvILanguage: 0,
            recIdHBill: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
            bilrecid: state.data.dataSelected['rec-id'],
            currSelect: props.dataTable['dataPrepare']['counter'],
            multiVat: 'false',
            balance: state.data.balance,
            payType: 3, //room transfer 2
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
            guestnr: state.data.dataSelected['gastnr'],
            tischnr: props.dataTable['dataTable']['tischnr'],
            doubleCurrency: props.dataTable['dataPrepare']['doubleCurrency'],
            amountForeign: state.data.balance
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

          // console.log('splitbillBtnTransferPaytypegt1 : ', responsePrepare);
          responsePrepare['flagPay'] = 'full';
          responsePrepare['payment'] = state.data.balance;
          emit('onDialogPaymentMasterFolio', false, 'ok', responsePrepare);
          state.isLoading = false;
        }
      }
      asyncCall();
    }



    const tableHeaders = [
      {
            label: "Bill Number", 
            field: "rechnr",
            name: "rechnr",
            align: "right",
        }, {
            label: "Bill Receiver", 
            field: "bill-name",
            name: "bill-name",
            align: "left",
        }, {
            label: "Group Name", 
            field: "groupname",
            name: "groupname",
            align: "left",
        },
    ];

    const tableHeadersMemberDetail = [
      {
            label: "RmNo", 
            field: "zinr",
            name: "zinr",
            align: "left",
        }, {
            label: "Guest Name", 
            field: "name",
            name: "name",
            align: "left",
        }, {
            label: "Guest Status", 
            field: "resstatus",
            name: "resstatus",
            align: "left",
        }, {
            label: "Arrival", 
            field: "ankunft",
            name: "ankunft",
            align: "left",
        }, {
            label: "Departure", 
            field: "abreise",
            name: "abreise",
            align: "left",
        },
    ];

    // -- On Click Listener
    const onClickConfirmationDetail = () => {
    }

    const onClickConfirmation = () => {
      getCheckCreditLimit();
    }

    const onClickMember = () => {
      if ((state.data.dataSelected) != null ) {
        getMasterMemberPrepare();
      } else {
        Notify.create({
          message: 'Select guest first',
          color: 'red',
        });
      }
    }

    const onOkDialog = () => {
      if ((state.data.dataSelected) != null ) {
        state.showDialogConfirmation = true;
      } else {
        Notify.create({
          message: 'Select guest first',
          color: 'red',
        });
      }
    }

    const onCancelDialog = () => {
      state.data.dataSelected = null;
      state.data.name = '';
      state.data.balance = 0;
      emit('onDialogPaymentMasterFolio', false, '', {});
    }

    const onRowClickTable = (dataRow) => {
      // console.log(dataRow);

      for (let i = 0; i<state.data.filteredDataTable.length; i++) {
        const datarow = state.data.filteredDataTable[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.filteredDataTable.length; i++) {
        const datarow = state.data.filteredDataTable[i] as {};          
        if (state.data.filteredDataTable[i]['gastnr'] == dataRow['gastnr'] 
              && state.data.filteredDataTable[i]['rec-id'] == dataRow['rec-id']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.filteredDataTable = [];
      state.data.filteredDataTable = dataTable;

      dataRow['selected'] = true;
      state.data.dataSelected = dataRow;
      state.data.name = state.data.dataSelected['bill-name'];
      state.data.buttonOkEnable = true;
    }

    const onChangeSearchInput = (input) => {
      state.data.filteredDataTable = [];

      if (state.data.name.length > 0) {
        for(let i = 0; i<state.data.dataDetail.length; i++) {
          const datarow = state.data.dataDetail[i];
          const bezeich = state.data.dataDetail[i]['bill-name'] as string;

          if (bezeich.toLocaleLowerCase().includes(state.data.name.toLocaleLowerCase())) {
            state.data.filteredDataTable.push(datarow);
          }
        }
      } else {
        state.data.filteredDataTable = state.data.dataDetail;
      }
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
        onChangeSearchInput(state.data.dataSelected);
      }
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClickTable,
      onClickConfirmation,
      onOkDialog,
      onClickMember,
      onCancelDialog,
      onChangeSearchInput,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      onClickConfirmationDetail,
      tableHeadersMemberDetail,
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

