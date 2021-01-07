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

                        <template v-slot:body="props">
                          <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-white':'bg-white text-black'">
                            <q-td
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                              @click="onRowClickSplitBill(props.row)">
                                {{ col.value }}
                            </q-td>
                          </q-tr>
                        </template>
                    </STable>
                </div>
            </div>
        </q-card-section>

        <q-card-section>
          <div class="q-ma-sm row">
            <div class="col-md-8">
              <q-btn flat unelevated color="primary" icon="mdi-chevron-left" @click="onClickChangeCounter('min')"/>
              <q-avatar rounded color="primary" text-color="white">{{data.counter}}</q-avatar>
              <q-btn flat unelevated color="primary" icon="mdi-chevron-right" @click="onClickChangeCounter('plus')"/>
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
    dataTableSplitBill: any;
    dataTableMainBill: any;
    dataTableMain: any;
    buttonOkEnable: boolean;
    counter: any,
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
        dataTableSplitBill : [],
        dataTableMainBill : [],
        dataTableMain : [
          {
            'name': "Cash",
            'id': '1',
            'selected': false,
            'counter': 0,
          },
          {
            'name': "Card",
            'id': '2',
            'selected': false,
            'counter': 0,
          },
          {
            'name': "City Ledger",
            'id': '3',
            'selected': false,
            'counter': 0,
          },
          {
            'name': "Transfer To Guest Folio",
            'id': '4',
            'selected': false,
            'counter': 0,
          },
          {
            'name': "Transfer To Non Guest Folio",
            'id': '5',
            'selected': false,
            'counter': 0,
          },
          {
            'name': "Transfer To Master Folio",
            'id': '6',
            'selected': false,
            'counter': 0,
          },
          {
            'name': "Compliment",
            'id': '7',
            'selected': false,
            'counter': 0,
          },
          {
            'name': "Meal Coupon",
            'id': '8',
            'selected': false,
            'counter': 0,
          }
        ],
        buttonOkEnable: false,
        counter: 1,
      },
      title: '',
    });

    watch(
      () => props.showDialogSplitBill, (showDialogSplitBill) => {
        if (props.showDialogSplitBill) {
          state.data.buttonOkEnable = false;
          state.title = 'Split Bill';

          state.data.dataTableMainBill = state.data.dataTableMain.slice()
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
      state.data.dataTableSplitBill.forEach(function(item, index, object) {
        if (item['id'] == dataRow['id']) {
          item['selected'] = !item['selected'];
        }
      });
    }

    const onRowClickMainBill = (dataRow) => {      
      state.data.dataTableMainBill.forEach(function(item, index, object) {
        if (item['id'] == dataRow['id']) {
          item['selected'] = !item['selected'];
        }
      });
    }

    const onClickMoveRight = () => {
      var dataTable = state.data.dataTableMainBill.slice()
      let index = dataTable.length - 1;

      while (index >= 0) {
        if (dataTable[index]['selected']) {
          dataTable[index]['counter'] = state.data.counter;
          state.data.dataTableSplitBill.push(dataTable[index]);
          dataTable.splice(index, 1);
        }
        index -= 1;
      }

      // Assign Counter to Native Data
      for (let i = 0; i<state.data.dataTableMain.length; i++) {
        const dataRowI = state.data.dataTableMain[i];
        for (let x = 0; x<state.data.dataTableMainBill.length; x++) {
          const dataRowX = state.data.dataTableMainBill[x];
          if (dataRowI['id'] == dataRowX['id']) {
            dataRowI['counter'] = dataRowX['counter'];
          }
        }

        for (let y = 0; y<state.data.dataTableSplitBill.length; y++) {
          const dataRowY = state.data.dataTableSplitBill[y];
          if (dataRowI['id'] == dataRowY['id']) {
            dataRowI['counter'] = dataRowY['counter'];
          }
        }
      }
 
      state.data.dataTableSplitBill.forEach(function(item, index, object) {
        item['selected'] = false;
      });
      state.data.dataTableMainBill = dataTable;
    }

    const onClickMoveLeft = () => {
      var dataTable = state.data.dataTableSplitBill.slice()
      let index = dataTable.length - 1;

      while (index >= 0) {
        if (dataTable[index]['selected']) {
          dataTable[index]['counter'] = 0;
          state.data.dataTableMainBill.push(dataTable[index]);
          dataTable.splice(index, 1);
        }
        index -= 1;
      }

      // Assign Counter to Native Data
      for (let i = 0; i<state.data.dataTableMain.length; i++) {
        const dataRowI = state.data.dataTableMain[i];
        for (let x = 0; x<state.data.dataTableMainBill.length; x++) {
          const dataRowX = state.data.dataTableMainBill[x];
          if (dataRowI['id'] == dataRowX['id']) {
            dataRowI['counter'] = dataRowX['counter'];
          }
        }

        for (let y = 0; y<state.data.dataTableSplitBill.length; y++) {
          const dataRowY = state.data.dataTableSplitBill[y];
          if (dataRowI['id'] == dataRowY['id']) {
            dataRowI['counter'] = dataRowY['counter'];
          }
        }
      }
 
      state.data.dataTableSplitBill.forEach(function(item, index, object) {
        item['selected'] = false;
      });
      state.data.dataTableSplitBill = dataTable;
    }

    const onClickChangeCounter = (flag) => {
      if (flag == "min") {
        if (state.data.counter >= 2) {
          state.data.counter--;
        }
      } else {
        state.data.counter++;
      }

      if (state.data.counter != 0) {
        var dataTable = state.data.dataTableMain;
        var newDataTable = [];
        dataTable.forEach(function(item, index, object) {
          const currCounter = item['counter'];
          
          if (currCounter == state.data.counter) {
            newDataTable.push(item);
          }
        });

        state.data.dataTableSplitBill = [];
        state.data.dataTableSplitBill = newDataTable;   
      }
      // console.log(state.data.dataTableMain);
      
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
      state.data.dataTableMainBill = [];
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
      onClickChangeCounter,
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

