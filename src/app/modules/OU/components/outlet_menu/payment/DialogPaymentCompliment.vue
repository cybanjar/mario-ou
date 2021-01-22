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
              </div>

              <div class="col">
                <SInput outlined v-model="data.balance" label-text="Balance" :disable="true" readonly/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
              </div>

              <div class="col"> 
                <SInput class="q-mr-md" outlined v-model="data.cardNo" @change="(v) => { getBiltransfer2(); }" label-text="Card Number" data-layout="numeric" ref="paymentCard" @focus="showKeyboard"/>
              </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div>
            <STable
              grid
              hide-header
              hide-bottom
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
                  <q-card flat bordered>
                    <q-card-section @click="onRowClickTable(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
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
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: any;
    buttonOkEnable: boolean;
    cardNo: any;
    balance: any;
  }
  title: string;
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
}

export default defineComponent({
  props: {
    showPaymentCompliment: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    selectedPrint: { type: Object, required: true }, 
    dataTable: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        buttonOkEnable: false,
        cardNo: '',
        balance: 0
      },
      title: '',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: 'numeric',
      input: null,
      numpadVisible: false,
    });

    watch(
      () => props.showPaymentCompliment, (showPaymentCompliment) => {
        if (props.showPaymentCompliment) {
          state.data.buttonOkEnable = false;
          state.title = 'Compliment';
          state.data.balance = props.dataTable['dataTable']['saldo'];

          console.log("On Mount Compliment", props.dataTable);
          getComplimentBuildCompl();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentCompliment,
        set: (val) => {
            emit('onDialogPaymentCompliment', val, '', {});
        },
    });

    // -- HTTP Request 
    const getComplimentBuildCompl = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('complimentBuildCompl', {
            dept: props.dataTable['dataPrepare']['currDept'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response complimentBuildCompl: ', response);


          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          
          state.data.dataDetail = response['grpCompl']['grp-compl'];
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

    const getBiltransfer2 = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('biltransfer2', {
            mcStr: state.data.cardNo,
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response biltransfer2: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (response['doIt'] == 'true') {
            getCheckCreditLimit(response);
          } else {
             Notify.create({
              message: 'No such Card Number found',
              color: 'red',
            });
            state.data.cardNo = '';
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

    const getCheckCreditLimit = (responsedata) => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('biltransferCheckCreditlimit', {
            number3: responsedata['tQueasy']['t-queasy'][0]['number3'],
            mcNum: state.data.cardNo,
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response biltransferCheckCreditlimit: ', response);


          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (response['doIt']) {

          } else {
             Notify.create({
              message: 'No such Card Number found',
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

    const getInvBtnTransferPaytype56 = () => {
       state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvBtnTransferPaytype56 ', {
            recId: props.dataTable['dataThBill'][0]['rec-id'],
            guestnr: 0,
            currDept: props.dataTable['departement'],
            balanceForeign: 0,
            balance: '',
            payType: '',
            transdate: '',
            doubleCurrency: '',
            exchgRate: '',
            priceDecimal: '',
            userInit: '',
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response restInvBtnTransferPaytype56: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
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


    // On Click Listener
    const onRowClickTable = (dataRow) => {
      console.log(dataRow);
      // state.data.dataArtSelected = dataRow;
      
      let dataTable = [];
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as object;
        datarow['selected'] = false;
        dataTable.push(datarow);
      }        

      const id = dataRow['pos'];
      for (let i = 0; i<dataTable.length; i++) {
        const datarow = dataTable[i] as object;
        
        if (id === datarow['pos']) {
          datarow['selected'] = true;
          break;
        }
      }
      
      state.data.dataDetail = dataTable;
      console.log(state.data.dataDetail);
    }

    const tableHeaders = [
      {
            label: "bezeich", 
            field: "bezeich",
            name: "bezeich",
            align: "center",
      }
    ];

    // -- 
    const onOkDialog = () => {
    }

    const onCancelDialog = () => {
      emit('onDialogPaymentCompliment', false, '', {});
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
      getBiltransfer2();
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
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      getBiltransfer2,
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

