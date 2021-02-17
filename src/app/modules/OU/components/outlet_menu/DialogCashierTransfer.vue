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
                      <div class="q-pa-xs col-xl-3 col-sm-3 col-md-3">
                        <q-card flat bordered>
                          <q-card-section @click="onRowClickOrderTaker(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                              <strong>{{ props.row.bezeich }}</strong>
                          </q-card-section>
                        </q-card>
                      </div>
                    </template>

                  </STable>

                  <div class="row">
                    <div class="col-3">
                        <SInput outlined v-model="data.num" class="q-mx-xs q-mt-md" label-text="Outlet Number" :disable="true" readonly/>
                    </div>
                    <div class="col-7">
                      <SInput outlined v-model="data.name" class="q-mx-xs q-mt-md" label-text="Name" :disable="true" readonly/>
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

        <q-dialog v-model="showConfirmationDialog" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirm selection ?</q-toolbar-title>
            </q-toolbar>

          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-md-2">
                <q-avatar icon="mdi-help" color="negative" text-color="white" />
              </div>
              <div class="col-md-10">                  
                <p class="q-ml-md">Confirm Waiter Transfer of the selected tables?</p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline color="primary" label="Cancel" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmation(0)" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showDialogID" persistent>
          <q-card  style="max-width: 1500px;width:600px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Enter your ID</q-toolbar-title>
            </q-toolbar>

            <div class="row">
                <div class="col q-ma-md">
                    <SInput type="number" autofocus v-model="id" label-text="ID" data-layout="numeric" @focus="showKeyboard" />
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
              <q-btn outline color="primary" label="Cancel" v-close-popup />
              <q-btn unelevated color="primary" label="OK" @click="onClickConfirmation(1)" />
            </q-card-actions>
          </q-card>
        </q-dialog>

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
import { Notify, date } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    dataDetailOrderTaker: any;
    dataTableMain: any;
    dataTableLeft: any;
    dataTableRight: any;
    buttonOkEnable: boolean;
    dataSelected: null;
    num: any;
    name: String;
    p1079: any;
  }
  title: string;
  showConfirmationDialog: boolean;
  showDialogID: boolean;
  id: any;
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
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
        dataSelected: null,
        num: 0,
        name: '',
        p1079: false,
      },
      title: '',
      showConfirmationDialog: false,
      showDialogID: false,
      id:'',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: 'numeric',
      input: null,
      numpadVisible: false,
    });

    watch(
      () => props.showDialogCashierTransfer, (showDialogCashierTransfer) => {
        if (props.showDialogCashierTransfer) {
          state.data.buttonOkEnable = false;
          state.title = 'Cashier Transfer';

          getRestInvCreateUserList();

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
            currWaiter: props.dataPrepare['currWaiter'],
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

    const getRestInvCreateUserList = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvWaiterHelpusrGlist', {
            dept: props.dataPrepare['currDept'],
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('restInvWaiterHelpusrGlist : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          state.data.dataDetailOrderTaker = response['grpList']['grp-list'];

          getRestInvCreateList();
         
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

    const getSave = () => {
      state.isLoading = true;

      const dataRequest = [];
      for (let i = 0; i<state.data.dataTableRight.length; i++) {
        const datarow = state.data.dataTableRight[i];
        const obj = {};
        obj['belong'] = datarow['belong'];
        obj['rechnr'] = datarow['rechnr'];
        obj['saldo'] = datarow['saldo'];
        obj['tischnr'] = datarow['tischnr'];
        dataRequest.push(obj);
      }

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvWaiterTransfer1', {
            pvILanguage: 1,
            currDept: props.dataPrepare['currDept'],
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            currWaiter: props.dataPrepare['currWaiter'],
            usrNr: state.data.dataSelected['num'],
            tableList: {
              'table-list' : dataRequest
            },
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('restInvWaiterTransfer1 : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }         
          state.isLoading = false;

          state.data.dataTableMain = [];
          state.data.dataTableLeft = [];
          state.data.dataTableRight = [];
          state.data.num = 0;
          state.data.name = '';
          state.data.dataDetailOrderTaker = [];
          state.data.dataSelected = null;
          emit('onDialogCashierTransfer', false);
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

    const getCheckPassword = () => {
      state.isLoading = true;

      console.log('Request : ', {
            passwd: state.id,
            knr : state.data.num,
            dept: props.dataPrepare['currDept'],
          });

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvWaiterHelpusrCheckPwd', {
            passwd: state.id,
            knr : state.data.num,
            dept: props.dataPrepare['currDept'],
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('restInvWaiterHelpusrCheckPwd : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          state.isLoading = false;
          if (response['itsOk'] == 'false') {
            Notify.create({
              message: 'Wrong password',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } else {
            getSave();
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


    // -- onClick listener
    const onRowClickTableLeft = (dataRow) => {
      for (let i = 0; i<state.data.dataTableLeft.length; i++) {
        if (state.data.dataTableLeft[i]['rechnr'] == dataRow['rechnr']) {
          dataRow['belong'] = 'R';
          state.data.dataTableRight.push(dataRow);
          state.data.dataTableLeft.splice(i, 1);
          break;
        }
      }
    }

    const onRowClickTableRight = (dataRow) => {
      for (let i = 0; i<state.data.dataTableRight.length; i++) {
        if (state.data.dataTableRight[i]['rechnr'] == dataRow['rechnr']) {
          dataRow['belong'] = 'L';
          state.data.dataTableLeft.push(dataRow);
          state.data.dataTableRight.splice(i, 1);
          break;
        }
      }
    }

    const onRowClickOrderTaker = (dataRow) => {
      for (let i = 0; i<state.data.dataDetailOrderTaker.length; i++) {
        const datarow = state.data.dataDetailOrderTaker[i];
        datarow['selected'] = false;
      }        

      const data = state.data.dataDetailOrderTaker.slice();
      state.data.dataDetailOrderTaker = [];
      const num = dataRow['num'];
      for (let i = 0; i<data.length; i++) {
        const datarow = data[i];
        
        if (num === datarow['num']) {
          datarow['selected'] = true;
          state.data.dataSelected = datarow;
          break;
        }
      }

      state.data.dataDetailOrderTaker = data;
      state.data.num = dataRow['num'];
      state.data.name = dataRow['bezeich'];
    }
    const onOkDialog = () => {
      state.showConfirmationDialog = true;
    }

    const onCancelDialog = () => {
      state.data.dataTableMain = [];
      state.data.dataTableLeft = [];
      state.data.dataTableRight = [];
      state.data.num = 0;
      state.data.name = '';
      state.data.dataDetailOrderTaker = [];
      state.data.dataSelected = null;

      emit('onDialogCashierTransfer', false);
    }

    const onClickConfirmation = (id) => {
      if (id == 0) {
        if (state.data.dataSelected == null) {
          Notify.create({
            message: 'Please select a user',
            color: 'red',
          });
        } else {
          if (props.dataPrepare['currWaiter'] == state.data.dataSelected['num']) {
            Notify.create({
              message: 'Same user was selected, transfer not possible',
              color: 'red',
            });
          } else {
            if (state.data.p1079 == 'true') {
              state.showDialogID = true;
            } else {
              console.log(state.data);
              console.log('saving ..');
              getSave();

            }
          }
        }
      } else {
        getCheckPassword();
      }
    }

    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
      } 
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
      onClickConfirmation,
      showKeyboard,
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

