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
          <q-btn unelevated color="primary" label="OK" @click="onOkDialog" />
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
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
}

export default defineComponent({
  props: {
    showDialogCloseBill: { type: Boolean, required: true },
    dataTable: { type: null, required: true },
    dataPrepare: { type: null, required: true },
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
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: 'numeric',
      input: null,
      numpadVisible: false,
    });

    watch(
      () => props.showDialogCloseBill, (showDialogCloseBill) => {
        if (props.showDialogCloseBill) {
          state.data.buttonOkEnable = false;
          state.title = 'Select Close Bill';

          console.log("On Mount : ", props.dataTable);
          console.log("On Mount : ", props.dataPrepare);
          getPrepare();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogCloseBill,
        set: (val) => {
            emit('onDialogCashierTransfer', val, null);
        },
    });

    // -- HTTP Request Method
    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('oldhbillPrepare ', {
            rechnr : props.dataTable['rechnr'],
            dept : props.dataPrepare['currDept'],
            incomeAudit : false,
            knr: props.dataPrepare['tKellner']['t-kellner'][0]['kellner-nr'],
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('oldhbillPrepare : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
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

    const getOldhbillBtnExit = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('oldhbillBtnExit ', {
            rechnr : props.dataTable['rechnr'],
            dept : props.dataPrepare['currDept'],
            incomeAudit : false,
            knr: props.dataPrepare['tKellner']['t-kellner'][0]['kellner-nr'],
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('oldhbillBtnExit : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
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

    // -- On Click Listener
    const onOkDialog = () => {
    }

    const onCancelDialog = () => {
      emit('onDialogCloseBill', false);
    }

    const showKeyboardBill = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
      } 
    }

    return {
      ...toRefs(state),
      dialogModel,
      onOkDialog,
      onCancelDialog,
      showKeyboardBill,
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

