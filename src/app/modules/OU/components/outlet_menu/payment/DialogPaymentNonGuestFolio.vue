<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
            <SInput outlined v-model="data.name" label-text="Name"/>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-sm">
            <STable
              hide-bottom
              :loading="isLoading"
              :columns="tableHeaders"
              :data="data.dataFilteredTable"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination">
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-white':'bg-white text-black'">
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
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog" />
        </q-card-actions>

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
                <p class="q-ml-md">Confirm selection {{data.dataSelected['bill-name']}} ? </p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline color="primary" label="Cancel" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmation()" v-close-popup />
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
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';

interface State {
  isLoading: boolean;
  data: {
    dataTable: any,
    dataFilteredTable: any,
    buttonOkEnable: boolean;
    name: string;
    dataSelected: {},
    overCLFlag: boolean,
  }
  showConfirmationDialog: boolean;
  title: string;
}

export default defineComponent({
  props: {
    showPaymentNonGuestFolio: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    selectedPrint: { type: Object, required: true }, 
    dataTable: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataTable: [],
        dataFilteredTable: [],
        buttonOkEnable: false,
        name: '',
        dataSelected: {},
        overCLFlag: false,
      },
      title: '',
      showConfirmationDialog: false,
    });

    watch(
      () => props.showPaymentNonGuestFolio, (showPaymentNonGuestFolio) => {
        if (props.showPaymentNonGuestFolio) {
          state.data.buttonOkEnable = false;
          state.title = 'Guest Non Folio Payment';

          console.log('On mount non guest folio : ', props.dataTable);

          getHTParam(1, 879);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentNonGuestFolio,
        set: (val) => {
            emit('onDialogPaymentNonGuestFolio', val, null);
        },
    });

    // -- HTTP Request method
    const getHTParam = (caseType, inp) => {
      state.isLoading = true;

      async function asyncCall() {
        const [gethtparam] = await Promise.all([
          $api.outlet.getCommonOutletUserList('getHTParam0', {
            caseType : caseType,
            inpParam: inp
          })
        ]);

        if (gethtparam) {
          const responseHTParam = gethtparam || [];
          const okFlag = responseHTParam['outputOkFlag'];

          console.log('responseHTParam : ', responseHTParam);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          getPrepare();
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

    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rnonstayPrepare', {
            dept : props.dataTable['dataHotelSelected']['num'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response prepare: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataTable = response['q1List']['q1-list'];
          state.data.dataTable.sort(function(a, b) { return (a['bill-name'] > b['bill-name']) ? 1 : ((b['bill-name'] > a['bill-name']) ? -1 : 0);} )
          state.data.dataFilteredTable = state.data.dataTable;
          state.data.overCLFlag = response['overCLFlag'];
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

    const getCheckCreditLimit = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rnonstayCheckCreditlimit', {
            rechnr : state.data.dataSelected['rechnr'],
            pvlLanguage : 1,
            recId : state.data.dataSelected['rec-id'],
            balance : state.data.dataSelected['saldo'],
            overCLFlag : state.data.overCLFlag,
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response getCheckCreditLimit: ', response);

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
    
    const tableHeaders = [
      {
            label: "Bill No", 
            field: "rechnr",
            name: "rechnr",
            align: "right",
        }, {
            label: "Bill Receiver", 
            field: "bill-name",
            name: "bill-name",
            align: "left",
        }, {
            label: "Balance", 
            field: "saldo",
            name: "saldo",
            align: "right",
        },
    ];

    // -- OnClick Listener
    const onRowClick = (dataRow) => {
     console.log(dataRow);

     for (let i = 0; i<state.data.dataFilteredTable.length; i++) {
        const datarow = state.data.dataFilteredTable[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.dataFilteredTable.length; i++) {
        const datarow = state.data.dataFilteredTable[i] as {};          
        if (state.data.dataFilteredTable[i]['rec-id'] == dataRow['rec-id']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.dataFilteredTable = [];
      state.data.dataFilteredTable = dataTable;

      dataRow['selected'] = true;
      state.data.dataSelected = dataRow;
      state.data.name = dataRow['bill-name'];
      state.data.buttonOkEnable = true;
    }

    const onOkDialog = () => {
      state.showConfirmationDialog = true;
    }

    const onCancelDialog = () => {
      emit('onDialogPaymentNonGuestFolio', false);
    }

    const onClickConfirmation = () => {
      state.showConfirmationDialog = false;
      getCheckCreditLimit();
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onOkDialog,
      onCancelDialog,
      getPrepare,
      onClickConfirmation,
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

