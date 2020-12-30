<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:450px;" class="justify-center items-center">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm q-gutter-xs">
            <SInput outlined v-model="data.dataInputPassword" label-text="Password" :data-layout="layout" ref="priceBox" @focus="showKeyboard" />
          </div>

          <div class="q-ma-sm q-gutter-xs center">
            <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
            <q-btn color="primary" label="OK" @click="onOkDialog" />
          </div>
          
          <q-separator />

          <div class="q-ma-sm q-gutter-xs">
            <SInput outlined v-model="data.remarkApproval" label-text="" :data-layout="layout" ref="priceBox" @focus="showKeyboard" />
          </div>
          
          <div class="q-ma-sm q-gutter-xs center">
            <q-btn style="align:center;" unelevated color="primary" label="ASK FOR APPROVAL" @click="onClickApproval" />
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

        <!-- <q-card-actions align="right">
         
        </q-card-actions> -->
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
    dataInputPassword: any;
    remarkApproval: string;
  },
  layout: string;
  input: null;
  title: string;
}

export default defineComponent({
  props: {
    showDialogInputPassword: { type: Boolean, required: true },
    pass: { type: String, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataInputPassword: "",
        remarkApproval: ""
      },
      title: '',
      layout: 'compact',
      input: null,
    });

    watch(
      () => props.showDialogInputPassword, (showDialogInputPrice) => {
        if (props.showDialogInputPassword) {
          state.title = 'Input Password';
          state.data.dataInputPassword = "";
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogInputPassword,
        set: (val) => {
            emit('onDialogInputPassword', val, state.data.dataInputPassword);
        },
    });

    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 
    }

    // -- 
    const onOkDialog = () => {
        if (state.data.dataInputPassword == props.pass) {
            emit('onDialogInputPassword', false, state.data.dataInputPassword);
        } else {
          Notify.create({
            type: "warning",
            message: 'Password Incorrect',
          });
          state.data.dataInputPassword = "";
        }
    }

    const onCancelDialog = () => {
        state.data.dataInputPassword = "";
        emit('onDialogInputPassword', false, null);
    }

    const onClickApproval = () => {
        console.log("APPROVAL");
    }

    return {
      dialogModel,
      ...toRefs(state),
      onOkDialog,
      showKeyboard,
      onCancelDialog,
      onClickApproval,
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

