<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1000px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <div class="row">
            <div class="col-6">
                <q-card-section>
                    <div class="row">
                        <div class="col-12">
                            <SInput autofocus type="number" v-model="qty" data-layout="numeric" @focus="showKeyboardBill" outlined class="q-mx-xs q-mt-sm" label-text="Cancelled Quantity"/>
                            <vue-touch-keyboard
                                id="keyboard"
                                :options="options" 
                                layout="numeric"
                                :input="input" />
                        </div>                        
                    </div>
                </q-card-section>
            </div>
            <div class="col-6">
                <q-card-section>
                    <div class="q-ma-sm row q-gutter-xs">
                        <STable
                            class=""
                            grid
                            hide-header
                            hide-bottom
                            :loading="isLoading"
                            :columns="tableHeadersPrint"
                            :data="data.dataTablePrint"
                            row-key="name"
                            separator="cell"
                            :rows-per-page-options="[0]"
                            :pagination.sync="pagination">
                            <template v-slot:loading>
                                <q-inner-loading showing color="primary" />
                            </template>

                            <template v-slot:item="props">
                                <q-card class="q-ma-sm col-md-3" flat bordered :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                                    <q-card-section @click="onRowClickTablePrint(props.row)" >
                                        <strong>{{ props.row.name }}</strong>
                                    </q-card-section>
                                </q-card>
                            </template>
                        </STable>
                    </div>                    
                </q-card-section>
            </div>
        </div>        

        <q-separator />

        <q-card-actions align="right">
          <q-btn unelevated outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialogSelectUser"/>
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
    dataTablePrint: any;
    buttonOkEnable: boolean;
  }
  title: string;
  qty: any,
  input: null,
}

export default defineComponent({
  props: {
    showDialogVoidItem: { type: Boolean, required: true },
    dataSelectedVoidItem: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataTablePrint : [
          {
            'name': "Print Bill",
            'id': '1',
            'selected': false,
          },
          {
            'name': "Reprint Bill",
            'id': '2',
            'selected': false,
          },
          {
            'name': "Reprint Bill",
            'id': '3',
            'selected': false,
          },
          {
            'name': "Reprint Bill",
            'id': '4',
            'selected': false,
          },
          {
            'name': "Reprint Bill",
            'id': '5',
            'selected': false,
          },
        ],
        buttonOkEnable: false,
      },
      title: '',
      qty: 1,
      input: null,
    });

    watch(
      () => props.showDialogVoidItem, (showDialogVoidItem) => {
        if (props.showDialogVoidItem) {
          state.data.buttonOkEnable = false;
          state.title = 'Void Item';

          console.log("Selected Data : ", props.dataSelectedVoidItem);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogVoidItem,
        set: (val) => {
            emit('onDialogVoidItem', val, null);
        },
    });

    const onRowClickTablePrint = (dataRow) => {
      for(let i = 0; i<state.data.dataTablePrint.length; i++) {
        const datarow = state.data.dataTablePrint[i];
        datarow['selected'] = false;
      }

      const id = dataRow['id'];
      for (let i = 0; i<state.data.dataTablePrint.length; i++) {
        const datarow = state.data.dataTablePrint[i];
        if (id === datarow['id']) {
          datarow['selected'] = true;
          break;
        }
      }

      let flagButton = false;

      for (let i = 0; i<state.data.dataTablePrint.length; i++) {
        const selected = state.data.dataTablePrint[i]['selected'];

        if (flagButton && selected === true) {
          state.data.buttonOkEnable = true;
          break
        }
      }
    }

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
      emit('onDialogVoidItem', false);
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
      onRowClickTablePrint,
      onOkDialogSelectUser,
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

