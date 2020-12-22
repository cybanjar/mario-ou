<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:550px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col q-mr-md">
                <SInput outlined label-text="Enter Table Number" />
                <STable
                    flat
                    bordered
                    dense
                    :loading="isLoading"
                    :columns="tableHeadersPrint"
                    :data="data.dataDetail"
                    row-key="name"
                    separator="cell"
                    :rows-per-page-options="[10, 13, 16]"
                    :pagination.sync="pagination">
                    <template v-slot:loading>
                    <q-inner-loading showing color="primary" />
                    </template>

                    <template v-slot:body="props">
                    <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-black':'bg-white text-black'">
                        <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        @click="onRowClick(props.row)">
                            {{ col.value }}
                        </q-td>
                    </q-tr>
                    </template>
                </STable>
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
  
}

export default defineComponent({
  props: {
    showDialogTransferTable: { type: Boolean, required: true },
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
      
    });

    watch(
      () => props.showDialogTransferTable, (showDialogTransferTable) => {
        if (props.showDialogTransferTable) {
          state.title = 'Table Transfer';

        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogTransferTable,
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
            label: "Table Number", 
            field: "name",
            name: "name",
            align: "center",
        }, 
        {
            label: "Seat", 
            field: "id",
            name: "id",
            align: "center",
        },
        {
            label: "OCC", 
            field: "id",
            name: "id",
            align: "center",
        },
        {
            label: "Pax", 
            field: "id",
            name: "id",
            align: "center",
        },
        {
            label: "Served by", 
            field: "id",
            name: "id",
            align: "center",
        },
        {
            label: "Balance", 
            field: "id",
            name: "id",
            align: "center",
        },
        {
            label: "Desc", 
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
      emit('onDialogTransferTable', false);
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

