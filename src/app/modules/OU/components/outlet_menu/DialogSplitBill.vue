<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1100px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div
            class="row items-center q-gutter-sm q-mx-sm"
          >
            <q-card flat bordered>
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/CashPayment1.svg"
                >
                <q-tooltip>
                  Cash Payment
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered>
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/CCPayment1.svg"
                >
                <q-tooltip>
                  Credit Cash Payment
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered>
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/CityLedger.svg"
                >
                <q-tooltip>
                  City Ledger/ Transfer
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered>
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/rePrintBill1.svg"
                >
                <q-tooltip>
                  Table Transfer
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
            <q-card flat bordered>
              <q-card-section>                          
                <q-img
                  class="img-collage"
                  src="../../../../icons/OU/collage/PrintOrderChecker.svg"
                >
                <q-tooltip>
                  Print Order Taker
                </q-tooltip>
                </q-img>                          
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>

        <q-card-section>
            <div class="q-ma-sm row q-gutter-xs">
                <div class="col">
                    <STable
                        flat
                        bordered
                        hide-bottom
                        :loading="isLoading"
                        :columns="tableHeadersMainBill"
                        :data="data.dataTableMainBill"
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
                              @click="onRowClickMainBill(props.row)">
                                {{ col.value }}
                            </q-td>
                          </q-tr>
                        </template>
                    </STable>
                </div>

                <div class="row items-center">
                  <div class="col q-gutter-xs">
                    <q-btn unelevated color="primary" icon="mdi-chevron-left" @click="onClickMoveLeft"/>
                  </div>
                </div>

                <div class="row items-center">
                  <div class="col">
                    <q-btn unelevated color="primary" icon="mdi-chevron-right" @click="onClickMoveRight" />
                  </div>
                </div>

                <div class="col">
                    <STable
                        flat
                        bordered
                        hide-bottom
                        :loading="isLoading"
                        :columns="tableHeadersSplitBill"
                        :data="data.dataTableSplitBill"
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
                                <q-card-section @click="onRowClickSplitBill(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                                    <strong>{{ props.row.name }}</strong>
                                </q-card-section>
                            </q-card>
                            </div>
                        </template>
                    </STable>
                </div>
            </div>
        </q-card-section>

        <q-card-section>
          <div class="q-ma-sm row">
            <div class="col-md-8">
              <q-btn flat unelevated color="primary" icon="mdi-chevron-left" />
              <q-avatar rounded color="primary" text-color="white">01</q-avatar>
              <q-btn flat unelevated color="primary" icon="mdi-chevron-right" />
            </div>
            <div class="col-md-4">
              <SInput outlined  label-text="Amount" :disable="true" readonly/>
            </div>
          </div>
        </q-card-section>

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
    dataWantToSplit: any;
    dataTableSplitBill: any;
    dataTableMainBill: any;
    dataTableMain: any;
    buttonOkEnable: boolean;
  }
  title: string;
}

export default defineComponent({
  props: {
    showDialogSplitBill: { type: Boolean, required: true },
    dataSelectedSplitBill: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataWantToSplit: [],
        dataTableSplitBill : [],
        dataTableMainBill : [],
        dataTableMain : [
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
      () => props.showDialogSplitBill, (showDialogSplitBill) => {
        if (props.showDialogSplitBill) {
          state.data.buttonOkEnable = false;
          state.title = 'Split Bill';

          state.data.dataTableMainBill = state.data.dataTableMain.slice();

          console.log("Selected Data : ", props.dataSelectedSplitBill);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogSplitBill,
        set: (val) => {
            emit('onDialogSplitBill', val, null);
        },
    });

    const onRowClickSplitBill = (dataRow) => {
      console.log("Click split bill", state.data.dataTableSplitBill);
    }

    const onRowClickMainBill = (dataRow) => {
      var dataTable = state.data.dataTableMainBill;
      for (let i = 0; i<dataTable.length; i++) {
        const datarow = dataTable[i] as object;
        if (dataRow['id'] == datarow["id"]) {
          datarow['selected'] = !datarow['selected'];
          state.data.dataWantToSplit.push(dataRow);
        }
      }

      for (let x = 0; x<state.data.dataWantToSplit.length; x++) {
        const dataRow = state.data.dataWantToSplit[x];
        if (!dataRow['selected']) {
          state.data.dataWantToSplit.splice(x, 1);
        }
      }
      console.log("Click main bill : ", state.data.dataWantToSplit);
    }

    const onClickMoveRight = () => {
      // state.data.dataTableSplitBill = state.data.dataWantToSplit.slice();
      console.log(state.data.dataWantToSplit);

      // var dataTable = state.data.dataTableMainBill.slice()
      // for (let x = 0; x<dataTable.length; x++) {
      //   const dataRow = dataTable[x];
      //   if (dataRow['selected']) {
      //     state.data.dataTableMainBill.splice(x, 1);
      //     console.log(dataRow['name'] + dataRow['selected']);
      //   }
      // }

      // for (let x = 0; x<state.data.dataTableSplitBill.length; x++) {
      //     const datarowX = state.data.dataTableSplitBill[x];

      //     for (let i = 0; i<state.data.dataTableMainBill.length; i++) {
      //       const datarowI = state.data.dataTableMainBill[i];
      //       if (datarowI['id'] == datarowX['id']) {
      //         console.log(datarowX['name'])
      // //       state.data.dataTableMainBill.splice(i);
      //       }
      //     }
      //   }

    }

    const onClickMoveLeft = () => {

    }

    const tableHeadersMainBill = [
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

    const tableHeadersSplitBill = [
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
    }

    const onCancelDialog = () => {
      state.data.dataTableMainBill = state.data.dataTableMain;
      state.data.dataWantToSplit = [];
      state.data.dataTableSplitBill = [];
      emit('onDialogSplitBill', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersMainBill,
      tableHeadersSplitBill,
      onRowClickSplitBill,
      onRowClickMainBill,
      onOkDialogSelectUser,
      onClickMoveRight,
      onClickMoveLeft,
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

