<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="row q-gutter-xs">
              <div class="col">
                <q-radio class="q-pt-md" v-model="data.paymentType" label="Cash" val="0"/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.balance" label-text="Balance"  readonly/>
              </div>
          </div>

          <div class="row q-gutter-xs">
              <div class="col">
                <q-radio class="q-pt-md" v-model="data.paymentType" label="Voucher" val="1"/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.payment" label-text="Payment" data-layout="numeric" ref="paymentBox" @focus="showKeyboard" @input="onChangePaymentInput()"/>
              </div>
          </div>

          <div class="row q-gutter-xs">
              <div class="col">
                <SInput v-model="data.voucherNr" class="q-mr-md" outlined  label-text="Voucher Number" :disable="data.paymentType != '1'"/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.change" label-text="Changed" :disable="true" readonly/>
              </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div>
            <div class="full-width bg-grey-3">
              <p class="q-pa-md"><strong> Money </strong></p>
            </div>

            <STable
              grid
              hide-header
              hide-bottom
              :loading="isLoading"
              :columns="tableHeadersPrint"
              :data="data.dataTablePayment"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination">
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xl-3 col-sm-3 col-md-3">
                  <q-card flat bordered>
                    <q-card-section @click="onRowClickTablePayment(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                        <strong>{{ props.row.name }}</strong>
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
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify, date } from 'quasar';
import VueTouchKeyboard from "vue-touch-keyboard";

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    dataTablePayment: any;
    buttonOkEnable: boolean;
    paymentType: string;
    voucherNr: string;
    payment: any;
    balance: any;
    change: any
  }
  title: string;
  layout: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  options: {};
  input: null;
  numpadVisible: boolean,
}

export default defineComponent({
  props: {
    showPaymentCash: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    dataPreparePayment: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataTablePayment : [
          {
            'name': "100000",
            'id': '1',
            'selected': false,
            'value': 100000
          },
          {
            'name': "50000",
            'id': '2',
            'selected': false,
            'value': 50000
          },
          {
            'name': "20000",
            'id': '3',
            'selected': false,
            'value': 20000
          },
          {
            'name': "10000",
            'id': '4',
            'selected': false,
            'value': 10000
          },
          {
            'name': "5000",
            'id': '5',
            'selected': false,
            'value': 5000
          },
          {
            'name': "2000",
            'id': '6',
            'selected': false,
            'value': 2000
          },
          {
            'name': "1000",
            'id': '7',
            'selected': false,
            'value': 1000
          },
          {
            'name': "500",
            'id': '8',
            'selected': false,
            'value': 500
          }
        ],
        buttonOkEnable: false,
        paymentType: "0",
        voucherNr: "",
        payment: 0,
        balance: 0,
        change: 0,
      },
      title: '',
      layout: 'numeric',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      input: null,
      numpadVisible: false,
    });

    watch(
      () => props.showPaymentCash, (showPaymentCash) => {
        if (props.showPaymentCash) {
          state.data.buttonOkEnable = false;
          state.title = 'Payment Cash';
          state.data.balance = props.dataPreparePayment['dataTable']['saldo'];
          state.data.payment = -props.dataPreparePayment['dataTable']['saldo'];
          state.data.change = 0;

          console.log("dialog cash mounted, data prepare : ", props.dataPreparePayment);
          console.log("selected payment : ", props.selectedPayment);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentCash,
        set: (val) => {
            emit('onDialogPaymentCash', val, '', {});
        },
    });

    // -- HTTP Request 
    const getPreparePayCash4 = () => {
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvPayCash4', {
            recId: props.dataPreparePayment['dataTable']['dataThBill'][0]['rec-id'],
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            currDept: props.dataPreparePayment['dataPrepare']['currDept'],
            discArt1: props.dataPreparePayment['dataPrepare']['discArt1'],
            discArt2: props.dataPreparePayment['dataPrepare']['discArt2'],
            discArt3: props.dataPreparePayment['dataPrepare']['discArt3'],
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

          console.log('restInvPayCash4 : ', responsePrepare);
          emit('onDialogPaymentCash', false, 'ok', responsePrepare);
          state.isLoading = false;
        }
      }
      asyncCall();
    }

    const getPreparePayCash5 = () => {

      console.log( {
            multiCash: false,
            cashArtno: props.dataPreparePayment['prepareCash']['tHArtikel']['t-h-artikel'][0]['artnr'],
            currDept: props.dataPreparePayment['dataPrepare']['currDept'],
            cashForeign: false,
            payVoucher : false,
            voucherNr : state.data.voucherNr == '' ? '0' : state.data.voucherNr,
            amount  : state.data.payment,
          });
      
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvPayCash5', {
            multiCash: false,
            cashArtno: props.dataPreparePayment['prepareCash']['tHArtikel']['t-h-artikel'][0]['artnr'],
            currDept: props.dataPreparePayment['dataPrepare']['currDept'],
            cashForeign: false,
            payVoucher: false,
            voucherNr: state.data.voucherNr == '' ? '0' : state.data.voucherNr,
            amount: state.data.payment,
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

          console.log('restInvPayCash5 : ', responsePrepare);
          state.isLoading = false;
        }
      }
      asyncCall();
    }
    
    // -- On Click listener
    const onRowClickTablePayment = (dataRow) => {
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        datarow['selected'] = false;
      }        

      const id = dataRow['id'];
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        
        if (id === datarow['id']) {
          datarow['selected'] = true;
          state.data.payment = -datarow['value'];

          state.data.change = (state.data.payment - state.data.balance) * -1;
          break;
        }
      }
    }

    const tableHeadersPrint = [
      {
            label: "name", 
            field: "name",
            name: "name",
            align: "center",
        }, {
            label: "id", 
            field: "id",
            name: "id",
            align: "center",
        },
    ];

    // -- 
    const onOkDialog = () => {
      // const fullpaid = -state.data.payment - state.data.balance >= 0 ? true : false;
      const fullpaid = true;
      const amount = -state.data.payment - state.data.balance;
      console.log('amount : ', amount);
      console.log('fullpaid : ', fullpaid);

      if (amount == 0 && fullpaid) {
        getPreparePayCash4();
      } else if (amount != 0 || fullpaid) { 
        getPreparePayCash5();
        console.log('paycash 5');
      } else if (amount != 0 && fullpaid) {
      // paycash6
      console.log('paycash 6');
      }

      // getPreparePayCash3();
      
      // if (props.dataSelectedOrderTaker != null) {
      //   // emit('onDialogMenuOrderTaker', false, props.dataSelectedOrderTaker);
      // } 
    }

    const onCancelDialog = () => {
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        datarow['selected'] = false;
      }     
      emit('onDialogPaymentCash', false, '', {});
    }

    // --
    const onChangePaymentInput = () => {
      state.data.change = ((state.data.payment * -1) - state.data.balance);
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
      tableHeadersPrint,
      onRowClickTablePayment,
      onOkDialog,
      onCancelDialog,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      onChangePaymentInput,
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

