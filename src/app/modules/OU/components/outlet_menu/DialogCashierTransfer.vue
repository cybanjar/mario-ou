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
                    :columns="tableHeaders"
                    :data="data.dataDetailOrderTaker"
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
                            <q-card-section @click="onRowClickOrderTaker(props.row)" >
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
                                hide-header
                                :loading="isLoading"
                                :columns="tableHeadersLeft"
                                :data="data.dataTableLeft"
                                row-key="name"
                                separator="cell"
                                :rows-per-page-options="[0]"
                                :pagination.sync="pagination">
                                <template v-slot:loading>
                                    <q-inner-loading showing color="primary" />
                                </template>

                                <template v-slot:body="props">
                                  <q-tr :props="props">
                                    <q-td
                                      v-for="col in props.cols"
                                      :key="col.name"
                                      :props="props"
                                      @click="onRowClickTableLeft(props.row)">
                                        {{ col.value }}
                                    </q-td>
                                  </q-tr>
                                </template>
                            </STable>
                        </div>                        

                        <div class="col">
                            <STable
                                flat
                                bordered
                                hide-bottom
                                hide-header
                                :loading="isLoading"
                                :columns="tableHeadersRight"
                                :data="data.dataTableRight"
                                row-key="name"
                                separator="cell"
                                :rows-per-page-options="[0]"
                                :pagination.sync="pagination">
                                <template v-slot:loading>
                                    <q-inner-loading showing color="primary" />
                                </template>

                                <template v-slot:body="props">
                                  <q-tr :props="props">
                                    <q-td
                                      v-for="col in props.cols"
                                      :key="col.name"
                                      :props="props"
                                      @click="onRowClickTableRight(props.row)">
                                        {{ col.value }}
                                    </q-td>
                                  </q-tr>
                                </template>
                            </STable>
                        </div>
                    </div>
                </q-card-section>
            </div>
        </div>        

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog" />
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
    dataDetailOrderTaker: any;
    dataTableMain: any;
    dataTableLeft: any;
    dataTableRight: any;
    buttonOkEnable: boolean;
  }
  title: string;
}

export default defineComponent({
  props: {
    showDialogCashierTransfer: { type: Boolean, required: true },
    dataSelectedCashierTransfer: { type: Object, required: true },
    dataTable: { type: null, required: true },
    dataPrepare: { type: null, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetailOrderTaker: [],
        dataTableMain: [],
        dataTableLeft : [],
        dataTableRight : [],
        buttonOkEnable: false,
      },
      title: '',
    });

    watch(
      () => props.showDialogCashierTransfer, (showDialogCashierTransfer) => {
        if (props.showDialogCashierTransfer) {
          state.data.buttonOkEnable = false;
          state.title = 'Cashier Transfer';

          getRestInvCreateList();

          console.log("On Mount Cashier Transfer : ", props.dataPrepare);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogCashierTransfer,
        set: (val) => {
            emit('onDialogCashierTransfer', val, null);
        },
    });

    const tableHeaders = [
      {
        label: "Name", 
        field: "name",
        name: "name",
        align: "center",
      }
    ];

    const tableHeadersLeft = [
      {
        label: "Name", 
        field: "name",
        name: "name",
        align: "left",
      }
    ];

    const tableHeadersRight = [
      {
        label: "Name", 
        field: "name",
        name: "name",
        align: "left",
      }
    ];

    // -- HTTP Request Method
    const getRestInvCreateList = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCreateList', {
            currDept: props.dataPrepare['currDept'],
            currWaiter: 1,
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('restInvCreateList : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
          state.data.dataTableMain = response['tableList']['table-list'];
          for (let i = 0; i<state.data.dataTableMain.length; i++) {
            const datarow = state.data.dataTableMain[i];
            state.data.dataTableMain[i]['name'] = datarow['tischnr'] + ' - #' + datarow['rechnr'] + ' / ' + datarow['saldo']
          }
          state.data.dataTableLeft = state.data.dataTableMain.slice();
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

    // -- onClick listener
    const onRowClickTableLeft = (dataRow) => {
      for (let i = 0; i<state.data.dataTableLeft.length; i++) {
        if (state.data.dataTableLeft[i]['rechnr'] == dataRow['rechnr']) {
          state.data.dataTableRight.push(dataRow);
          state.data.dataTableLeft.splice(i, 1);
          break;
        }
      }
    }

    const onRowClickTableRight = (dataRow) => {
      for (let i = 0; i<state.data.dataTableRight.length; i++) {
        if (state.data.dataTableRight[i]['rechnr'] == dataRow['rechnr']) {
          state.data.dataTableLeft.push(dataRow);
          state.data.dataTableRight.splice(i, 1);
          break;
        }
      }
    }

    const onRowClickOrderTaker = (dataRow) => {
      for(let i = 0; i<state.data.dataDetailOrderTaker.length; i++) {
        const datarow = state.data.dataDetailOrderTaker[i];
        datarow['selected'] = false;
      }

      const id = dataRow['id'];
      for (let i = 0; i<state.data.dataDetailOrderTaker.length; i++) {
        const datarow = state.data.dataDetailOrderTaker[i];
        if (id === datarow['id']) {
          datarow['selected'] = true;
          break;
        }
      }
    }
    const onOkDialog = () => {
      // if (props.dataSelectedOrderTaker != null) {
      //   // emit('onDialogMenuOrderTaker', false, props.dataSelectedOrderTaker);
      // } 
    }

    const onCancelDialog = () => {
      emit('onDialogCashierTransfer', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClickTableRight,
      onRowClickTableLeft,
      onRowClickOrderTaker,
      onOkDialog,
      onCancelDialog,
      tableHeadersLeft,
      tableHeadersRight,
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

