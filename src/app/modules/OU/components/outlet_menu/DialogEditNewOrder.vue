<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
      </q-toolbar>

      <div>
        <q-card-section>
          <SInput label-text="Qty" v-model="qty" name="mdi-magnify" data-layout="numeric" type="number" ref="qtyBox" @focus="showKeyboard"/>
          <SInput outlined readonly label-text="Remark" v-model="remark" data-layout="compact" ref="remarkBox" @focus="showKeyboard" @click="onClickRemark()"/>
          
          <vue-touch-keyboard 
            id="keyboard"
            :options="options" 
            v-if="numpadVisible" 
            :layout="layout" 
            :cancel="hideKeyboard" 
            :accept="acceptKeyboard" 
            :next="acceptKeyboard"
            :input="input"
            :close="hideKeyboard" />

        </q-card-section>

      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel this order" @click="onCancelOrder()" />
        <q-btn color="primary" label="Cancel" @click="onCancel()" />
        <q-btn color="primary" label="Ok" @click="onConfirm()"/>
      </q-card-actions>
    </q-card>

    <dialogRemark
      @onDialogRemarkSelection="onDialogRemarkSelection"
      :dialogRemarkSelection="dialogRemarkSelection"
      :dialogRemarkSelectedData="dialogRemarkSelectedData"/>
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs, ref, onMounted} from '@vue/composition-api';
import { date, Notify } from 'quasar';
import VueTouchKeyboard from "vue-touch-keyboard";
import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css';
import Vue from 'vue';

// import numkeyboard from 'vue-numkeyboard';
// import 'vue-numkeyboard/style.css';

Vue.use(VueTouchKeyboard);
Vue.use(style);
Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);

// Vue.use(numkeyboard);

interface State {
  isLoading: boolean;
  title: string;
  qty: any;
  remark: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataNewOrderSelected: {},
  numpadVisible: boolean,
  layout: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  options: {},
  input: null,
  dialogRemarkSelection: boolean,
  dialogRemarkSelectedData : any
}

export default defineComponent({
  props: {
    dialogEditNewOrder: { type: Boolean, required: true },
    dataSelected: {type: null, required: true},
  },
  setup(props, { emit, root: { $api, $root } }) {
    const state = reactive<State>({
      isLoading: false,
      dataNewOrderSelected: {},
      title: '',
      qty: 1,
      remark: '',
      numpadVisible: false,
      layout: 'numeric',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      dialogRemarkSelection: false,
      dialogRemarkSelectedData : [],
      input: null,
    });

    watch(
      () => props.dialogEditNewOrder, (dialogEditNewOrder) => {
        if (props.dialogEditNewOrder) {
          state.dataNewOrderSelected = props.dataSelected;
          state.title = state.dataNewOrderSelected['bezeich'];
          state.qty = state.dataNewOrderSelected['qty']; 
          state.remark = state.dataNewOrderSelected['remark'];
          state.dialogRemarkSelectedData = state.dataNewOrderSelected['dataremark'];

          for (let i = 0; i<state.dialogRemarkSelectedData.length; i++) {            
            if (state.dialogRemarkSelectedData['id'] == 0) {
              state.dialogRemarkSelectedData[i]['bezeich'] = state.dataNewOrderSelected['customRemark'];
              break
            } 
          }
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogEditNewOrder,
        set: (val) => {
            emit('onDialogEditNewOrder', val, null);
        },
    });

    const onCancelOrder = () => {
      state.input = null;
      state.numpadVisible = false;
      emit('onRemoveNewOrder', false, state.dataNewOrderSelected);
    }

    const onCancel = () => {
      state.input = null;
      state.numpadVisible = false;
      emit('onDialogCancelEditNewOrder');
    }

    const onConfirm = () => {
      console.log(state.dataNewOrderSelected, "CONFIRM");
      
      state.dataNewOrderSelected['qty'] = state.qty;
      state.dataNewOrderSelected['remark'] = state.remark;
      state.dataNewOrderSelected['dataremark'] = state.dialogRemarkSelectedData;

      for (let i = 0; i<state.dialogRemarkSelectedData.length; i++) {
        if (state.dialogRemarkSelectedData[i]["id"] == 0) {
          state.dataNewOrderSelected['customRemark'] = state.dialogRemarkSelectedData[i]["bezeich"]; 
          break;
        }

      }

      state.numpadVisible = false;
      emit('onDialogEditNewOrder', false, state.dataNewOrderSelected);
    }
    
    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 

      if (!state.numpadVisible) {
        state.numpadVisible = true;
      }      
    }

    const hideKeyboard = () => {
      state.numpadVisible = false;
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    const onClickRemark = () => {
      onDialogRemarkSelection(true, null);
    }

    const onDialogRemarkSelection = (val, data) => {
      state.dialogRemarkSelection = val;


      if (!val && data != null) {
        state.dialogRemarkSelectedData = data;

        state.remark = "";

        let strRemark = "";
        for (let i = 0; i<state.dialogRemarkSelectedData.length; i++) {
          strRemark = state.dialogRemarkSelectedData[i]['bezeich'];
          
          if (i == (state.dialogRemarkSelectedData.length - 1)) {
            state.remark = state.remark.concat(strRemark);
          } else {
            state.remark = state.remark.concat(strRemark + ", ");
          }
        }
      }
    }

    return {
      dialogModel,
      onCancelOrder,
      onCancel,
      onConfirm,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      onClickRemark,
      onDialogRemarkSelection,
      ...toRefs(state),
    };
  },
  components: {
    dialogRemark:() => import('./DialogRemarkSelection.vue'),
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

#keyboard {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1000;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;

	padding: 1em;

	background-color: #EEE;
	box-shadow: 0px -3px 10px rgba(black, 0.3);

	border-radius: 10px;
}
</style>
