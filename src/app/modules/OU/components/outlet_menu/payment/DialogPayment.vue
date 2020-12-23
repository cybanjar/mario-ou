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
                <SInput outlined  label-text="Balance" :disable="true" readonly/>
              </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
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
        </q-card-section>

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
          <q-btn color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog" :disable="!data.buttonOkEnable"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <dialogPaymentCash
      :showPaymentCash="data.showPaymentCash"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentCash="onDialogPaymentCash" />

    <dialogPaymentCard 
      :showPaymentCard="data.showPaymentCard"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentCard="onDialogPaymentCard" />

    <dialogPaymentCityLedger
      :showPaymentCityLedger="data.showPaymentCityLedger"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentCityLedger="onDialogPaymentCityLedger" />

    <dialogPaymentGuestFolio
      :showPaymentGuestFolio="data.showPaymentGuestFolio"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentGuestFolio="onDialogPaymentGuestFolio" />

    <dialogPaymentNonGuestFolio
      :showPaymentNonGuestFolio="data.showPaymentNonGuestFolio"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentNonGuestFolio="onDialogPaymentNonGuestFolio" />

    <dialogPaymentCompliment
      :showPaymentCompliment="data.showPaymentCompliment"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentCompliment="onDialogPaymentCompliment" />

    <dialogPaymentMasterFolio
      :showPaymentMasterFolio="data.showPaymentMasterFolio"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentMasterFolio="onDialogPaymentMasterFolio" />

    <dialogPaymentMealCoupon
      :showPaymentMealCoupon="data.showPaymentMealCoupon"
      :selectedPayment="data.selectedPayment"
      :selectedPrint="data.selectedPrint"
      @onDialogPaymentMealCoupon="onDialogPaymentMealCoupon" />

  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';
import DialogPaymentCityLedgerVue from './DialogPaymentCityLedger.vue';

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
    selectedPrint: null;
    selectedPayment: null;
  }
  title: string;
}

export default defineComponent({
  props: {
    dialogPayment: { type: Boolean, required: true },
    // dataSelectedOrderTaker: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
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
        selectedPrint: null,
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
        selectedPayment: null,
        buttonOkEnable: false,
        showPaymentCash: false,
        showPaymentCard: false,
        showPaymentCityLedger: false,
        showPaymentGuestFolio: false,
        showPaymentNonGuestFolio: false,
        showPaymentCompliment: false,
        showPaymentMasterFolio: false,
        showPaymentMealCoupon: false,
      },
      title: '',
    });

  {
    // const initDataUser = () => {
    //   state.isLoading = true;
      
    //   async function asyncCall() {
    //     const [dataOrderTaker] = await Promise.all([
    //       $api.outlet.getOUPrepare('getOrderTaker', { }),
    //     ]);

    //     if (dataOrderTaker) {
    //       const responseDataOrderTaker = dataOrderTaker || [];
    //       const okFlag = responseDataOrderTaker['outputOkFlag'];

    //       if (!okFlag) {
    //         Notify.create({
    //           message: 'Failed when retrive data, please try again',
    //           color: 'red',
    //         });
    //         state.isLoading = false;
    //         return false;
    //       } 
    //       state.data.dataDetail = [];
    //       state.data.dataDetail = responseDataOrderTaker['queasyList']['queasy-list'];
    //       state.isLoading = false;
    //     }
    //   }
    //   asyncCall();
    // }
  }
    watch(
      () => props.dialogPayment, (dialogPayment) => {
        if (props.dialogPayment) {
          state.data.buttonOkEnable = false;
          state.title = 'Payment';
          // initDataUser();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogPayment,
        set: (val) => {
            emit('onDialogMenuOrderTaker', val, null);
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

    // -- 
    const onOkDialog = () => {
      const idPayment = state.data.selectedPayment['id'];
      
      if (idPayment == 1) {
        onDialogPaymentCash(true);
      } else if (idPayment == 2) {
        onDialogPaymentCard(true);
      } else if (idPayment == 3) {
        onDialogPaymentCityLedger(true);
      } else if (idPayment == 4) {
        onDialogPaymentGuestFolio(true);
      } else if (idPayment == 5) {
        onDialogPaymentNonGuestFolio(true);
      } else if (idPayment == 6) {
        onDialogPaymentMasterFolio(true);
      } else if (idPayment == 7) {
        onDialogPaymentCompliment(true);
      } else if (idPayment == 8) {
        onDialogPaymentMealCoupon(true);
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

      state.data.selectedPrint = null;
      state.data.selectedPayment = null;
      state.data.buttonOkEnable = false;
      emit('onDialogPayment', false);
    }

    const onDialogPaymentCash = (val) => {
      state.data.showPaymentCash = val;
    }

    const onDialogPaymentCard = (val) => {
      state.data.showPaymentCard = val;
    }

    const onDialogPaymentCityLedger = (val) => {
      state.data.showPaymentCityLedger = val;
    }

    const onDialogPaymentGuestFolio = (val) => {
      state.data.showPaymentGuestFolio = val;
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

