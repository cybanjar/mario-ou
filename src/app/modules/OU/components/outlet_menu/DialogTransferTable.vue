<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="max-width: 1500px">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{
            title
          }}</q-toolbar-title>
        </q-toolbar>

        <q-separator />

        <q-card-section style="max-height: 70vh" class="scroll">
          <div class="q-ma-sm row">
            <SInput class="q-mr-md" outlined label-text="Enter Table Number" />
            <STable
              class="my-sticky-header-table"
              flat
              bordered
              dense
              :loading="isLoading"
              :columns="tableHeaders"
              :data="data.dataDetail"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="pagination"
            >
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  :class="
                    props.row.selected
                      ? 'bg-cyan text-white'
                      : 'bg-white text-black'
                  "
                >
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    @click="onRowClick(props.row)"
                  >
                    {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </STable>
          </div>
        </q-card-section>

        <q-dialog v-model="showDialogComfirmation" persistent>
          <q-card style="max-width: 1500px; width: 450px">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium"
                >Confirm</q-toolbar-title
              >
            </q-toolbar>

            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-md-2">
                  <q-avatar
                    icon="mdi-help"
                    color="negative"
                    text-color="white"
                  />
                </div>
                <div class="col-md-10">
                  <p class="q-ml-md">{{ msgStrConfirmation }}</p>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                outline
                label="Cancel"
                color="primary"
                @click="showDialogComfirmation = false"
              />
              <q-btn
                unelevated
                label="Ok"
                color="primary"
                @click="getRestInvMoveTable()"
              />
              <!-- <q-btn unelevated label="Ok" color="primary" /> -->
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            outline
            color="primary"
            label="Cancel"
            @click="onCancelDialog"
            v-close-popup
          />
          <q-btn
            unelevated
            color="primary"
            label="OK"
            @click="onOkDialog"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
  import {
    defineComponent,
    computed,
    watch,
    reactive,
    toRefs,
  } from '@vue/composition-api';
  import { Notify } from 'quasar';
  import { dataTable } from '~/app/modules/GC/utils/params.cashAdvance';

  interface State {
    isLoading: boolean;
    data: {
      dataDetail: any;
      dataSelected: {};
    };
    layout: string;
    input: null;
    title: string;
    showDialogComfirmation: boolean;
    msgStrConfirmation: string;
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
        showDialogComfirmation: false,
        msgStrConfirmation: '',
      });

      watch(
        () => props.showDialogTransferTable,
        (showDialogTransferTable) => {
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

        const bilrecid =
          state.data.dataSelected['tHBill'].length != 0
            ? state.data.dataSelected['tHBill']['rec-id']
            : 0;
        console.log('bilrecid : ', bilrecid);

        async function asyncCall() {
          const [data] = await Promise.all([
            $api.outlet.getOUPrepare('restInvMoveTable', {
              pax: state.data.dataSelected['belegung'],
              currTischnr: props.dataTable['tischnr'],
              recId: props.dataTable['recidBill'],
              currDept: props.dataTable['departement'],
              tischnr: state.data.dataSelected['tischnr'],
              bilrecid: bilrecid,
              rechnr: props.dataTable['rechnr'],
              currWaiter: '1',
              newWaiter: '1',
            }),
          ]);

          if (data) {
            const response = data || [];
            const okFlag = response['outputOkFlag'];
            console.log('response : ', response);

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
      };

      const getTischnrBuildListSelect = () => {
        state.isLoading = true;

        async function asyncCall() {
          const [data] = await Promise.all([
            $api.outlet.getOUPrepare('tischnrBuildListSelect ', {
              dept: props.dataTable['departement'],
              nr: 1,
            }),
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
      };

      const getTranstischBtnExit = () => {
        state.isLoading = true;

        async function asyncCall() {
          const [data] = await Promise.all([
            $api.outlet.getOUPrepare('transtischBtnExit ', {
              currDept: props.dataTable['departement'],
              tableno: state.data.dataSelected['tischnr'],
              pvILanguage: 0,
            }),
          ]);

          if (data) {
            const response = data || [];
            const okFlag = response['outputOkFlag'];

            console.log('response transtischBtnExit: ', response);

            if (!okFlag) {
              Notify.create({
                message: 'Failed when retrive data, please try again',
                color: 'red',
              });
              state.isLoading = false;
              return false;
            }

            state.data.dataSelected['tHBill'] = response['tHBill']['t-h-bill'];
            console.log('table : ', props.dataTable);
            console.log('table selected : ', state.data.dataSelected);

            if (response['errCode'] == 1) {
              Notify.create({
                message: 'No such table number',
                color: 'red',
              });
              state.isLoading = false;
              return false;
            } else if (response['errCode'] != 1) {
              if (response['tHBill']['t-h-bill'].length != 0) {
                state.msgStrConfirmation =
                  'The selected table is already occupied. Are you sure you want to move to this table?';
                state.showDialogComfirmation = true;
                state.isLoading = false;
              } else {
                getRestInvMoveTable();
                state.isLoading = false;
              }
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
      };

      const showKeyboard = (e) => {
        if (e.target.localName == 'input') {
          state.input = e.target;
          state.layout = e.target.dataset.layout;
        }

        console.log('input', state.input);
      };

      const tableHeaders = [
        {
          label: 'Table Number',
          field: 'tischnr',
          name: 'tischnr',
          align: 'center',
        },
        {
          label: 'Seat',
          field: 'normalbeleg',
          name: 'normalbeleg',
          align: 'center',
        },
        {
          label: 'OCC',
          field: 'occupied',
          name: 'occupied',
          align: 'center',
        },
        {
          label: 'Pax',
          field: 'belegung',
          name: 'belegung',
          align: 'center',
        },
        {
          label: 'Served by',
          field: 'name',
          name: 'name',
          align: 'center',
        },
        {
          label: 'Balance',
          field: 'balance',
          name: 'balance',
          align: 'center',
        },
        {
          label: 'Desc',
          field: 'bezeich',
          name: 'bezeich',
          align: 'center',
        },
      ];

      // --
      const onRowClick = (dataRow) => {
        for (let i = 0; i < state.data.dataDetail.length; i++) {
          const datarow = state.data.dataDetail[i] as {};
          datarow['selected'] = false;
        }

        const dataTable = [] as any;
        for (let i = 0; i < state.data.dataDetail.length; i++) {
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
        console.log(state.data.dataSelected);
      };

      const onOkDialog = () => {
        if (state.data.dataSelected['tischnr'] == 0) {
          Notify.create({
            message: 'No such table number',
            color: 'red',
          });
          return false;
        } else {
          getTranstischBtnExit();
        }
      };

      const onCancelDialog = () => {
        emit('onDialogTransferTable', false);
      };

      return {
        dialogModel,
        ...toRefs(state),
        tableHeaders,
        onOkDialog,
        showKeyboard,
        getRestInvMoveTable,
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

  .my-sticky-header-table {
    /* height or max-height is important */
    height: 60vh;

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th {
      /* bg color is important for th; just specify one */
      background-color: #c1f4cd;
    }

    thead tr th {
      position: sticky;
      z-index: 1;
    }

    thead tr:first-child th {
      top: 0;

      /* this is when the loading indicator appears */
      &.q-table--loading thead tr:last-child th {
        /* height of all previous header rows */
        top: 48px;
      }
    }
  }
</style>

