<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:600px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <div class="row">
            <div class="col q-ma-md">
                <SInput type="number" autofocus v-model="bill" label-text="Bill Number" data-layout="numeric" @focus="showKeyboardBill" />
            </div>
            <div class="col q-ma-md">
                <SInput disable label-text="Table Number" />
            </div>
        </div>
        <div class="row items-start">
            <q-card flat class="numpad">
                <q-card-section>
                    <vue-touch-keyboard
                    id="keyboard"
                    :options="options" 
                    layout="numeric"
                    :input="input" />
                </q-card-section>
            </q-card>
        </div>        

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialogSelectUser" :disable="!data.buttonOkEnable"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import VueTouchKeyboard from 'vue-touch-keyboard';
// import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css';

Vue.use(VueTouchKeyboard);
// Vue.use(style);
Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);
import Vue from 'vue';

import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    buttonOkEnable: boolean;
  }
  title: string;
  bill: any,
  input: null,
}

export default defineComponent({
  props: {
    showDialogCloseBill: { type: Boolean, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],        
        buttonOkEnable: false,
      },
      title: '',
    bill: 1,
    input: null,
    });

    watch(
      () => props.showDialogCloseBill, (showDialogCloseBill) => {
        if (props.showDialogCloseBill) {
          state.data.buttonOkEnable = false;
          state.title = 'Select Close Bill';

        //   console.log("Selected Data : ", props.dataSelectedCloseBill);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogCloseBill,
        set: (val) => {
            emit('onDialogCashierTransfer', val, null);
        },
    });


    const tableHeadersPrint = [
      {
            label: "Name", 
            field: "name",
            name: "name",
            align: "center",
        }, 
        // {
        //     label: "id", 
        //     field: "id",
        //     name: "id",
        //     align: "center",
        // },
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
      emit('onDialogCloseBill', false);
    }

    const showKeyboardBill = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
      } 
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersPrint,
      onOkDialogSelectUser,
      onCancelDialog,
      pagination: { rowsPerPage: 0 },
      showKeyboardBill,
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

