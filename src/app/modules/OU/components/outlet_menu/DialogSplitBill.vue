<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1100px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div
            class="row items-center q-gutter-sm q-mx-sm"
          >
            <q-card flat bordered>
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
            <q-card flat bordered>
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
            <q-card flat bordered>
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
            <q-card flat bordered>
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
            <q-card flat bordered>
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
            <q-card flat bordered>
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

        <q-card-section>
            <div class="q-ma-sm row q-gutter-xs">
                <div class="col">
                    <STable
                        flat
                        bordered
                        hide-bottom
                        :loading="isLoading"
                        :columns="tableHeadersMainBill"
                        :data="data.dataTableMainBill"
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
                        flat
                        bordered
                        hide-bottom
                        :loading="isLoading"
                        :columns="tableHeadersSplitBill"
                        :data="data.dataTableSplitBill"
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
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialogSelectUser"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <dialogPaymentCash
      :showPaymentCash="showPaymentCash"
      :selectedPayment="data.selectedPayment"
      :dataPreparePayment="data.dataPreparePayment"
      @onDialogPaymentCash="onDialogPaymentCash" />
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    dataTableSplitBill: any;
    dataTableMainBill: any;
    dataTableMain: any;
    buttonOkEnable: boolean;
    counter: any,
    balance: any,
    selectedPayment: {
      id:any,
      name: string,
      selected: boolean
    }
  }
  title: string;
  showPaymentCash: boolean;
}

export default defineComponent({
  props: {
    showDialogSplitBill: { type: Boolean, required: true },
    dataTable: { type: Object, required: true },
    dataPrepare: { type: Object, required: true },
    dataSelectedSplitBill: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataTableSplitBill : [],
        dataTableMainBill : [],
        dataTableMain : [],
        buttonOkEnable: false,
        counter: 1,
        balance: 0,
        selectedPayment: {
          id:0,
          name: '',
          selected: false
        }
      },
      title: '',
      showPaymentCash: false,
    });

    watch(
      () => props.showDialogSplitBill, (showDialogSplitBill) => {
        if (props.showDialogSplitBill) {
          state.data.buttonOkEnable = false;
          state.title = 'Split Bill';

          console.log('On Mount Split Bill');
          console.log('dataTable' , props.dataTable);
          console.log('dataPrepare' , props.dataPrepare);

          state.data.dataTableMainBill = state.data.dataTableMain.slice()
          getPrepare();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogSplitBill,
        set: (val) => {
            emit('onDialogSplitBill', val, null);
        },
    });

    // -- HTTP Request method
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

    const getSplitBuildRMenu = () => {
      state.isLoading = true;

      console.log('request : ',{
        dept: props.dataPrepare['currDept'],
        // recId: props.dataTable['dataThBill'][0]['rec-id'],
        recId: 3624448,
        currSelect: state.data.counter
      })

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('splitbillBuildRmenu', {
            dept: props.dataPrepare['currDept'],
            // recId: props.dataTable['dataThBill'][0]['rec-id'],
            recId: 3624448,
            currSelect: state.data.counter
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response splitbillBuildRmenu: ', response);

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
      getSplitBuildRMenu();

      if (flag) {
        /*
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
        */
      } else {
         Notify.create({
          message: 'PAID: Split Bill No ' + state.data.counter + "\Select other one",
          color: 'red',
        });
      }
    }

    const onClickMoveLeft = (dataRow) => {
      if (dataRow['paid-flag'] == 0) {
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

    const onOkDialogSelectUser = () => {
    }

    const onCancelDialog = () => {
      state.data.counter = 1;
      state.data.dataTableMain = [];
      state.data.dataTableMainBill = [];
      state.data.dataTableSplitBill = [];
      emit('onDialogSplitBill', false);
    }

    // -- On Dialog Listener
    const onDialogPaymentCash = (val) => {
      state.showPaymentCash = val;
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersMainBill,
      tableHeadersSplitBill,
      onRowClickSplitBill,
      onRowClickMainBill,
      onOkDialogSelectUser,
      onClickMoveRight,
      onClickMoveLeft,
      onCancelDialog,
      onClickChangeCounter,
      getCalBalance,
      onDialogPaymentCash,
      pagination: { rowsPerPage: 0 },
    };
  },
  components: {
    dialogPaymentCash: () => import('./payment/DialogPaymentCash.vue'),
    // dialogPaymentCard: () => import('./DialogPaymentCard.vue'),
    // dialogPaymentCityLedger: () => import('./DialogPaymentCityLedger.vue'),
    // dialogPaymentGuestFolio: () => import('./DialogPaymentGuestFolio.vue'),
    // dialogPaymentNonGuestFolio: () => import('./DialogPaymentNonGuestFolio.vue'),
    // dialogPaymentCompliment:() => import('./DialogPaymentCompliment.vue'),
    // dialogPaymentMasterFolio:() => import('./DialogPaymentMasterFolio.vue'),
    // dialogPaymentMealCoupon:() => import('./DialogPaymentMealCoupon.vue'),
    // dialogSelectDepartment: () => import('./../DialogChangeOutlet.vue')
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

