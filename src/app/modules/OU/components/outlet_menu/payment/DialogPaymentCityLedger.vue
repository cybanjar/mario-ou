<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:900px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
                <q-radio v-model="data.paymentType" label="Individual" val="0"/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.balance" label-text="Balance" :disable="true" readonly/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
                <q-radio v-model="data.paymentType" label="Company" val="1"/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.payment" label-text="Payment"/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
                <q-radio v-model="data.paymentType" label="Travel Agent" val="2"/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.name" label-text="Name"/>
              </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-sm">
            <!-- <div class="full-width bg-grey">
              <p><strong> Pay </strong></p>
            </div> -->

            <STable
              hide-bottom
              :loading="isLoading"
              :columns="tableHeaders"
              :data="data.dataTable"
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
    dataDetail: [];
    dataTable: any;
    buttonOkEnable: boolean;
    paymentType: string;
    balance : any,
    payment: any,
    name : string,
  }
  title: string;
}

export default defineComponent({
  props: {
    showPaymentCityLedger: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    selectedPrint: { type: Object, required: true }, 
    dataTable: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataTable : [
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
        buttonOkEnable: false,
        paymentType: "0",
        balance : 0,
        payment: 0,
        name : '',
      },
      title: '',
    });

    watch(
      () => props.showPaymentCityLedger, (showPaymentCityLedger) => {
        if (props.showPaymentCityLedger) {
          state.data.buttonOkEnable = false;
          state.title = 'City Ledger Payment';

          state.data.balance = props.dataTable['dataTable']['saldo'];
          state.data.payment = -state.data.balance;

          console.log("On mount Ciyt Ledegr : ", props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentCityLedger,
        set: (val) => {
            emit('onDialogPaymentCityLedger', val, null);
        },
    });

    const tableHeaders = [
      {
            label: "Customer Name", 
            field: "bezeich",
            name: "bezeich",
            align: "center",
        }, {
            label: "C/L No", 
            field: "num",
            name: "num",
            align: "center",
        }, {
            label: "Description", 
            field: "desc",
            name: "desc",
            align: "center",
        }, {
            label: "Address", 
            field: "address",
            name: "address",
            align: "center",
        },
    ];

    const onRowClickTablePayment = (dataRow) => {
      for (let i = 0; i<state.data.dataTable.length; i++) {
        const datarow = state.data.dataTable[i];
        datarow['selected'] = false;
      }        

      const id = dataRow['id'];
      for (let i = 0; i<state.data.dataTable.length; i++) {
        const datarow = state.data.dataTable[i];
        
        if (id === datarow['id']) {
          datarow['selected'] = true;
          datarow['databaru'] = 1;
          break;
        }
      }
    }

    // -- onClick Listener 
    const onOkDialog = () => {

    }

    const onCancelDialog = () => {
      emit('onDialogPaymentCityLedger', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
      onRowClickTablePayment,
      onOkDialog,
      onCancelDialog,
      tableHeaders,
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

