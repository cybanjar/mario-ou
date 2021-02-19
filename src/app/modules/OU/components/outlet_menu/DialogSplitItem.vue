<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="width: 500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
           <SInput outlined label-text="Split into" v-model="data.split" data-layout="numeric" ref="splitBox" @focus="showKeyboard">
          </SInput>
          
          <vue-touch-keyboard
            id="keyboard"
            :layout="layout"
            :input="input" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog" />
          <q-btn color="primary" class="q-mr-sm" label="OK" @click="onOkDialog"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import VueTouchKeyboard from 'vue-touch-keyboard';
// import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css';

Vue.use(VueTouchKeyboard);
Vue.use(style);
Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);

import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';
import Vue from 'vue';

interface State {
  isLoading: boolean;
  layout: string;
  input: null;
  data: {
    split: any;   
  }
  title: string;
}

export default defineComponent({
  props: {
    dialogSplitItem: { type: Boolean, required: true },
    dataSelectedSplitItem: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      layout: 'numeric',
      input: null,
      data: {
        split: 1,
      },
      title: '',
    });

    const initDataUser = () => {
      state.isLoading = true;
      
      async function asyncCall() {
        const [dataOrderTaker] = await Promise.all([
          $api.outlet.getOUPrepare('getOrderTaker', { }),
        ]);

        if (dataOrderTaker) {
          const responseDataOrderTaker = dataOrderTaker || [];
          const okFlag = responseDataOrderTaker['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          // state.data.dataDetail = [];
          // state.data.dataDetail = responseDataOrderTaker['queasyList']['queasy-list'];
          state.isLoading = false;
        }
      }
      asyncCall();
    }

    watch(
      () => props.dialogSplitItem, (dialogSplitItem) => {
        if (props.dialogSplitItem) {
          state.title = 'Split Item ';
          // console.log("data selected split: " + props.dataSelectedSplitItem);
        //   initDataUser();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogSplitItem,
        set: (val) => {
            emit('onDialogSplitItem', val, null);
        },
    });


    // -- 
    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 

      // console.log("input", state.input);

      // if (!state.numpadVisible) {
      //   state.numpadVisible = true;
      // }      
    }

    const closeDialog = () => {
      // props.dialogSplitItem = false;
    }

    const onOkDialog = () => {
      if (props.dialogSplitItem != null) {
        emit('onDialogSplitItem', false, props.dataSelectedSplitItem);
      } 
    }

    const onCancelDialog = () => {
      closeDialog();
      emit('onDialogSplitItem', false, null);
    }

    return {
      dialogModel,
      ...toRefs(state),
      onOkDialog,
      onCancelDialog,
      closeDialog,
      showKeyboard,
      pagination: { rowsPerPage: 10 },
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

