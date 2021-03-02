<template>
  <q-dialog v-model="getDialogFcer">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Foreign Currency Administration
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12 q-mt-lg f-top q-px-sm q-mb-md">
            <div class="icon">
              <q-img :src="require('~/app/icons/Icon-AddDisable.svg')">
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                  content-class="bg-dark"
                >
                  Add
                </q-tooltip>
              </q-img>
            </div>

            <div class="icon" style="width: 25px; height: 25px">
              <q-img :src="require('~/app/icons/Icon-Refresh.svg')">
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                  content-class="bg-dark"
                >
                  Refresh
                </q-tooltip>
              </q-img>
            </div>

            <div class="icon">
              <q-img :src="require('~/app/icons/Icon-Print.svg')">
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                  content-class="bg-dark"
                >
                  Print
                </q-tooltip>
              </q-img>
            </div>
          </div>

          <div class="col-3">
            <div class="f-middle-between">
              <SInput
                label-text="Number"
                disable
                class="q-px-sm"
                v-model="number"
              />
              <SInput
                label-text="Code"
                disable
                class="q-px-sm"
                v-model="code"
              />
            </div>
          </div>

          <div class="col-3 q-px-sm">
            <SInput label-text="Description" disable v-model="description" />
          </div>

          <div class="col-3 q-px-sm">
            <SInput label-text="Purchase" disable v-model="purchase" />
          </div>

          <div class="col-3 q-px-sm">
            <SInput label-text="Sales" disable v-model="sales" />
          </div>

          <div class="col-3 q-px-sm">
            <SInput label-text="Unit" disable v-model="unit" />
          </div>
          <div class="col-3 q-px-sm f-middle-between">
            <div>
              <p class="q-mb-none">Room Rate</p>
              <q-toggle
                size="md"
                v-model="roomRate"
                class="switch-toggle"
                disable
              />
            </div>
            <div>
              <p class="q-mb-none">Money Exchange</p>
              <q-toggle
                size="md"
                v-model="moneyExchange"
                class="switch-toggle"
                disable
              />
            </div>
          </div>
          <div class="col-3 q-px-sm"></div>
          <div class="col-3 q-px-sm btn-group">
            <q-btn
              color="white"
              text-color="black"
              label="Cancel"
              class="q-mr-sm"
            />
            <q-btn color="primary" label="Add" disable />
          </div>
          <div id="tableLayoutId" class="col-12 q-px-sm q-mt-lg">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="getReadCurrency"
              row-key="indexFoc"
              :noPagination="true"
              :selected.sync="onSelectTable"
              :class="getReadCurrency.length > 0 && 'selected-table'"
              @row-click="onClickTable"
            >
              <template #header-cell-zinr="props">
                <q-th :props="props" class="fixed-col left">
                  {{ props.col.label }}
                </q-th>
              </template>

              <template #body-cell-zinr="props">
                <q-td :props="props" class="fixed-col left">
                  {{ props.row.zinr }}
                </q-td>
              </template>

              <template #body-cell-actions="props">
                <q-td :props="props" class="fixed-col right">
                  <q-icon name="mdi-dots-vertical" size="16px">
                    <q-menu auto-close anchor="bottom right" self="top right">
                      <q-list>
                        <q-item clickable v-ripple>
                          <q-item-section>Action</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </q-td>
              </template>
            </STable>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
          @click="onClickCancel"
        />
        <q-btn color="primary" label="Ok" @click="onClickOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
} from '@vue/composition-api';
import { store } from '~/store';
import { ResTableHeaders } from '~/app/modules/FOC/tables/foreignCurrencyExchangeRate.table';
import { ResTableLists } from '~/app/modules/FOC/models/foreignCurrencyExchangeRate.model';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      selectedData: {},
      table: [],
      number: null,
      code: null,
      description: null,
      purchase: null,
      sales: null,
      unit: null,
      roomRate: false,
      moneyExchange: false,
    });

    const getDialogFcer = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_FCER;
    });

    const getReadCurrency = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_READ_CURRENCY;
      if (res.tWaehrung) {
        res.tWaehrung['t-waehrung'].map((item, index) => {
          item.indexFoc = index;
        });
        res = res.tWaehrung['t-waehrung'];
      } else {
        res = [];
      }
      return res;
    });

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      const selected = [row][0];
      onSelectTable.value = [row];
      state.selectedData = [row][0];
      state.number = selected.waehrungsnr;
      state.code = selected.wabkurz;
      state.description = selected.bezeich;
      state.purchase = selected.ankauf;
      state.sales = selected.verkauf;
      state.unit = selected.einheit;
      state.roomRate = selected.betriebsnr === 1 ? false : true;
    };

    const onClickOk = async () => {
      store.commit.focGuestFolio.SET_DIALOG_FCER(false);
    };

    const onClickCancel = async () => {
      store.commit.focGuestFolio.SET_DIALOG_FCER(false);
    };

    return {
      ResTableHeaders,
      getDialogFcer,
      getReadCurrency,
      onSelectTable,
      onClickTable,
      onClickOk,
      onClickCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  min-width: 1000px;
  width: 1000px;

  .q-toolbar {
    background: $primary-grad;
  }

  .icon {
    width: 30px;
    height: 30px;
    margin-right: 30px;
    cursor: pointer;
  }

  .switch-toggle {
    margin-left: -12px;
    margin-top: -3px;
  }
}

.f-top {
  display: flex;
  align-items: baseline;
}

.f-middle-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 16px;
}

// #tableLayoutId {
//   .selected-table {
//     tbody tr.selected td {
//       background: #1485cb !important;
//       color: #fff;
//     }
//   }
//   max-height: 450px !important;
//   overflow: scroll;
// }
</style>
