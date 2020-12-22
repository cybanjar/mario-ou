<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:450px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col q-mr-md">
                <SInput outlined label-text="Discount (%)" data-layout="numeric" ref="splitBox" @focus="showKeyboard" />
            </div>

            <div class="col">
              <SInput outlined  label-text="Voucher" :disable="true" readonly/>
            </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <q-list bordered padding>

                <q-item tag="label" v-ripple>
                  <q-item-section side top>
                    <q-checkbox v-model="list.check1" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Ayam Bakar Sukabumi</q-item-label>
                    <q-item-label caption>
                      Pedas
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item tag="label" v-ripple>
                  <q-item-section side top>
                    <q-checkbox v-model="list.check2" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Gurame Goreng</q-item-label>
                    <q-item-label caption>
                      More chille
                    </q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
            </div>
          </div>
          
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <vue-touch-keyboard
              id="keyboard"
              :layout="layout"
              :input="input" />
            </div>
          </div>
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialogSelectUser" />
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
  },
  layout: string;
  input: null;
  title: string;
  list: {
    check1: boolean,
    check2: boolean
  };
}

export default defineComponent({
  props: {
    showDialogDiscountBill: { type: Boolean, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
      },
      title: '',
      layout: 'numeric',
      input: null,
      list: {
        "check1": true,
        "check2": false,
      }
      
    });

    watch(
      () => props.showDialogDiscountBill, (showDialogSplitBill) => {
        if (props.showDialogDiscountBill) {
          state.title = 'Get Discount';

        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogDiscountBill,
        set: (val) => {
            emit('onDialogDiscountBill', val);
        },
    });

    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 

      console.log("input", state.input);
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
      emit('onDialogDiscountBill', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersPrint,
      onOkDialogSelectUser,
      showKeyboard,
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

