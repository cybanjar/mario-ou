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
                <SInput outlined v-model="data.payment" label-text="Payment" :disable="true" readonly/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
                <SInput outlined v-model="data.cardSelected" label-text="Debit" :disable="true" readonly/>
              </div>

              <div class="col">
                <SInput outlined v-model="data.cardNumber" label-text="Card Number" :disable="true" readonly/>
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
          <q-btn color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialogSelectUser" :disable="!data.buttonOkEnable"/>
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
    dataTablePayment: any;
    buttonOkEnable: boolean;
    cardSelected: string
    cardNumber: string,
    balance: any,
    payment: any,
  }
  title: string;
}

export default defineComponent({
  props: {
    showPaymentCard: { type: Boolean, required: true },
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
            'name': "VISA",
            'id': '1',
            'selected': false,
            'value': "VISA",
          },
          {
            'name': "MASTER",
            'id': '2',
            'selected': false,
            'value': "MASTER",
          },
          {
            'name': "DINNER CLUB",
            'id': '3',
            'selected': false,
            'value': "DINNER CLUB",

          },
          {
            'name': "JBC",
            'id': '4',
            'selected': false,
            'value': "JBC",
          },
          {
            'name': "BCA",
            'id': '5',
            'selected': false,
            'value': "BCA",
          },
          {
            'name': "AMERICA EXPRESS",
            'id': '6',
            'selected': false,
            'value': "AMERICA EXPRESS",
          },
          {
            'name': "DEBIT",
            'id': '7',
            'selected': false,
            'value': "DEBIT",
          },
          {
            'name': "OVO",
            'id': '8',
            'selected': false,
            'value': "OVO",
          }
        ],
        buttonOkEnable: false,
        cardSelected: "",
        cardNumber: "",
        balance: 0,
        payment: 0,
      },
      title: '',
    });

    watch(
      () => props.showPaymentCard, (showPaymentCard) => {
        if (props.showPaymentCard) {
          state.data.buttonOkEnable = false;
          state.title = 'Payment Card';

          state.data.balance = props.dataPreparePayment['dataTable']['saldo'];
          state.data.payment = -props.dataPreparePayment['dataTable']['saldo'];


          console.log("selectedPayment", props.selectedPayment);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentCard,
        set: (val) => {
            emit('onDialogPaymentCard', val, null);
        },
    });

    const onRowClickTablePayment = (dataRow) => {
      console.log('click');
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        datarow['selected'] = false;
      }        

      const id = dataRow['id'];
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        
        if (id === datarow['id']) {
          datarow['selected'] = true;
          state.data.cardSelected = datarow['value'];
          break;
        }
      }

      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const selected = state.data.dataTablePayment[i]['selected'];

        if (selected === true) {
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
    const onOkDialogSelectUser = () => {
      // if (props.dataSelectedOrderTaker != null) {
      //   // emit('onDialogMenuOrderTaker', false, props.dataSelectedOrderTaker);
      // } 
    }

    const onCancelDialog = () => {
      // for(let i = 0; i<state.data.dataTablePrint.length; i++) {
      //   const datarow = state.data.dataTablePrint[i];
      //   datarow['selected'] = false;
      // }

      // for (let i = 0; i<state.data.dataTablePayment.length; i++) {
      //   const datarow = state.data.dataTablePayment[i];
      //   datarow['selected'] = false;
      // }  

      // state.data.buttonOkEnable = false;
      emit('onDialogPaymentCard', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersPrint,
      onRowClickTablePayment,
      onOkDialogSelectUser,
      onCancelDialog,
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

