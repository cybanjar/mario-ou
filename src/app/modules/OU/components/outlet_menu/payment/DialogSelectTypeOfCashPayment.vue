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
                <SInput outlined v-model="data.payment" label-text="Payment" data-layout="numeric" ref="paymentBox"/>
              </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div>
            <div class="full-width bg-grey-3">
              <p class="q-pa-md"><strong> Money </strong></p>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialogSelectUser"/>
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
    showSelectTypeCash: { type: Boolean, required: true },
    // selectedPayment: { type: Object, required: true },
    // selectedPrint: { type: Object, required: true }, 
    // dataPreparePayment: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        buttonOkEnable: false,
        paymentType: "0",
        voucherNr: "",
        payment: 0,
        balance: 0,
        change: 0
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
      () => props.showSelectTypeCash, (showSelectTypeCash) => {
        if (props.showSelectTypeCash) {
          state.data.buttonOkEnable = false;
          state.title = 'Payment Cash';
        //   state.data.balance = props.dataPreparePayment['dataTable']['saldo'];
        //   state.data.payment = -props.dataPreparePayment['dataTable']['saldo'];
        //   state.data.change = 0;

        //   console.log("dialog cash mounted, data prepare : ", props.dataPreparePayment);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showSelectTypeCash,
        set: (val) => {
            emit('onDialogMenuOrderTaker', val, null);
        },
    });

    // -- 
    const onOkDialogSelectUser = () => {
      // if (props.dataSelectedOrderTaker != null) {
      //   // emit('onDialogMenuOrderTaker', false, props.dataSelectedOrderTaker);
      // } 
    }

    const onCancelDialog = () => {
      emit('onDialogPaymentCash', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
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

