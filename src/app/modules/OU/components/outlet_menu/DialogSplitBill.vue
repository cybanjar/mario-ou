<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1100px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section style="max-height: 70vh" class="scroll">
          <div
            class="row q-gutter-sm q-mx-sm"
          >
            <q-card flat bordered @click="zuggriff(20, 2, 1)">
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/CashPayment1.svg"
                >
                <q-tooltip>
                  Cash Payment
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered @click="zuggriff(20, 2, 2)">
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/CCPayment1.svg"
                >
                <q-tooltip>
                  Credit Cash Payment
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered @click="zuggriff(20, 2, 3)">
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/CityLedger.svg"
                >
                <q-tooltip>
                  City Ledger/ Transfer
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered @click="zuggriff(20, 2, 4)">
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/TransferRoom.svg"
                >
                <q-tooltip>
                  Transfer To Guest Folio
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered @click="zuggriff(20, 2, 5)">
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/GuestStayBillPayment.svg"
                >
                <q-tooltip>
                  Transfer To Non Guest Folio
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered @click="zuggriff(20, 2, 6)">
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/MasterBill.svg"
                >
                <q-tooltip>
                  Transfer To Master Folio
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered>
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/rePrintBill1.svg"
                >
                <q-tooltip>
                  Table Transfer
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered>
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/PrintOrderChecker.svg"
                >
                <q-tooltip>
                  Print Order Taker
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <STable
                class="my-sticky-header-table"
                flat
                style="max-height: 300px"
                :loading="isLoading"
                bordered
                :columns="tableHeadersMainBill"
                :data="data.dataTableMainBill"
                row-key="name"
                separator="cell"
                :rows-per-page-options="[5, 10]"
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
                      @click="onClickMoveRight(props.row)">
                        {{ col.value }}
                    </q-td>
                  </q-tr>
                </template>
              </STable>
            </div>

            <!-- <div class="row items-center">
              <div class="col q-gutter-xs">
                <q-btn unelevated color="primary" icon="mdi-chevron-left" @click="onClickMoveLeft"/>
              </div>
            </div>

            <div class="row items-center">
              <div class="col">
                <q-btn unelevated color="primary" icon="mdi-chevron-right" @click="onClickMoveRight" />
              </div>
            </div> -->

            <div class="col">
                <STable
                    class="my-sticky-header-table"
                    flat
                    style="max-height: 300px"
                    bordered
                    :loading="isLoading"
                    :columns="tableHeadersSplitBill"
                    :data="data.dataTableSplitBill"
                    row-key="name"
                    separator="cell"
                    :rows-per-page-options="[5, 10]"
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
                          @click="onClickMoveLeft(props.row)">
                            {{ col.value }}
                        </q-td>
                      </q-tr>
                    </template>
                </STable>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-ma-sm row">
            <div class="col-md-8">
              <q-btn flat unelevated color="primary" icon="mdi-chevron-left" @click="onClickChangeCounter('min')"/>
              <q-avatar rounded color="primary" text-color="white">{{data.counter}}</q-avatar>
              <q-btn flat unelevated color="primary" icon="mdi-chevron-right" @click="onClickChangeCounter('plus')"/>
            </div>
            <div class="col-md-4">
              <SInput outlined v-model="data.balance" label-text="Amount" :disable="true" readonly/>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline unelevated color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <dialogPaymentCash
      :showPaymentCash="showPaymentCash"
      :flagSplit="true"
      :selectedPayment="data.selectedPayment"
      :dataPreparePayment="data.dataPreparePayment"
      @onDialogPaymentCash="onDialogPaymentCash" />

    <dialogPaymentCard 
      :showPaymentCard="showPaymentCard"
      :flagSplit="true"
      :selectedPayment="data.selectedPayment"
      :dataPreparePayment="data.dataPreparePayment"
      @onDialogPaymentCard="onDialogPaymentCard" />

    <dialogPaymentCityLedger
      :showPaymentCityLedger="showPaymentCityLedger"
      :flagSplit="true"
      :selectedPayment="data.selectedPayment"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentCityLedger="onDialogPaymentCityLedger" />

    <dialogPaymentGuestFolio
      :showPaymentGuestFolio="showPaymentGuestFolio"
      :flagSplit="true"
      :selectedPayment="data.selectedPayment"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentGuestFolio="onDialogPaymentGuestFolio" />

    <dialogPaymentMasterFolio
      :showPaymentMasterFolio="showPaymentMasterFolio"
      :flagSplit="true"
      :selectedPayment="data.selectedPayment"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentMasterFolio="onDialogPaymentMasterFolio" />

    <dialogSelectDepartment 
      :showDialogChangeOutlet="showDepartment"
      flagActivity="payment"
      :flagSplit="true"
      @onDialogDepartment="onDialogDepartment"/>

    <dialogPaymentNonGuestFolio
      :showPaymentNonGuestFolio="showPaymentNonGuestFolio"
      :flagSplit="true"
      :selectedPayment="data.selectedPayment"
      :dataTable="data.dataPreparePayment"
      @onDialogPaymentNonGuestFolio="onDialogPaymentNonGuestFolio" />

      <q-dialog v-model="showDialogKpr" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirmation</q-toolbar-title>
            </q-toolbar>

          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-md-2">
                <q-avatar icon="mdi-help" color="negative" text-color="white" />
              </div>
              <div class="col-md-10">                  
                <p class="q-ml-md">Print the bill?</p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline color="primary" label="Cancel" @click="onClickDialogKpr(false)" />
              <q-btn unelevated label="Ok" color="primary" @click="onClickDialogKpr(true)" />
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
    dataTableSplitBill: any;
    dataTableMainBill: any;
    dataTableMain: any;
    buttonOkEnable: boolean;
    counter: any,
    balance: any,
    selectedPayment: {},
    dataPreparePayment: {},
    dataTablePayment: any,
    askKpr: boolean,
  }
  title: string;
  showPaymentCash: boolean;
  showPaymentCard: boolean;
  showPaymentCityLedger: boolean;
  showPaymentGuestFolio: boolean;
  showPaymentNonGuestFolio: boolean;
  showPaymentCompliment: boolean;
  showPaymentMasterFolio: boolean;
  showPaymentMealCoupon: boolean;
  showDepartment: boolean;
  showDialogKpr: boolean;

}

export default defineComponent({
  props: {
    showDialogSplitBill: { type: Boolean, required: true },
    dataTable: { type: Object, required: true },
    dataPrepare: { type: Object, required: true },
    dataSelectedSplitBill: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      data: {
        dataTableSplitBill : [],
        dataTableMainBill : [],
        dataTableMain : [],
        buttonOkEnable: false,
        counter: 1,
        balance: 0,
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
        dataPreparePayment: {},
        askKpr: true,
      },
      title: '',
      showPaymentCash: false,
      showPaymentCard: false,
      showPaymentCityLedger: false,
      showPaymentGuestFolio: false,
      showPaymentNonGuestFolio: false,
      showPaymentCompliment: false,
      showPaymentMasterFolio: false,
      showPaymentMealCoupon: false,
      showDepartment: false, 
      showDialogKpr: false,
    });

    watch(
      () => props.showDialogSplitBill, (showDialogSplitBill) => {
        if (props.showDialogSplitBill) {
          state.data.buttonOkEnable = false;
          state.title = 'Split Bill';

          state.data.dataPreparePayment['dataTable'] = props.dataTable;
          state.data.dataPreparePayment['dataPrepare'] = props.dataPrepare;

          console.log('On Mount Split Bill');

          state.data.dataTableMainBill = state.data.dataTableMain.slice()
          getPrepare();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogSplitBill,
        set: (val) => {
            emit('onDialogSplitBill', val, "");
        },
    });

    // -- HTTP Request method
    const zuggriff = (arrayNr, expectedNr, idPayment) => {
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
              if (state.data.balance !=0) {
                onDialogPaymentCash(true, '', {});
              }
            } else if (idPayment == 2) {
              if (state.data.balance !=0) {
                onDialogPaymentCard(true, '', {});
              }
            } else if (idPayment == 3) {
              if (state.data.balance !=0) {
                onDialogPaymentCityLedger(true, '', {});
              }
            } else if (idPayment == 4) { 
              if (state.data.balance !=0) {
                onDialogPaymentGuestFolio(true, '', {});
              }
            } else if (idPayment == 5) {
              if (state.data.balance != 0) {
                onDialogDepartment(true, null);
              }
            } else if (idPayment == 6) {
              if (state.data.balance != 0) {
                onDialogPaymentMasterFolio(true, '', {});
              }
            }
          }
        }
      }
      asyncCall();
    }

    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('splitbillPrepare', {
            dept : props.dataPrepare['currDept'],
            tischnr: props.dataTable['tischnr']
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

          state.data.dataTableMain = response['tHBillLine']['t-h-bill-line'];
          const dataMainTable = state.data.dataTableMain.slice();
          for(let i = 0; i<dataMainTable.length; i++) {
            const datarow = dataMainTable[i];
            if (datarow['waehrungsnr'] == 0) {
              state.data.dataTableMainBill.push(datarow);
            }

            if (datarow['waehrungsnr'] == state.data.counter) {
              state.data.dataTableSplitBill.push(datarow);
            }
          }

          getCalBalance(false);
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

    const getCalBalance = (fromButton) => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('splitbillCalBalance', {
            currSelect: state.data.counter,
            tRechnr: props.dataTable['dataThBill'][0]['rechnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response splitbillCalBalance: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          const dataBillLine = response['tHBillLine']['t-h-bill-line'];
          let balance = 0;
          for (let i = 0; i<dataBillLine.length; i++) {
            const datarow = dataBillLine[i];
            const betrag = datarow['betrag'];
            balance = balance + betrag
          }
          state.data.balance = balance;

          if (fromButton) {
            if (state.data.counter != 0) {
              var dataTable = state.data.dataTableMain;
              var newDataTable = [];
              dataTable.forEach(function(item, index, object) {
                const currCounter = item['waehrungsnr'];
                
                if (currCounter == state.data.counter) {
                  newDataTable.push(item);
                }
              });
              state.data.dataTableSplitBill = [];
              state.data.dataTableSplitBill = newDataTable;   
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
          state.isLoading = false;

          state.data.dataPreparePayment['dataTable']['saldo'] = response['amount']; 
          if (state.data.askKpr) {
            state.showDialogKpr = true;
          } else {
            if (state.data.dataPreparePayment['dataTable']['saldo'] == 0) {
              emit('onDialogSplitBill', false, "ok");
            } else {
              getPrepare();
            }
          }
            
          // if (state.data.dataPreparePayment['dataTable']['saldo'] == 0) {
          //   emit('onDialogSplitBill', false, "ok");
          // } else {
          //   getPrepare();
          // }
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

    const getSplitBuildLMenu = (dataRow) => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('splitbillSelectLmenu', {
            dept: props.dataPrepare['currDept'],
            recId: props.dataTable['dataThBill'][0]['rec-id'],
            recIdHBillLine: dataRow['rec-id'],
            currSelect: state.data.counter,
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response splitbillSelectLmenu: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataTableMainBill.forEach(function(item, index, object) {
            if (item['rec-id'] == dataRow['rec-id']) {
              item['selected'] = !item['selected'];
            }
          });

          var dataTable = state.data.dataTableMainBill.slice()
          let index = dataTable.length - 1;

          while (index >= 0) {
            if (dataTable[index]['selected']) {
              dataTable[index]['waehrungsnr'] = state.data.counter;
              state.data.dataTableSplitBill.push(dataTable[index]);
              dataTable.splice(index, 1);
            }
            index -= 1;
          }

          // Assign Counter to Native Data
          for (let i = 0; i<state.data.dataTableMain.length; i++) {
            const dataRowI = state.data.dataTableMain[i];
            for (let x = 0; x<state.data.dataTableMainBill.length; x++) {
              const dataRowX = state.data.dataTableMainBill[x];
              if (dataRowI['rec-id'] == dataRowX['rec-id']) {
                dataRowI['waehrungsnr'] = dataRowX['waehrungsnr'];
              }
            }

            for (let y = 0; y<state.data.dataTableSplitBill.length; y++) {
              const dataRowY = state.data.dataTableSplitBill[y];
              if (dataRowI['rec-id'] == dataRowY['rec-id']) {
                dataRowI['waehrungsnr'] = dataRowY['waehrungsnr'];
              }
            }
          }
    
          state.data.dataTableSplitBill.forEach(function(item, index, object) {
            item['selected'] = false;
          });
          state.data.dataTableMainBill = dataTable;

          getCalBalance(false);

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

     const getSplitBuildRMenu = (dataRow) => {
      state.isLoading = true;

      console.log({
            dept: props.dataPrepare['currDept'],
            recId: props.dataTable['dataThBill'][0]['rec-id'],
            currSelect: state.data.counter,
            recIDhBillLine: dataRow['rec-id']
          })
      
      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('splitbillSelectRmenu', {
            dept: props.dataPrepare['currDept'],
            recId: props.dataTable['dataThBill'][0]['rec-id'],
            currSelect: state.data.counter,
            recIdHBillLine: dataRow['rec-id']
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response splitbillSelectRmenu: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataTableSplitBill.forEach(function(item, index, object) {
            if (item['rec-id'] == dataRow['rec-id']) {
              item['selected'] = !item['selected'];
            }
          });

          var dataTable = state.data.dataTableSplitBill.slice()
          let index = dataTable.length - 1;

          while (index >= 0) {
            if (dataTable[index]['selected']) {
              dataTable[index]['waehrungsnr'] = 0;
              state.data.dataTableMainBill.push(dataTable[index]);
              dataTable.splice(index, 1);
            }
            index -= 1;
          }

          // Assign Counter to Native Data
          for (let i = 0; i<state.data.dataTableMain.length; i++) {
            const dataRowI = state.data.dataTableMain[i];
            for (let x = 0; x<state.data.dataTableMainBill.length; x++) {
              const dataRowX = state.data.dataTableMainBill[x];
              if (dataRowI['rec-id'] == dataRowX['rec-id']) {
                dataRowI['waehrungsnr'] = dataRowX['waehrungsnr'];
              }
            }

            for (let y = 0; y<state.data.dataTableSplitBill.length; y++) {
              const dataRowY = state.data.dataTableSplitBill[y];
              if (dataRowI['rec-id'] == dataRowY['rec-id']) {
                dataRowI['waehrungsnr'] = dataRowY['waehrungsnr'];
              }
            }
          }
    
          state.data.dataTableSplitBill.forEach(function(item, index, object) {
            item['selected'] = false;
          });
          state.data.dataTableSplitBill = dataTable;

          getCalBalance(false);

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

    // -- On Click Listener
    const onRowClickSplitBill = (dataRow) => {
      state.data.dataTableSplitBill.forEach(function(item, index, object) {
        if (item['rec-id'] == dataRow['rec-id']) {
          item['selected'] = !item['selected'];
        }
      });
    }

    const onRowClickMainBill = (dataRow) => {
      state.data.dataTableMainBill.forEach(function(item, index, object) {
        if (item['rec-id'] == dataRow['rec-id']) {
          item['selected'] = !item['selected'];
        }
      });
    }

    const onClickMoveRight = (dataRow) => {
      let flag = true;
      for (let i = 0; i<state.data.dataTableMain.length;i++) {
        if (state.data.counter == state.data.dataTableMain[i]['waehrungsnr'] ) {
          if (state.data.dataTableMain[i]['paid-flag'] == 1) {
            flag = false;
            break;
          }
        }
      }

      console.log('dataRow : ' , dataRow);

      if (flag) {
        getSplitBuildLMenu(dataRow);
      } else {
         Notify.create({
          message: 'PAID: Split Bill No ' + state.data.counter + "\Select other one",
          color: 'red',
        });
      }
    }

    const onClickMoveLeft = (dataRow) => {
      if (dataRow['paid-flag'] == 0) {
        getSplitBuildRMenu(dataRow);
        // state.data.dataTableSplitBill.forEach(function(item, index, object) {
        //   if (item['rec-id'] == dataRow['rec-id']) {
        //     item['selected'] = !item['selected'];
        //   }
        // });

        // var dataTable = state.data.dataTableSplitBill.slice()
        // let index = dataTable.length - 1;

        // while (index >= 0) {
        //   if (dataTable[index]['selected']) {
        //     dataTable[index]['waehrungsnr'] = 0;
        //     state.data.dataTableMainBill.push(dataTable[index]);
        //     dataTable.splice(index, 1);
        //   }
        //   index -= 1;
        // }

        // // Assign Counter to Native Data
        // for (let i = 0; i<state.data.dataTableMain.length; i++) {
        //   const dataRowI = state.data.dataTableMain[i];
        //   for (let x = 0; x<state.data.dataTableMainBill.length; x++) {
        //     const dataRowX = state.data.dataTableMainBill[x];
        //     if (dataRowI['rec-id'] == dataRowX['rec-id']) {
        //       dataRowI['waehrungsnr'] = dataRowX['waehrungsnr'];
        //     }
        //   }

        //   for (let y = 0; y<state.data.dataTableSplitBill.length; y++) {
        //     const dataRowY = state.data.dataTableSplitBill[y];
        //     if (dataRowI['rec-id'] == dataRowY['rec-id']) {
        //       dataRowI['waehrungsnr'] = dataRowY['waehrungsnr'];
        //     }
        //   }
        // }
  
        // state.data.dataTableSplitBill.forEach(function(item, index, object) {
        //   item['selected'] = false;
        // });
        // state.data.dataTableSplitBill = dataTable;
      }  else {
        Notify.create({
          message: 'PAID: Split Bill No ' + dataRow['waehrungsnr'] + "\nDeselecting no longer posible",
          color: 'red',
        });
      }
      
    }

    const onClickChangeCounter = (flag) => { 
      if (flag == "min") {
        if (state.data.counter >= 2) {
          state.data.counter--;
        }
      } else {
        state.data.counter++;
      }     
      getCalBalance(true);      
    }

    const onOkDialog = () => {
      state.data.counter = 1;
      state.data.dataTableMain = [];
      state.data.dataTableMainBill = [];
      state.data.dataTableSplitBill = [];

      emit('onDialogSplitBill', false, "");
    }

    const onCancelDialog = () => {
      state.data.counter = 1;
      state.data.dataTableMain = [];
      state.data.dataTableMainBill = [];
      state.data.dataTableSplitBill = [];
      emit('onDialogSplitBill', false, "");
    }

    const onClickDialogKpr = (isOk) => {
      state.showDialogKpr = false;
      
      if (state.data.dataPreparePayment['dataTable']['saldo'] == 0) {
        emit('onDialogSplitBill', false, "ok");
      } else {
        getPrepare();
      }
    }

    // -- On Dialog Listener
    const onDialogPaymentCash = (val, flag, data) => {
      state.data.selectedPayment = state.data.dataTablePayment[0];
      state.showPaymentCash = val;
      state.data.dataPreparePayment['dataTable']['saldo'] = state.data.balance;
      state.data.dataPreparePayment['dataPrepare']['counter'] = state.data.counter;

      if (!val && flag == 'ok') {
        state.data.selectedPayment = {};
        state.isLoading = false;

        state.data.dataTableMain = [];
        state.data.dataTableMainBill = [];
        state.data.dataTableSplitBill = [];

        getRestInvGetSaldo();
      }
    }

    const onDialogPaymentCard = (val, flag, data) => {
      state.data.selectedPayment = state.data.dataTablePayment[1];
      state.showPaymentCard = val;
      state.data.dataPreparePayment['dataTable']['saldo'] = state.data.balance;
      state.data.dataPreparePayment['dataPrepare']['counter'] = state.data.counter;

      if (!val && flag == 'ok') {
        state.data.selectedPayment = {};

        state.data.dataTableMain = [];
        state.data.dataTableMainBill = [];
        state.data.dataTableSplitBill = [];

        getRestInvGetSaldo();
      }
    }

    const onDialogPaymentCityLedger = (val, flag, data) => {
      state.data.selectedPayment = state.data.dataTablePayment[2];
      state.showPaymentCityLedger = val;
      state.data.dataPreparePayment['dataTable']['saldo'] = state.data.balance;
      state.data.dataPreparePayment['dataPrepare']['counter'] = state.data.counter;

       if (!val && flag == 'ok') {
        state.data.selectedPayment = {}

        state.data.dataTableMain = [];
        state.data.dataTableMainBill = [];
        state.data.dataTableSplitBill = [];

        getRestInvGetSaldo();
      }
    }

    const onDialogPaymentGuestFolio = (val, flag, data) => {
      state.data.selectedPayment = state.data.dataTablePayment[3];
      state.showPaymentGuestFolio = val;
      state.data.dataPreparePayment['dataTable']['saldo'] = state.data.balance;
      state.data.dataPreparePayment['dataPrepare']['counter'] = state.data.counter;

      if (!val && flag == 'ok') {
        state.data.selectedPayment = {};

        state.data.dataTableMain = [];
        state.data.dataTableMainBill = [];
        state.data.dataTableSplitBill = [];

        getRestInvGetSaldo();
      }
    }

    const onDialogPaymentMasterFolio = (val, flag, data) => {
      state.data.selectedPayment = state.data.dataTablePayment[5];
      state.showPaymentMasterFolio = val;
      state.data.dataPreparePayment['dataTable']['saldo'] = state.data.balance;
      state.data.dataPreparePayment['dataPrepare']['counter'] = state.data.counter;

      if (!val && flag == 'ok') {
        state.data.selectedPayment = {};

        state.data.dataTableMain = [];
        state.data.dataTableMainBill = [];
        state.data.dataTableSplitBill = [];

        getRestInvGetSaldo();
      }
    }

     const onDialogPaymentNonGuestFolio = (val, flag, data) => {
       state.data.selectedPayment = state.data.dataTablePayment[4];
      state.showPaymentNonGuestFolio = val;
      state.data.dataPreparePayment['dataTable']['saldo'] = state.data.balance;
      state.data.dataPreparePayment['dataPrepare']['counter'] = state.data.counter;


      if (!val && flag == 'ok') {
        state.data.selectedPayment = {};

        state.data.dataTableMain = [];
        state.data.dataTableMainBill = [];
        state.data.dataTableSplitBill = [];

        getRestInvGetSaldo();
      }
    }

    const onDialogDepartment = (val, data) => {
      state.showDepartment = val;

      if (!val && data != null) {
        state.data.dataPreparePayment['dataHotelSelected'] = data;
        onDialogPaymentNonGuestFolio(true, '', {});
      }
    }

    const tableHeadersMainBill = [
      {
            label: "Qty", 
            field: "anzahl",
            name: "anzahl",
            align: "center",
      }, {
            label: "Name", 
            field: "bezeich",
            name: "bezeich",
            align: "center",
      }
    ];

    const tableHeadersSplitBill = [
      {
            label: "Qty", 
            field: "anzahl",
            name: "anzahl",
            align: "center",
      }, {
            label: "Name", 
            field: "bezeich",
            name: "bezeich",
            align: "center",
      }
    ];


    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersMainBill,
      tableHeadersSplitBill,
      onRowClickSplitBill,
      onRowClickMainBill,
      onOkDialog,
      onClickMoveRight,
      onClickMoveLeft,
      onCancelDialog,
      onClickChangeCounter,
      getCalBalance,
      onDialogPaymentCash,
      onDialogPaymentCard,
      onDialogPaymentCityLedger,
      onDialogPaymentGuestFolio,
      onDialogPaymentMasterFolio,
      onDialogPaymentNonGuestFolio,
      onDialogDepartment,
      zuggriff,
      onClickDialogKpr,
      pagination: { rowsPerPage: 0 },
    };
  },
  components: {
    dialogPaymentCash: () => import('./payment/DialogPaymentCash.vue'),
    dialogPaymentCard: () => import('./payment/DialogPaymentCard.vue'),
    dialogPaymentCityLedger: () => import('./payment/DialogPaymentCityLedger.vue'),
    dialogPaymentGuestFolio: () => import('./payment/DialogPaymentGuestFolio.vue'),
    dialogPaymentMasterFolio:() => import('./payment/DialogPaymentMasterFolio.vue'),
    dialogSelectDepartment: () => import('./DialogChangeOutlet.vue'),
    dialogPaymentNonGuestFolio: () => import('./payment/DialogPaymentNonGuestFolio.vue'),

    // dialogPaymentCityLedger: () => import('./DialogPaymentCityLedger.vue'),
    // dialogPaymentCompliment:() => import('./DialogPaymentCompliment.vue'),
    // dialogPaymentMasterFolio:() => import('./DialogPaymentMasterFolio.vue'),
    // dialogPaymentMealCoupon:() => import('./DialogPaymentMealCoupon.vue'),

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

