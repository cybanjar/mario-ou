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
                    :columns="tableHeaders"
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
          <q-btn unelevated color="primary" label="OK" @click="onOkDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';
import { dataTable } from '~/app/modules/GC/utils/params.cashAdvance';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: any;
    dataSelected: {};
  },
  layout: string;
  input: null;
  title: string;
  
}

export default defineComponent({
  props: {
    showDialogTransferTable: { type: Boolean, required: true },
    dataTable: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataSelected: {},
      },
      title: '',
      layout: 'numeric',
      input: null,
      
    });

    watch(
      () => props.showDialogTransferTable, (showDialogTransferTable) => {
        if (props.showDialogTransferTable) {
          state.title = 'Table Transfer';
          console.log('Data table : ', props.dataTable);
          getTischnrBuildListSelect();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogTransferTable,
        set: (val) => {
            emit('onDialogDiscountBill', val);
        },
    });

    const getRestInvMoveTable = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('readHArtikel', {
            pax : "",
            currTischnr : "",
            recId : "",
            currDept : "",
            tischnr : "",
            bilrecid : "",
            rechnr : "",
            currWaiter : "",
            newWaiter : "",
          }),
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
          state.isLoading = false;
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

    const getTischnrBuildListSelect = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('tischnrBuildListSelect ', {
            dept : props.dataTable['departement'],
            nr: 1,
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response Prepare transafer table: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataDetail = response['tList']['t-list'];
          state.isLoading = false;
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


    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 

      console.log("input", state.input);
    }

    const tableHeaders = [
      {
            label: "Table Number", 
            field: "tischnr",
            name: "tischnr",
            align: "center",
        }, 
        {
            label: "Seat", 
            field: "normalbeleg",
            name: "normalbeleg",
            align: "center",
        },
        {
            label: "OCC", 
            field: "occupied",
            name: "occupied",
            align: "center",
        },
        {
            label: "Pax", 
            field: "belegung",
            name: "belegung",
            align: "center",
        },
        {
            label: "Served by", 
            field: "name",
            name: "name",
            align: "center",
        },
        {
            label: "Balance", 
            field: "balance",
            name: "balance",
            align: "center",
        },
        {
            label: "Desc", 
            field: "bezeich",
            name: "bezeich",
            align: "center",
        },
    ];

    // -- 
    const onRowClick = (dataRow) => {
      console.log(dataRow);

      for (let i = 0; i<state.data.dataDetail.length; i++) {
          const datarow = state.data.dataDetail[i] as {};
          datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as {};          
        if (state.data.dataDetail[i]['tischnr'] == dataRow['tischnr']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.dataDetail = [];
      state.data.dataDetail = dataTable;

      dataRow['selected'] = true;
      state.data.dataSelected = dataRow;
    }

    const onOkDialog = () => {
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
      tableHeaders,
      onOkDialog,
      showKeyboard,
      onRowClick,
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

