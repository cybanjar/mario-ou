<template>
  <q-dialog id="dialogId" v-model="getDialogNonguestFolio" persistent>
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Nonguest Folio
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-3 q-pr-md">
            <div>
              <p class="q-mb-xs">Search By</p>
              <SSelect
                outlined
                class="q-mb-md"
                v-model="searchBy"
                @input="onChangeSearchBy"
                :options="searchByOptions"
                option-value="value"
                option-label="name"
                map-options
                emit-value
                :dense="true"
              />

              <SInput
                :label-text="searchBy"
                placeholder="Search...."
                @keydown="onChangeKeyword"
                v-model="keyword"
              />

              <q-btn
                block
                color="primary"
                max-height="28"
                icon="mdi-magnify"
                label="Search"
                type="submit"
                class="q-mb-md full-width"
                @click="onClickSearch"
              />

              <SRemarkLeftDrawer
                label="Guest Name"
                :value="name ? `${name} ${vorname1} ${anrede1}` : 'None'"
              />

              <SRemarkLeftDrawer label="Remark" :value="bemerk || 'None'" />
            </div>
          </div>

          <div id="tableLayoutId" class="col-9">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="getSelectBill1"
              :selected.sync="onSelectTable"
              row-key="indexFoc"
              :class="getSelectBill1.length > 0 && 'selected-table'"
              @row-click="onClickTable"
              :noPagination="true"
            >
              <template #header-cell-rechnr="props">
                <q-th :props="props" class="fixed-col left">
                  {{ props.col.label }}
                </q-th>
              </template>

              <template #body-cell-rechnr="props">
                <q-td :props="props" class="fixed-col left">
                  {{ props.row.rechnr }}
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
        <q-btn
          color="primary"
          label="OK"
          @click="onClickOk"
          :disable="!isBillSelected"
        />
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
  onMounted,
  ref,
} from '@vue/composition-api';
import { ResTableHeaders } from '../../../tables/NonGuestFolio/dialogNonguestFolio.table';
import { ResTableLists } from '../../../models/NonGuestFolio/dialogNonguestFolio.model';
import { store } from '~/store';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      selectedBill1: {},
      bemerk: '',
      name: '',
      vorname1: '',
      anrede1: '',
      keyword: '',
      searchBy: 'Folio Receiver',
      searchByOptions: [
        {
          name: 'Folio Receiver',
          value: 'Folio Receiver',
        },
        {
          name: 'Folio Number',
          value: 'Folio Number',
        },
      ],
      isBillSelected: false,
    });

    // Services
    const formatDate = (dateInput) => date.formatDate(dateInput, 'DD/MM/YYYY');

    // Getters
    const getDialogNonguestFolio = computed(() => {
      return store.getters.focNonguestFolio.GET_DIALOG_NONGUEST_FOLIO;
    });

    const getSelectedHotel: any = computed(() => {
      return store.getters.focNonguestFolio.GET_SELECTED_HOTEL;
    });

    const getGetHtParam0: any = computed(() => {
      return store.getters.focNonguestFolio.GET_GET_HT_PARAM_0;
    });

    const getNsMainLogic: any = computed(() => {
      return store.getters.focNonguestFolio.GET_NS_MAIN_LOGIC;
    });

    const getSelectBill1: any = computed(() => {
      const bills: any = store.getters.focNonguestFolio.GET_SELECT_BILL_1;

      if (bills.length > 0) {
        bills.map((item, index) => {
          item.saldo = formatThousands(item.saldo);
          item.datum = formatDate(item.datum);
          item.indexFoc = index;
        });
      }

      return bills;
    });

    // Main Functions
    const onReset = async () => {
      const selectBill1 = await $api.frontOfficeCashier.selectBill1({
        bilFlag: 0,
        sorttype: 1,
        gastname: ' ',
        dept: getSelectedHotel.value,
        baDept: getGetHtParam0.value.fint,
        rechnr: 0,
      });

      selectBill1.map((item, index) => {
        item.saldo = formatThousands(item.saldo);
        item.datum = formatDate(item.datum);
        item.indexFoc = index;
      });

      store.commit.focNonguestFolio.SET_SELECT_BILL_1(selectBill1);
    };

    const onChangeKeyword = () => {
      onReset();
    };

    const onChangeSearchBy = () => {
      onReset();
      state.keyword = '';
    };

    const onClickSearch = async () => {
      state.isFetching = true;

      let getSelectBill1: any =
        store.getters.focNonguestFolio.GET_SELECT_BILL_1;

      switch (true) {
        case state.searchBy === 'Folio Receiver':
          getSelectBill1 = getSelectBill1.filter((item) => {
            return state.keyword
              .toLowerCase()
              .split(' ')
              .every((v) => item.name.toLowerCase().includes(v));
          });
          break;

        default:
          getSelectBill1 = getSelectBill1.filter((item) => {
            return state.keyword == item.rechnr;
          });
          break;
      }

      store.commit.focNonguestFolio.SET_SELECT_BILL_1(getSelectBill1);
      state.isFetching = false;
    };

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      const selected: any = [row][0];
      onSelectTable.value = [row];
      state.selectedBill1 = selected;
      state.bemerk = selected.bemerk;
      state.name = selected.name;
      state.vorname1 = selected.vorname1;
      state.anrede1 = selected.anrede1;
      state.isBillSelected = true;
    };

    const onClickOk = async () => {
      const bill: any = state.selectedBill1;

      const nsOpenBill = await $api.frontOfficeCashier.nsOpenBill({
        bilRecid: bill['b-recid'],
        foreignRate: getNsMainLogic.value.foreignRate === 'true' ? true : false,
        doubleCurrency:
          getNsMainLogic.value.doubleCurrency === 'true' ? true : false,
        baDept: getGetHtParam0.value.fint,
      });

      state.isBillSelected = false;
      onSelectTable.value = [];
      state.selectedBill1 = {};
      store.commit.focNonguestFolio.SET_ICON_BILL_RECEIVER_ADDRESS(
        '/FOC/shapes/edit.svg'
      );
      store.commit.focNonguestFolio.SET_ICON_RESERVATION_REMARK(
        '/FOC/shapes/edit.svg'
      );
      store.commit.focNonguestFolio.SET_NS_OPEN_BILL(nsOpenBill);
      store.commit.focNonguestFolio.SET_SELECTED_BILL_1(bill);
      store.commit.focNonguestFolio.SET_DIALOG_NONGUEST_FOLIO(false);
    };

    const onClickCancel = () => {
      state.isBillSelected = false;
      onSelectTable.value = [];
      state.selectedBill1 = {};
      store.commit.focNonguestFolio.SET_DIALOG_NONGUEST_FOLIO(false);
    };

    return {
      // Services
      ResTableHeaders,
      formatDate,
      // Getters
      getDialogNonguestFolio,
      getSelectedHotel,
      getGetHtParam0,
      getSelectBill1,
      // Main Functions
      onReset,
      onChangeKeyword,
      onChangeSearchBy,
      onClickSearch,
      onSelectTable,
      onClickTable,
      onClickOk,
      onClickCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
#dialogId {
  .remark {
    max-height: 100px;
  }
}
</style>

<style lang="scss" scoped>
.dialog-card {
  max-width: 1000px;
  width: 100%;
}

.q-toolbar {
  background: $primary-grad;
}

#tableLayoutId {
  .selected-table {
    tbody tr.selected td {
      background: #1485cb !important;
      color: #fff;
    }
  }
  max-height: 450px !important;
  overflow: scroll;
}
</style>
