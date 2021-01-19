<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1000px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
                <p class="q-pt-md">Bill Number</p>
              </div>

              <div class="col">
                <SInput outlined v-model="data.balance" label-text="Balance" :disable="true" readonly/>
              </div>
          </div>
        </q-card-section>

        <!-- <q-card-section class="q-pa-none">
          <div>
            <div class="full-width bg-grey-3">
              <p class="q-pa-md"><strong> Print </strong></p>
            </div>
            
            <STable
              class="q-mx-md"
              grid
              hide-header
              hide-bottom
              :loading="isLoading"
              :columns="tableHeadersPrint"
              :data="data.dataTablePrint"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination">
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-sm-3 col-md-3">
                  <q-card flat bordered :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                    <q-card-section @click="onRowClickTablePrint(props.row)" >
                        <strong>{{ props.row.name }}</strong>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </STable>
          </div>
        </q-card-section> -->

        <q-card-section class="q-pa-none q-mt-sm">
          <div>
            <div class="full-width bg-grey-3">
              <p class="q-pa-md"><strong> Pay </strong></p>
            </div>

            <STable
              class="q-mx-md"
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
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmationDialog" persistent>
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
            <p class="q-ml-md">Make sure you no others transactin with Bill: <br>
                  Do you want to continue?</p>
          </div>
        </div>              
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline label="Cancel" v-close-popup />
          <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmation()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <dialogPaymentCash
      :showPaymentCash="data.showPaymentCash"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataPreparePayment="data.dataPreparePayment"
      @onDialogPaymentCash="onDialogPaymentCash" />

    <dialogPaymentCard 
      :showPaymentCard="data.showPaymentCard"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataPreparePayment="data.dataPreparePayment"
      @onDialogPaymentCard="onDialogPaymentCard" />

    <dialogPaymentCityLedger
      :showPaymentCityLedger="data.showPaymentCityLedger"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentCityLedger="onDialogPaymentCityLedger" />

    <dialogPaymentGuestFolio
      :showPaymentGuestFolio="data.showPaymentGuestFolio"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentGuestFolio="onDialogPaymentGuestFolio" />

    <dialogPaymentNonGuestFolio
      :showPaymentNonGuestFolio="data.showPaymentNonGuestFolio"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentNonGuestFolio="onDialogPaymentNonGuestFolio" />

    <dialogPaymentCompliment
      :showPaymentCompliment="data.showPaymentCompliment"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentCompliment="onDialogPaymentCompliment" />

    <dialogPaymentMasterFolio
      :showPaymentMasterFolio="data.showPaymentMasterFolio"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentMasterFolio="onDialogPaymentMasterFolio" />

    <dialogPaymentMealCoupon
      :showPaymentMealCoupon="data.showPaymentMealCoupon"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentMealCoupon="onDialogPaymentMealCoupon" />

    <dialogSelectDepartment 
      :showDialogChangeOutlet="data.showDepartment"
      :flagActivity="flag"
      @onDialogDepartment="onDialogDepartment"
      />

  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';
import DialogPaymentCityLedgerVue from './DialogPaymentCityLedger.vue';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    dataTablePrint: any;
    dataTablePayment: any;
    buttonOkEnable: boolean;
    showPaymentCash: boolean;
    showPaymentCard: boolean;
    showPaymentCityLedger: boolean;
    showPaymentGuestFolio: boolean;
    showPaymentNonGuestFolio: boolean;
    showPaymentCompliment: boolean;
    showPaymentMasterFolio: boolean;
    showPaymentMealCoupon: boolean;
    showDepartment: boolean,
    selectedPrint: {};
    selectedPayment: {};
    dataPreparePayment: {};
    balance: any,
    dataRestInvBillTransfer: {};
  }
  title: string;
  flag: string
  showConfirmationDialog: boolean;
}

export default defineComponent({
  props: {
    dialogPayment: { type: Boolean, required: true },
    dataTable: { type: null, required: true },
    dataPrepare: { type: null, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataTablePrint : [
          {
            'name': "Print Bill",
            'id': '1',
            'selected': false,
          },
          {
            'name': "Reprint Bill",
            'id': '2',
            'selected': false,
          }
        ],
        selectedPrint: {},
        dataTablePayment : [
          {
            'name': "Cash",
            'id': '1',
            'selected': false,
          },
          {
            'name': "Card",
            'id': '2',
            'selected': false,
          },
          {
            'name': "City Ledger",
            'id': '3',
            'selected': false,
          },
          {
            'name': "Transfer To Guest Folio",
            'id': '4',
            'selected': false,
          },
          {
            'name': "Transfer To Non Guest Folio",
            'id': '5',
            'selected': false,
          },
          {
            'name': "Transfer To Master Folio",
            'id': '6',
            'selected': false,
          },
          {
            'name': "Compliment",
            'id': '7',
            'selected': false,
          },
          {
            'name': "Meal Coupon",
            'id': '8',
            'selected': false,
          }
        ],
        selectedPayment: {},
        buttonOkEnable: false,
        showPaymentCash: false,
        showPaymentCard: false,
        showPaymentCityLedger: false,
        showPaymentGuestFolio: false,
        showPaymentNonGuestFolio: false,
        showPaymentCompliment: false,
        showPaymentMasterFolio: false,
        showPaymentMealCoupon: false,
        showDepartment: false,
        dataPreparePayment: {},
        balance: 0,
        dataRestInvBillTransfer: {},
      },
      title: '',
      flag: 'payment',
      showConfirmationDialog: false,
    });

    watch(
      () => props.dialogPayment, (dialogPayment) => {
        if (props.dialogPayment) {
          state.data.buttonOkEnable = false;
          state.title = 'Payment';
          
          state.data.dataPreparePayment['dataTable'] = props.dataTable;
          state.data.dataPreparePayment['dataPrepare'] = props.dataPrepare;

          state.data.balance = state.data.dataPreparePayment['dataTable']['dataThBill'][0]['saldo'];
          console.log('Dialog Payment Mount: ', props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogPayment,
        set: (val) => {
            emit('onDialogPayment', val, '', '');
        },
    });

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
          state.data.selectedPayment = datarow;
          break;
        }
      }

      let flagButton = false;
      for (let i = 0; i<state.data.dataTablePrint.length; i++) {
        const selected = state.data.dataTablePrint[i]['selected'];

        if (selected === true) {
          flagButton = true;
          break
        }
      }

      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const selected = state.data.dataTablePayment[i]['selected'];

        if (flagButton && selected === true) {
          state.data.buttonOkEnable = true;
          break
        }
      }
    }

    const onRowClickTablePrint = (dataRow) => {
      for(let i = 0; i<state.data.dataTablePrint.length; i++) {
        const datarow = state.data.dataTablePrint[i];
        datarow['selected'] = false;
      }

      const id = dataRow['id'];
      for (let i = 0; i<state.data.dataTablePrint.length; i++) {
        const datarow = state.data.dataTablePrint[i];
        if (id === datarow['id']) {
          datarow['selected'] = true;
          state.data.selectedPrint = datarow;
          break;
        }
      }

      let flagButton = false;
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const selected = state.data.dataTablePayment[i]['selected'];

        if (selected === true) {
          flagButton = true;
          break
        }
      }

      for (let i = 0; i<state.data.dataTablePrint.length; i++) {
        const selected = state.data.dataTablePrint[i]['selected'];

        if (flagButton && selected === true) {
          state.data.buttonOkEnable = true;
          break
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

    //--HTTP Request
    const zuggriff = (arrayNr, expectedNr) => {
      let zuggrifval = "false";
      async function asyncCall() {
        const [dataZuggrif] = await Promise.all([
          $api.outlet.getZugriff('checkPermission', {
            arrayNr: arrayNr,
            expectedNr: expectedNr,
            userInit:  dataStoreLogin['userInit']
          }),
        ]);

        if (dataZuggrif) {
          const responseZuggrif = dataZuggrif || [];
          const okFlag = responseZuggrif['outputOkFlag'];
          const idPayment = state.data.selectedPayment['id'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          console.log('responseZuggrif : ', responseZuggrif);
          zuggrifval = responseZuggrif['zugriff'];

          if (zuggrifval == "true") {
            if (idPayment == 1) {
              getPreparePayCash3();
            } else if (idPayment == 3) {
              getRestInvBtnTransfer();
            } else if (idPayment == 4) { 
              getRestInvBtnTransfer();
            } else if (idPayment == 5) {
              getRestInvBtnTransfer();
            } else if (idPayment == 6) {
              getRestInvBtnTransfer();
            } else if (idPayment == 7) {
              getRestInvBtnTransfer();
            } else if (idPayment == 8) {
              getRestInvBtnTransfer();
            }
          }
        }
      }
      asyncCall();
    }

    const getPreparePayCash3 = () => {
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvPayCash3', {
            pvlLanguage: 1,
            currDept: state.data.dataPreparePayment['dataPrepare']['currDept'],
            doIt: true,
            recId: state.data.dataPreparePayment['dataTable']['dataThBill'][0]['rec-id'],
            balanceForeign: "?",
            balance: "?",
            doubleCurrency: false
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

          console.log('responsePrepare : ', responsePrepare);

          if (responsePrepare['msgStr'] == "") {
            state.isLoading = false;
            onDialogPaymentCash(true);

            if (state.data.dataPreparePayment['dataPrepare']['doubleCurrency'] == "true") {
              // state.isLoading = false;
              // onDialogPaymentCash(true);
            } else {
              // if (state.data.dataPreparePayment['dataPrepare']['cashlessFlag'] == "true") {  
              //   Notify.create({
              //     message: 'Select Type Of Cash Payment',
              //     type: 'warning',
              //   });
              //   state.isLoading = false;
              //   return false;
              // }
              // state.isLoading = false;
            }
            // state.isLoading = false;
            // onDialogPaymentCash(true);
          } else {
            Notify.create({
              message: responsePrepare['msgStr'],
              type: 'warning',
            });
            state.isLoading = false;
            return false;
          }         
        }
      }
      asyncCall();
    }

    const getRestInvGetSaldo = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvGetSaldo ', {
            dept : state.data.dataPreparePayment['dataTable']['departement'],
            rechnr: state.data.dataPreparePayment['dataTable']['rechnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response get saldo: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataPreparePayment['dataTable']['saldo'] = response['amount']; 

          if (state.data.dataPreparePayment['dataTable']['saldo'] == 0) {
            Notify.create({
              message: 'Bill not found or balance already 0',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } else {
            state.showConfirmationDialog = true;
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

    const getRestInvBtnTransfer = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvBtnTransfer', {
            departement : state.data.dataPreparePayment['dataTable']['departement'],
            rechnr: state.data.dataPreparePayment['dataTable']['rechnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];
          const idPayment = state.data.selectedPayment['id'];

          console.log('response btn transfer: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (response['flag'] == 'true') {
            Notify.create({
              message: 'Bill has been splitted, use Split Bills Transfer Payment',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } else {
            if (idPayment == 8) {
              getRestInvCheckDiscart();
            } else if (idPayment == 3) {
              onDialogPaymentCityLedger(true);
            } else if (idPayment == 4) {
              getRestInvBillTransfer();
            } else if (idPayment == 5) {
              getRestInvBillTransfer();
            } else if (idPayment == 6) {
              getRestInvBillTransfer();
            } else if (idPayment == 7) {
              getRestInvBillTransfer();
            }
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

    const getRestInvBillTransfer = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('biltransferPrepare ', {
            hRecid : state.data.dataPreparePayment['dataTable']['dataThBill'][0]['rec-id'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];
          const idPayment = state.data.selectedPayment['id'];

          console.log('response bill transfer: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataRestInvBillTransfer = response;

          if (idPayment == 4) {
            getBillTransferCheckVAT();
          } else if (idPayment == 5) {
            getBillTransferCheckVAT();
          } else if (idPayment == 6) {
            getBillTransferCheckVAT();
          } else if (idPayment == 7) {
            getRestInvCheckDiscart();
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

    const getRestInvCheckDiscart = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('biltransferCheckDiscart ', {
            dept : state.data.dataPreparePayment['dataTable']['departement'],
            rechnr: state.data.dataPreparePayment['dataTable']['rechnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response check discount: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (response['itExist'] == 'true') {
            Notify.create({
              message: 'Discount exists, posting not possible',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } else {
            const idPayment = state.data.selectedPayment['id'];

            if (idPayment == 7) {
             onDialogPaymentCompliment(true);
            } else if (idPayment == 8) {
              onDialogPaymentMealCoupon(true);
            }
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

    const getBillTransferCheckVAT = () => {
      state.isLoading = true;

      async function asyncCall() {

        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('biltransferCheckVAT ', {
            recId : state.data.dataPreparePayment['dataTable']['dataThBill'][0]['rec-id'],
            multiVat: state.data.dataRestInvBillTransfer['multiVat'],
            balance: state.data.dataPreparePayment['dataTable']['saldo'],
            closed: false,
            splitted: state.data.dataRestInvBillTransfer['splitted'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];
          const idPayment = state.data.selectedPayment['id'];

          console.log('response getBillTransferCheckVAT: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (response['flCode'] == 0) {
            if (idPayment == 4) {
              onDialogPaymentGuestFolio(true, '', {});
            } else if (idPayment == 5) {
              onDialogDepartment(true, null);
            } else if (idPayment == 6) {
              onDialogPaymentMasterFolio(true);
            }
            state.isLoading = false;
          } else {
            Notify.create({
              message: 'Transfer not allowed: Other Payment found',
              color: 'red',
            });
            state.isLoading = false;
            return false;
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

    // -- OnClick Listener 
    const onOkDialog = () => {
      const idPayment = state.data.selectedPayment['id'];
      
      if (idPayment == 1) {
        zuggriff(20, 2);
      } else if (idPayment == 2) {
        onDialogPaymentCard(true);
      } else if (idPayment == 3) {
        getRestInvGetSaldo();
      } else if (idPayment == 4) {
        getRestInvGetSaldo();
      } else if (idPayment == 5) {
        getRestInvGetSaldo();
      } else if (idPayment == 6) {
        getRestInvGetSaldo();
      } else if (idPayment == 7) {
        getRestInvGetSaldo();
      } else if (idPayment == 8) {
        getRestInvGetSaldo();
      } else {
        
      }
    }

    const onCancelDialog = () => {
      for(let i = 0; i<state.data.dataTablePrint.length; i++) {
        const datarow = state.data.dataTablePrint[i];
        datarow['selected'] = false;
      }

      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        datarow['selected'] = false;
      }  

      state.data.selectedPrint = {};
      state.data.selectedPayment = {};
      state.data.buttonOkEnable = false;
      state.isLoading = false;
      emit('onDialogPayment', false, '', '');
    }

    const onClickConfirmation = () => {
      const idPayment = state.data.selectedPayment['id'];

      if (idPayment == 8) {
        zuggriff(19, 2);
      } else if (idPayment == 3) {
        zuggriff(20, 2);
      } else if (idPayment == 4) {
        zuggriff(20, 2);
      } else if (idPayment == 5) {
        zuggriff(20, 2);
      } else if (idPayment == 6) {
        zuggriff(20, 2);
      } else if (idPayment == 7) {
        zuggriff(20, 2);
      }
    }


    // -- On Dialog Method
    const onDialogPaymentCash = (val) => {
      state.data.showPaymentCash = val;
    }

    const onDialogPaymentCard = (val) => {
      state.data.showPaymentCard = val;
    }

    const onDialogPaymentCityLedger = (val) => {
      state.data.showPaymentCityLedger = val;
    }

    const onDialogPaymentGuestFolio = (val, flag, data) => {
      state.data.showPaymentGuestFolio = val;

      if (!val && flag == 'ok') {
        state.data.selectedPrint = {};
        state.data.selectedPayment = {};
        state.data.buttonOkEnable = false;
        state.isLoading = false;
        console.log('payment data : ', data);
        emit('onDialogPayment', false, 'ok', data);
      }
    }

    const onDialogPaymentNonGuestFolio = (val) => {
      state.data.showPaymentNonGuestFolio = val;
    }

    const onDialogPaymentCompliment = (val) => {
      state.data.showPaymentCompliment = val;
    }

    const onDialogPaymentMasterFolio = (val) => {
      state.data.showPaymentMasterFolio = val;
    }

    const onDialogPaymentMealCoupon = (val) => {
      state.data.showPaymentMealCoupon = val;
    }

    const onDialogDepartment = (val, data) => {
      state.data.showDepartment = val;

      if (!val && data != null) {
        state.data.dataPreparePayment['dataHotelSelected'] = data;
        onDialogPaymentNonGuestFolio(true);
      }
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersPrint,
      onRowClickTablePayment,
      onRowClickTablePrint,
      onOkDialog,
      onCancelDialog,
      onDialogPaymentCash,
      onDialogPaymentCard,
      onDialogPaymentCityLedger,
      onDialogPaymentGuestFolio,
      onDialogPaymentNonGuestFolio,
      onDialogPaymentCompliment, 
      onDialogPaymentMasterFolio,
      onDialogPaymentMealCoupon,
      getRestInvGetSaldo,
      onClickConfirmation,
      getRestInvBtnTransfer,
      onDialogDepartment,
      pagination: { rowsPerPage: 0 },
    };
  },
  components: {
    dialogPaymentCash: () => import('./DialogPaymentCash.vue'),
    dialogPaymentCard: () => import('./DialogPaymentCard.vue'),
    dialogPaymentCityLedger: () => import('./DialogPaymentCityLedger.vue'),
    dialogPaymentGuestFolio: () => import('./DialogPaymentGuestFolio.vue'),
    dialogPaymentNonGuestFolio: () => import('./DialogPaymentNonGuestFolio.vue'),
    dialogPaymentCompliment:() => import('./DialogPaymentCompliment.vue'),
    dialogPaymentMasterFolio:() => import('./DialogPaymentMasterFolio.vue'),
    dialogPaymentMealCoupon:() => import('./DialogPaymentMealCoupon.vue'),
    dialogSelectDepartment: () => import('./../DialogChangeOutlet.vue')
  }
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
</style>

