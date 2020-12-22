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
                <SInput outlined @click="dialogUserPos = true" label-text="Login" />
            </div>

            <div class="col">
                <SInput outlined @click="dialogCode = true" label-text="Code"/>
            </div>
          </div>
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialogSelectUser" />
        </q-card-actions>

        <!--  Dialog User POS -->
        <q-dialog v-model="dialogUserPos" persistent>
            <q-card style="max-width: 1500px;width:450px;">
                <q-toolbar>
                    <q-toolbar-title class="text-white text-weight-medium">POS Users</q-toolbar-title>
                </q-toolbar>

                <q-card-section class="row items-center">
                    <q-list bordered separator>
                        <q-item clickable v-ripple>
                            <q-item-section>Ahmad Yani</q-item-section>
                        </q-item>

                        <q-item clickable v-ripple>
                            <q-item-section>
                            <q-item-label>Abdul Jamil</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

                <q-card-actions align="right">
                <q-btn outline label="Cancel" color="primary" v-close-popup />
                <q-btn unelevated label="Ok" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!--  Dialog Code -->
        <q-dialog v-model="dialogCode" persistent>
            <q-card style="max-width: 1500px;width:450px;">
                <q-toolbar>
                    <q-toolbar-title class="text-white text-weight-medium">Enter Your ID</q-toolbar-title>
                </q-toolbar>

                <q-card-section>
                    <div class="q-ma-sm row q-gutter-xs">
                        <div class="col q-mr-md">
                            <SInput outlined label-text="Enter Your ID" />
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

                <q-card-actions align="right">
                <q-btn outline label="Cancel" color="primary" v-close-popup />
                <q-btn unelevated label="Ok" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

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
  dialogUserPos: boolean,
  dialogCode: boolean,
}

export default defineComponent({
  props: {
    showDialogChangeUser: { type: Boolean, required: true },
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
      dialogUserPos: null,
      dialogCode: null,
      
    });

    watch(
      () => props.showDialogChangeUser, (showDialogChangeUser) => {
        if (props.showDialogChangeUser) {
          state.title = 'Change User';

        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogChangeUser,
        set: (val) => {
            emit('onDialogChangeUser', val);
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
      emit('onDialogChangeUser', false);
    }

    const onClickUserPos = () => {
        alert('Sukses');
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersPrint,
      onOkDialogSelectUser,
      showKeyboard,
      onCancelDialog,
      pagination: { rowsPerPage: 0 },
      onClickUserPos
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

