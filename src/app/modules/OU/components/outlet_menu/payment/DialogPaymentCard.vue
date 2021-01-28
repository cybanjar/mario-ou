<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row">
            <div class="col">
              <q-space />
            </div>

              <div class="col">
                <SInput outlined v-model="data.balance" label-text="Balance" :disable="true" readonly/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <q-space />
            </div>

              <div class="col">
                <SInput outlined v-model="data.payment" label-text="Payment" data-layout="numeric" ref="paymentBox" @focus="showKeyboard"/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
                <SInput outlined v-model="data.cardSelected" label-text="Debit" :disable="true" readonly/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.cardNumber" label-text="References" data-layout="compact" ref="refBox" @focus="showKeyboard" />
              </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-sm">
            <STable
              hide-bottom
              grid
              hide-header
              :loading="isLoading"
              :columns="tableHeaders"
              :data="data.dataDetail"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination">
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xl-3 col-sm-3 col-md-3">
                  <q-card>
                    <q-card-section @click="onRowClickTablePayment(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                        <strong>{{ props.row.bezeich }}</strong>
                    </q-card-section>
                  </q-card>
                </div>
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

        <q-card-actions align="right">
          <q-btn outline color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog"/>
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
                <p class="q-ml-md">Confirm the credit card payment with {{data.cardSelected}} / {{data.cardNumber}} <br>Payment Amount = {{data.payment}} ? </p>
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
    dataDetail: any;
    buttonOkEnable: boolean;
    cardSelected: string
    cardNumber: string,
    balance: any,
    payment: any,
    objCardSelected: {},
    fullPaid: boolean
  }
  title: string;
  layout: string;
  options: {};
  input: null;
  numpadVisible: boolean,
  showConfirmationDialog: boolean,
}

export default defineComponent({
  props: {
    showPaymentCard: { type: Boolean, required: true },
    flagSplit: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    dataPreparePayment: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        buttonOkEnable: false,
        cardSelected: '',
        cardNumber: "",
        balance: 0,
        payment: 0,
        objCardSelected: {},
        fullPaid: true
      },
      title: '',
      layout: 'compact',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      input: null,
      numpadVisible: false,
      showConfirmationDialog: false,
    });

    watch(
      () => props.showPaymentCard, (showPaymentCard) => {
        if (props.showPaymentCard) {
          state.data.buttonOkEnable = false;
          state.title = 'Payment Card';

          state.data.balance = props.dataPreparePayment['dataTable']['saldo'];
          state.data.payment = -props.dataPreparePayment['dataTable']['saldo'];

          getDataArticle();
          console.log("selectedPayment", props.dataPreparePayment);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentCard,
        set: (val) => {
            emit('onDialogPaymentCard', val, '', {});
        },
    });

    const tableHeaders = [
      {
        label: "Name", 
        field: "bezeich",
        name: "bezeich",
        align: "left",
      }
    ];

    // -- HTTP Request 
    const getDataArticle = () => {
      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getCommonOutletUserList('loadHArtikel', {
            "caseType": "1",
            "dept": props.dataPreparePayment['dataPrepare']['currDept'],
            "artType": "7"
           }),
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
          state.data.dataDetail = response['tHArtikel']['t-h-artikel'];
          state.isLoading = false;
          console.log('response prepare : ', response);
        }
      }
      asyncCall();
    }

    const getRestInvCC2 = () => {
      state.isLoading = true;
      
      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvBtnCcard2', {
            billart  : state.data.objCardSelected['artnr'],
            recId: props.dataPreparePayment['dataTable']['dataThBill'][0]['rec-id'],
            currDept: props.dataPreparePayment['dataPrepare']['currDept'],
            balance : state.data.balance,
            paid: state.data.payment,
            balanceForeign: state.data.balance,
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            exchgRate: props.dataPreparePayment['dataPrepare']['exchgRate'],
            fullPaid: state.data.fullPaid,
            discArt1: props.dataPreparePayment['dataPrepare']['discArt1'],
            discArt2: props.dataPreparePayment['dataPrepare']['discArt2'],
            discArt3: props.dataPreparePayment['dataPrepare']['discArt3'],
            kellnerKellnerNr: props.dataPreparePayment['dataTable']['kellner-nr'],
           })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response restInvBtnCcard2: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
          
          response['dataSelected'] = state.data.objCardSelected; 
          emit('onDialogPaymentCard', false, 'ok', response);
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

    // -- On Clik Listener 
    const onRowClickTablePayment = (dataRow) => {
      state.data.objCardSelected = {};
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i];
        datarow['selected'] = false;
      }        

      const id = dataRow['artnr'];
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i];
        
        if (id === datarow['artnr']) {
          datarow['selected'] = true;
          state.data.objCardSelected = datarow;
          state.data.cardSelected = datarow['bezeich'];
          break;
        }
      }

      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const selected = state.data.dataDetail[i]['selected'];

        if (selected === true) {
          state.data.buttonOkEnable = true;
          break
        }
      }
      console.log(state.data.objCardSelected)
    }

    const onClickConfirmation = () => {
      getRestInvCC2();
    }

    const onOkDialog = () => {
      const dif = (parseInt(state.data.payment) * -1) - parseInt(state.data.balance)
      state.data.fullPaid = dif >= 0 ? true : false;
      console.log('fullpaid : ', state.data.fullPaid);

      if (state.data.payment > 0 && state.data.cardSelected != "" && state.data.cardNumber != '') {
        state.showConfirmationDialog = true;
      } else {
        let msg = '';
        console.log('dif : ', dif);

        if (state.data.payment == 0 || dif != 0) {
          msg = 'Payment incorrect';
          Notify.create({
            message: msg,
            color: 'red',
          });
          state.showConfirmationDialog = true;
        } else if (state.data.cardSelected == "") {
          msg = 'Select Credit Card type';
          Notify.create({
            message: msg,
            color: 'red',
          });
          return false;
        } else if (state.data.cardNumber == "") {
          msg = 'Credit Card Number left unfiiled';
          Notify.create({
            message: msg,
            color: 'red',
          });
          state.showConfirmationDialog = true;
        } else {
          state.showConfirmationDialog = true;
        }
      }
    }

    const onCancelDialog = () => {
      state.data.cardNumber = '';
      state.data.payment = '';
      state.showConfirmationDialog = false;
      state.data.cardSelected = '';
      state.data.objCardSelected = {};

      emit('onDialogPaymentCard', false, '', {});
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
      onRowClickTablePayment,
      onOkDialog,
      onCancelDialog,
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

