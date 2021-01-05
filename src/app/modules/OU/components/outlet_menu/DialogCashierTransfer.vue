<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1100px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <div class="row">
            <div class="col-5">
                <q-card-section>
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
                        <div class="q-pa-xs col-sm-3 col-md-4">
                        <q-card flat bordered :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                            <q-card-section @click="onRowClickTablePrint(props.row)" >
                                <strong>{{ props.row.name }}</strong>
                            </q-card-section>
                        </q-card>
                        </div>
                    </template>
                    </STable>

                    <div class="row">
                        <div class="col-3">
                            <SInput outlined value="52" class="q-mx-xs q-mt-md" label-text="Outlet Number" :disable="true" readonly/>
                        </div>
                        <div class="col-7">
                            <SInput outlined value="Ahmad" class="q-mx-xs q-mt-md" label-text="Name" :disable="true" readonly/>
                        </div>
                    </div>
                </q-card-section>
            </div>
            <div class="col-7">
                <q-card-section>
                    <div class="q-ma-sm row q-gutter-xs">
                        <div class="col">
                            <STable
                                flat
                                bordered
                                hide-bottom
                                :loading="isLoading"
                                :columns="tableHeadersPrint"
                                :data="data.dataTablePayment"
                                row-key="name"
                                separator="cell"
                                :rows-per-page-options="[0]"
                                :pagination.sync="pagination">
                                <template v-slot:loading>
                                    <q-inner-loading showing color="primary" />
                                </template>

                                <template v-slot:item="props">
                                    <div class="q-pa-xs col-xl-3 col-sm-3 col-md-3">
                                    <q-card>
                                        <q-card-section @click="onRowClickTablePayment(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                                            <strong>{{ props.row.name }}</strong>
                                        </q-card-section>
                                    </q-card>
                                    </div>
                                </template>
                            </STable>
                        </div>                        

                        <div class="col">
                            <STable
                                flat
                                bordered
                                hide-bottom
                                :loading="isLoading"
                                :columns="tableHeadersPrint"
                                :data="data.dataTablePayment"
                                row-key="name"
                                separator="cell"
                                :rows-per-page-options="[0]"
                                :pagination.sync="pagination">
                                <template v-slot:loading>
                                    <q-inner-loading showing color="primary" />
                                </template>

                                <template v-slot:item="props">
                                    <div class="q-pa-xs col-xl-3 col-sm-3 col-md-3">
                                    <q-card>
                                        <q-card-section @click="onRowClickTablePayment(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                                            <strong>{{ props.row.name }}</strong>
                                        </q-card-section>
                                    </q-card>
                                    </div>
                                </template>
                            </STable>
                        </div>

                    </div>
                    <div class="row text-center">
                        <div class="col q-gutter-xs">
                            <q-btn unelevated color="primary" icon="mdi-chevron-left" />
                            <q-btn unelevated color="primary" icon="mdi-chevron-right" />
                        </div>
                    </div>
                    <!-- <div class="row ">
                        <div class="col">
                        </div>
                    </div> -->
                </q-card-section>
            </div>
        </div>        

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialogSelectUser" :disable="!data.buttonOkEnable"/>
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
    dataTablePrint: any;
    dataTablePayment: any;
    buttonOkEnable: boolean;
  }
  title: string;
}

export default defineComponent({
  props: {
    showDialogCashierTransfer: { type: Boolean, required: true },
    dataSelectedCashierTransfer: { type: Object, required: true },
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
          }
        ],
        dataTablePayment : [
          {
            'name': "Cash",
            'id': '1',
            'selected': false,
          },
          {
            'name': "Card",
            'id': '2',
            'selected': false,
          },
          {
            'name': "City Ledger",
            'id': '3',
            'selected': false,
          },
          {
            'name': "Transfer To Guest Folio",
            'id': '4',
            'selected': false,
          },
          {
            'name': "Transfer To Non Guest Folio",
            'id': '5',
            'selected': false,
          },
          {
            'name': "Transfer To Master Folio",
            'id': '6',
            'selected': false,
          },
          {
            'name': "Compliment",
            'id': '7',
            'selected': false,
          },
          {
            'name': "Meal Coupon",
            'id': '8',
            'selected': false,
          }
        ],
        buttonOkEnable: false,
      },
      title: '',
    });

    watch(
      () => props.showDialogCashierTransfer, (showDialogCashierTransfer) => {
        if (props.showDialogCashierTransfer) {
          state.data.buttonOkEnable = false;
          state.title = 'Cashier Transfer';

          console.log("Selected Data : ", props.dataSelectedCashierTransfer);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogCashierTransfer,
        set: (val) => {
            emit('onDialogCashierTransfer', val, null);
        },
    });

    const onRowClickTablePayment = (dataRow) => {
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        datarow['selected'] = false;
      }        

      const id = dataRow['id'];
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const datarow = state.data.dataTablePayment[i];
        
        if (id === datarow['id']) {
          datarow['selected'] = true;
          datarow['databaru'] = 1;
          break;
        }
      }

      let flagButton = false;
      for (let i = 0; i<state.data.dataTablePrint.length; i++) {
        const selected = state.data.dataTablePrint[i]['selected'];

        if (selected === true) {
          flagButton = true;
          break
        }
      }

      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const selected = state.data.dataTablePayment[i]['selected'];

        if (flagButton && selected === true) {
          state.data.buttonOkEnable = true;
          break
        }
      }
    }

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
      for (let i = 0; i<state.data.dataTablePayment.length; i++) {
        const selected = state.data.dataTablePayment[i]['selected'];

        if (selected === true) {
          flagButton = true;
          break
        }
      }

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
      emit('onDialogCashierTransfer', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersPrint,
      onRowClickTablePayment,
      onRowClickTablePrint,
      onOkDialogSelectUser,
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

