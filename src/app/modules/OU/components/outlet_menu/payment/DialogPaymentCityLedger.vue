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
                  <div class="col q-mr-sm">
                    <SInput outlined v-model="data.balance" label-text="Balance" :disable="true" readonly/>
                  </div>
              </div>

              <div class="q-ma-sm row q-gutter-xs">
                  <div class="col q-mr-sm">
                    <SInput outlined v-model="data.payment" label-text="Payment" data-layout="numeric" ref="paymentPayment" @focus="showKeyboard"/>
                  </div>
              </div>

              <div class="q-ma-sm row q-gutter-xs">
                  <div class="col q-mr-sm">
                    <SInput
                      outlined
                      v-model="data.name" 
                      type="search"
                      @change="(v) => { onChangeSearchInput(data.name); }"
                      label-text="Name"
                      data-layout="compact" 
                      ref="paymentName" 
                      @focus="showKeyboard"/>
                  </div>
              </div>
              <div class="q-ma-sm row q-gutter-xs">
                <div class="col q-mr-sm">
                  <SInput outlined v-model="data.remark" label-text="Remark" type="textarea" :disable="true" readonly/>
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
                  :data="data.filteredDataTable"
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
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog"/>
        </q-card-actions>

        <q-dialog v-model="data.showConfirmationDialog" persistent>
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
                <p class="q-ml-md">{{data.titleConfirmation}}</p>
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
import { Notify, date } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    dataTable: any;
    filteredDataTable: any;
    buttonOkEnable: boolean;
    balance : any,
    payment: any,
    name : string,
    remark: string,
    dataGuestSelected: {},
    showConfirmationDialog: boolean,
    titleConfirmation: string,
  }
  title: string;
  caseType:any,
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
}

export default defineComponent({
  props: {
    showPaymentCityLedger: { type: Boolean, required: true },
    flagSplit: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    dataTable: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataTable : [],
        filteredDataTable: [],
        buttonOkEnable: false,
        balance : 0,
        payment: 0,
        name : '',
        remark: '',
        dataGuestSelected: {},
        showConfirmationDialog: false,
        titleConfirmation: '',
      },
      title: '',
      caseType: 0,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: '',
      input: null,
      numpadVisible: false,
    });
    
    watch(
      () => state.data.dataGuestSelected, (dataGuestSelected) => {
        if (dataGuestSelected != undefined) {
          state.data.titleConfirmation = 'Confirm the selection ' + state.data.dataGuestSelected['gastnr'] + ' - ' + state.data.dataGuestSelected['gname'] + '?'
        }
      }
    );

    watch(
      () => props.showPaymentCityLedger, (showPaymentCityLedger) => {
        if (props.showPaymentCityLedger) {
          state.data.buttonOkEnable = false;
          state.title = 'City Ledger Payment';

          state.data.balance = props.dataTable['dataTable']['saldo'];
          state.data.payment = -state.data.balance;

          getHTParam(4, 491);

          console.log("On mount City Ledegr : ", props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentCityLedger,
        set: (val) => {
            emit('onDialogPaymentCityLedger', val, '', {});
        },
    });

    const tableHeaders = [
      {
            label: "Customer Name", 
            field: "gname",
            name: "gname",
            align: "left",
        }, {
            label: "C/L No", 
            field: "zahlungsart",
            name: "zahlungsart",
            align: "center",
        }, {
            label: "Description", 
            field: "bezeich",
            name: "bezeich",
            align: "left",
        }, {
            label: "Address", 
            field: "address",
            name: "address",
            align: "left",
        },
    ];

    // HTTP Request method
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

    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('clguestPrepare', { })
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

          state.data.dataTable = response['clguestList']['clguest-list'];
          state.data.dataTable.sort(function(a, b) { return (a['gname'] > b['gname']) ? 1 : ((b['gname'] > a['gname']) ? -1 : 0);} )
          state.data.filteredDataTable = state.data.dataTable;
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

    const getGuestAroutStand = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('guestAroutstand', { 
            gastno: state.data.dataGuestSelected['gastnr'],
            zahlungsart: state.data.dataGuestSelected['zahlungsart'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response guestAroutstand: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.isLoading = false;

          if (response['outstand'] > state.data.dataGuestSelected['kreditlimit']) {
            state.data.titleConfirmation = 'Credit Limit Overdrawn: \nGiven Limit : ' + state.data.dataGuestSelected['kreditlimit'] + '\n' 
                        + 'Total A/R Outstanding = ' + response['outstand'] + '\nDo you wish to CANCEL the C/L transfer?';
            state.caseType = 1;
            state.data.showConfirmationDialog = true;
          } else {
            getPayType1();
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

    const getPayType1 = () => {
      state.isLoading = true;

      console.log('request', {
            pvILanguage : 0,
            recId: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
            guestnr: 0,
            currDept: props.dataTable['dataPrepare']['currDept'],
            paid: state.data.payment,
            exchgRate: 0,
            priceDecimal: 0,
            balance: state.data.balance,
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            discArt1: props.dataTable['dataPrepare']['discArt1'],
            discArt2: props.dataTable['dataPrepare']['discArt2'],
            discArt3: props.dataTable['dataPrepare']['discArt3'],
            kellnerKellnerNr: 1,
           })

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvBtnTransferPaytype1', {
            pvILanguage : 0,
            recId: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
            guestnr: state.data.dataGuestSelected['gastnr'],
            currDept: props.dataTable['dataPrepare']['currDept'],
            paid: state.data.payment,
            exchgRate: 0,
            priceDecimal: 0,
            balance: state.data.balance,
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            discArt1: props.dataTable['dataPrepare']['discArt1'],
            discArt2: props.dataTable['dataPrepare']['discArt2'],
            discArt3: props.dataTable['dataPrepare']['discArt3'],
            kellnerKellnerNr: 1,
           })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response restInvBtnTransferPaytype1: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (response['msgStr'] != '') {
            Notify.create({
              message: response['msgStr'],
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

    // -- onClick Listener 
    const onRowClick = (dataRow) => {
      for (let i = 0; i<state.data.filteredDataTable.length; i++) {
        const datarow = state.data.filteredDataTable[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.filteredDataTable.length; i++) {
        const datarow = state.data.filteredDataTable[i] as {};          
        if (state.data.filteredDataTable[i]['gastnr'] == dataRow['gastnr']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.filteredDataTable = [];
      state.data.filteredDataTable = dataTable;

      dataRow['selected'] = true;
      state.data.dataGuestSelected = dataRow;
      state.data.remark = state.data.dataGuestSelected['bemerk'];
      state.data.name = state.data.dataGuestSelected['gname'];
      state.data.buttonOkEnable = true;
    }

    const onOkDialog = () => {
      if (state.data.name.trim() == "") {
        Notify.create({
          message: 'Name not yet selected',
          color: 'red',
        });
        state.isLoading = false;
        return false;
      } else {
        state.caseType = 0;
        state.data.showConfirmationDialog = true;
      }
    }

    const onCancelDialog = () => {
      state.caseType = 0;
      emit('onDialogPaymentCityLedger', false, '', {});
    }

    const onClickConfirmation = () => {
      if (state.caseType == 0) {
        if (state.data.dataGuestSelected['kreditlimit'] != 0) {
          getGuestAroutStand();
        } else {
          getPayType1();
          console.log('Hit API ? 0');          
        }
      } else if (state.caseType == 1) {
        console.log('Hit API ? 1');          

        state.data.showConfirmationDialog = false;
        // emit('onDialogPaymentCityLedger', false, 'ok', {});
      }

    }

    const onChangeSearchInput = (input) => {
      state.data.filteredDataTable = [];

      if (state.data.name.length > 0) {
        for(let i = 0; i<state.data.dataTable.length; i++) {
          const datarow = state.data.dataTable[i];
          const bezeich = state.data.dataTable[i]['gname'] as string;

          if (bezeich.toLocaleLowerCase().includes(state.data.name.toLocaleLowerCase())) {
            state.data.filteredDataTable.push(datarow);
          }
        }
      } else {
        state.data.filteredDataTable = state.data.dataTable;
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
        onChangeSearchInput(state.data.dataGuestSelected);
        // console.log(state.layout);
      }
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    return {
      dialogModel,
      ...toRefs(state),
      onRowClick,
      onOkDialog,
      onCancelDialog,
      tableHeaders,
      getPrepare,
      getHTParam,
      onChangeSearchInput,
      onClickConfirmation,
      getGuestAroutStand, 
      getPayType1,
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

