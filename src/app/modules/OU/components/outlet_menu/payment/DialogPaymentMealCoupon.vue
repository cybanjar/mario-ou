<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:500px;">
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

        </q-card-section>

        <q-card-section>
          <div class="q-pa-sm">
            <STable
              flat
              grid
              dense
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
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn unelevated outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog"/>
        </q-card-actions>

        <q-dialog v-model="data.showConfirmationDialog" persistent>
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
                <p class="q-ml-md">Confirm the selection {{data.dataArtSelected['num']}} - {{data.dataArtSelected['bezeich']}}?</p>
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
import { store } from '~/store';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: any;
    buttonOkEnable: boolean;
    balance: any;
    showConfirmationDialog: any;
    dataArtSelected: {};
  }
  title: string;
}

export default defineComponent({
  props: {
    showPaymentMealCoupon: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    selectedPrint: { type: Object, required: true }, 
    dataTable: {type: Object, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        buttonOkEnable: false,
        balance: 0,
        showConfirmationDialog: false,
        dataArtSelected: {},
      },
      title: '',
    });

    watch(
      () => props.showPaymentMealCoupon, (showPaymentMealCoupon) => {
        if (props.showPaymentMealCoupon) {
          state.data.buttonOkEnable = false;
          state.title = 'Meal Coupon Payment';
          state.data.balance = props.dataTable['dataTable']['saldo'];

          getPrepare();

          console.log("Mount Meal Coupon : ", props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentMealCoupon,
        set: (val) => {
            emit('onDialogPaymentMealCoupon', val, null);
        },
    });

    const tableHeaders = [
      {
            label: "name", 
            field: "bezeich",
            name: "bezeich",
            align: "center",
        }, {
            label: "num", 
            field: "num",
            name: "num",
            align: "center",
        },
    ];

    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('mealcouponBuildCompl ', {
            dept : props.dataTable['dataTable']['departement'],
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

    const getInvBtnTransferPaytype56 = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvBtnTransferPaytype56', {
            recId: props.dataTable['dataTable']['dataThBill'][0]['rec-id'],
            guestnr: state.data.dataArtSelected['num'],
            currDept: props.dataTable['dataPrepare']['currDept'],
            balanceForeign: state.data.balance,
            balance: state.data.balance,
            payType: 6,
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            doubleCurrency: props.dataTable['dataPrepare']['doubleCurrency'],
            exchgRate: props.dataTable['dataPrepare']['exchgRate'],
            priceDecimal: props.dataTable['dataPrepare']['priceDecimal'],
            userInit: dataStoreLogin['userInit'],
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

          response['dataSelected'] = state.data.dataArtSelected; 
          emit('onDialogPaymentMealCoupon', false, 'ok', response);
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

    // -- OnClick Listener
     const onRowClickTable = (dataRow) => {
      console.log(dataRow);
      state.data.dataArtSelected = dataRow;
      
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
    }

    const onOkDialog = () => {
      state.data.showConfirmationDialog = true;
    }

    const onCancelDialog = () => {
      emit('onDialogPaymentMealCoupon', false, '', {});
    }

    const onClickConfirmation = () => {
      getInvBtnTransferPaytype56();
    }

    return {
      ...toRefs(state),
      dialogModel,
      tableHeaders,
      onRowClickTable,
      onOkDialog,
      onCancelDialog,
      getPrepare,
      onClickConfirmation,
      getInvBtnTransferPaytype56,
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
</style>

