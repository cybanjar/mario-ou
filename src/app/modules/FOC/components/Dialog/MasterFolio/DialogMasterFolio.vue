<template>
  <q-dialog id="DialogId" v-model="getDialogMasterFolio" persistent>
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Master Folio
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
                :disable="searchBy === 'All Guest Checkout' ? true : false"
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
              :data="getSelectBill2"
              :selected.sync="onSelectTable"
              row-key="indexFoc"
              :class="getSelectBill2.length > 0 && 'selected-table'"
              @row-click="onClickTable"
              :noPagination="true"
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
import { ResTableHeaders } from '~/app/modules/FOC/tables/MasterFolio/dialogMasterFolio.table';
import { ResTableLists } from '~/app/modules/FOC/models/MasterFolio/dialogMasterFolio.model';
import { store } from '~/store';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      selectedBill2: {},
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
        {
          name: 'All Guest Checkout',
          value: 'All Guest Checkout',
        },
      ],
      isBillSelected: false,
    });

    // Services
    const formatDate = (dateInput) => date.formatDate(dateInput, 'DD/MM/YYYY');

    // Getters
    const getDialogMasterFolio = computed(
      () => store.getters.focMasterFolio.GET_DIALOG_MASTER_FOLIO
    );

    const getMbMainLogic: any = computed(
      () => store.getters.focMasterFolio.GET_MB_MAIN_LOGIC
    );

    const getGetHtParam0: any = computed(
      () => store.getters.focMasterFolio.GET_GET_HT_PARAM_0
    );

    const getSelectBill2: any = computed(() => {
      const bills: any = store.getters.focMasterFolio.GET_SELECT_BILL_2;

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
      const selectBill2 = await $api.frontOfficeCashier.selectBill2({
        caseType: state.searchBy === 'All Guest Checkout' ? 2 : 1,
        resnr: 0,
        bilFlag: 0,
        masterFlag: false,
        sorttype: 1,
        gastname: '*',
        currGastnr: 0,
        billType: 2,
        ciDate: formatDate(getGetHtParam0.value.fdate),
      });

      if (state.searchBy === 'All Guest Checkout') {
        selectBill2.b2List['b2-list'].map((item, index) => {
          item.saldo = formatThousands(item.saldo);
          item.datum = formatDate(item.datum);
          item.indexFoc = index;
        });

        store.commit.focMasterFolio.SET_SELECT_BILL_2(
          selectBill2.b2List['b2-list']
        );
      } else {
        selectBill2.b1List['b1-list'].map((item, index) => {
          item.saldo = formatThousands(item.saldo);
          item.datum = formatDate(item.datum);
          item.indexFoc = index;
        });

        store.commit.focMasterFolio.SET_SELECT_BILL_2(
          selectBill2.b1List['b1-list']
        );
      }
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

      let getSelectBill2: any = store.getters.focMasterFolio.GET_SELECT_BILL_2;

      switch (true) {
        case state.searchBy === 'Folio Receiver':
          getSelectBill2 = getSelectBill2.filter((item) => {
            return state.keyword
              .toLowerCase()
              .split(' ')
              .every((v) => item.name.toLowerCase().includes(v));
          });
          break;

        case state.searchBy === 'Folio Number':
          getSelectBill2 = getSelectBill2.filter((item) => {
            return state.keyword == item.rechnr;
          });
          break;

        default:
          const selectBill2 = await $api.frontOfficeCashier.selectBill2({
            caseType: 2,
            resnr: 0,
            bilFlag: 0,
            masterFlag: false,
            sorttype: 1,
            gastname: '*',
            currGastnr: 0,
            billType: 2,
            ciDate: formatDate(getGetHtParam0.value.fdate),
          });
          selectBill2.b2List['b2-list'].map((item, index) => {
            item.saldo = formatThousands(item.saldo);
            item.datum = formatDate(item.datum);
            item.indexFoc = index;
          });

          store.commit.focMasterFolio.SET_SELECT_BILL_2(
            selectBill2.b2List['b2-list']
          );
          break;
      }

      store.commit.focMasterFolio.SET_SELECT_BILL_2(getSelectBill2);
      state.isFetching = false;
    };

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      const selected: any = [row][0];
      onSelectTable.value = [row];
      state.selectedBill2 = selected;
      state.bemerk = selected.bemerk;
      state.name = selected.name;
      state.vorname1 = selected.vorname1;
      state.anrede1 = selected.anrede1;
      state.isBillSelected = true;
    };

    const onClickOk = async () => {
      const bill: any = state.selectedBill2;

      const mbOpenBill = await $api.frontOfficeCashier.mbOpenBill({
        bilRecid: bill['rec-id'],
        foreignRate: getMbMainLogic.foreignRate === 'true' ? true : false,
        doubleCurrency: getMbMainLogic.doubleCurrency === 'true' ? true : false,
        baDept: getMbMainLogic.baDept,
      });

      state.isBillSelected = false;
      onSelectTable.value = [];
      state.selectedBill2 = {};
      store.commit.focMasterFolio.SET_ICON_BILL_RECEIVER_ADDRESS(
        '/FOC/shapes/edit.svg'
      );
      store.commit.focGuestFolio.SET_ICON_SEARCH('/FOC/shapes/search.svg');
      store.commit.focMasterFolio.SET_SELECTED_BILL_2(bill);
      store.commit.focMasterFolio.SET_MB_OPEN_BILL(mbOpenBill);
      store.commit.focMasterFolio.SET_DIALOG_MASTER_FOLIO(false);
    };

    const onClickCancel = () => {
      state.isBillSelected = false;
      onSelectTable.value = [];
      state.selectedBill2 = {};
      store.commit.focMasterFolio.SET_DIALOG_MASTER_FOLIO(false);
    };

    return {
      // Services
      ResTableHeaders,
      formatDate,
      // Getters
      getDialogMasterFolio,
      getMbMainLogic,
      getGetHtParam0,
      getSelectBill2,
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
#DialogId {
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
