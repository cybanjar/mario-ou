<template>
  <q-dialog id="dialogGuestFolioId" v-model="getDialogGuestFolio" persistent>
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Inhouse
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
              <div v-if="searchBy !== 'Today Checkout'">
                <SInput
                  :label-text="searchBy"
                  placeholder="Search...."
                  @keydown="onChangeKeyword"
                  v-model="keyword"
                />
              </div>
              <div v-else>
                <SInput
                  :label-text="searchBy"
                  placeholder="Select date"
                  @keydown="onChangeKeyword"
                  v-model="keyword"
                  readonly
                >
                  <template #append>
                    <q-icon name="mdi-calendar" />
                  </template>

                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="keyword"
                      mask="MM/DD/YYYY"
                      today-btn
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </SInput>
              </div>
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
                :value="
                  selectedBill.resname
                    ? `${selectedBill.resname} ${selectedBill.address} ${selectedBill.city}`
                    : 'None'
                "
              />
              <SRemarkLeftDrawer
                label="Remark"
                :value="
                  selectedBill['b-comments']
                    ? selectedBill['b-comments']
                    : 'None'
                "
              />
            </div>
          </div>
          <div id="tableLayoutId" class="col-9">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="getSelectBill"
              :selected.sync="onSelectTable"
              row-key="indexFoc"
              :class="getSelectBill.length > 0 && 'selected-table'"
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
import { ResTableHeaders } from '../../../tables/GuestFolio/dialogGuestFolio.table';
import { ResTableLists } from '../../../models/GuestFolio/dialogGuestFolio.model';
import { store } from '~/store';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      selectedBill: {},
      keyword: '',
      searchBy: 'Room Number',
      searchByOptions: [
        {
          name: 'Room Number',
          value: 'Room Number',
        },
        {
          name: 'Bill Receiver',
          value: 'Bill Receiver',
        },
        {
          name: 'Bill Number',
          value: 'Bill Number',
        },
        {
          name: 'Today Checkout',
          value: 'Today Checkout',
        },
      ],
      isBillSelected: false,
    });

    const getDialogGuestFolio = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_GUEST_FOLIO;
    });

    const getSelectBill: any = computed(() => {
      let bills: any = store.getters.focGuestFolio.GET_SELECT_BILL;
      const formatDate = (dateInput) =>
        date.formatDate(dateInput, 'DD/MM/YYYY');
      if (bills.length > 0) {
        bills.map((bill) => {
          bill.saldo = formatThousands(bill.saldo);
          bill.datum = formatDate(bill.datum);
        });
      }
      return bills;
    });

    const onReset = async () => {
      const selectBill = await $api.frontOfficeCashier.selectBill();
      const formatDate = (dateInput) =>
        date.formatDate(dateInput, 'DD/MM/YYYY');

      selectBill.map((getParentBill) => {
        getParentBill.saldo = formatThousands(getParentBill.saldo);
        getParentBill.datum = formatDate(getParentBill.datum);
      });

      store.commit.focGuestFolio.SET_SELECT_BILL(selectBill);
      state.isFetching = false;
    };

    const onChangeKeyword = () => {
      onReset();
    };

    const onChangeSearchBy = () => {
      onReset();
      state.keyword = '';
    };

    const onClickSearch = async () => {
      const getSelectBill: any = store.getters.focGuestFolio.GET_SELECT_BILL;
      state.isFetching = true;
      let res;
      let body;

      switch (true) {
        case state.searchBy === 'Room Number':
          body = {
            sorttype: '1',
            zinr: state.keyword.length > 0 ? state.keyword : ' ',
            bilInt: '0',
          };
          res = await $api.frontOfficeCashier.selectBill(body);
          break;
        case state.searchBy === 'Bill Receiver':
          res = getSelectBill.filter((item) => {
            return state.keyword
              .toLowerCase()
              .split(' ')
              .every((v) => item.name.toLowerCase().includes(v));
          });
          break;
        case state.searchBy === 'Bill Number':
          res = getSelectBill.filter((item) => {
            return state.keyword == item.rechnr;
          });
          break;
        default:
          body = {
            pvILanguage: 1,
            sorttype: 4,
            zinr: ' ',
            bilInt: 0,
            currGastnr: 0,
            ciDate: state.keyword,
            gastname: ' ',
            toName: ' ',
            rechnr: 0,
          };
          res = await $api.frontOfficeCashier.selectBill(body);
      }

      store.commit.focGuestFolio.SET_SELECT_BILL(res);
      state.isFetching = false;
    };

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
      state.selectedBill = [row][0];
      state.isBillSelected = true;
    };

    const onClickOk = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const bill: any = state.selectedBill;
      const getFoInvoicePrepare: any =
        store.getters.focGuestFolio.GET_FO_INVOICE_PREPARE;
      const billListFOInvoice = await $api.frontOfficeCashier.billListFOInvoice(
        {
          bilFlag: 0,
          bilRecid: bill['rec-id'],
          room: bill.zinr,
          vipflag: false,
          fillCo: true,
          doubleCurrency: getFoInvoicePrepare.doubleCurrency === 'true',
          foreignRate: getFoInvoicePrepare.foreignRate === 'true',
        }
      );

      const foInvoiceMView = await $api.frontOfficeCashier.foInvoiceMView({
        bilRecid: bill['rec-id'],
      });

      const foInvoiceChangeBillAdr = await $api.frontOfficeCashier.foInvoiceChangeBillAdr(
        {
          gastpay: billListFOInvoice.tBill['t-bill'][0].gastnr,
          bilRecid: bill['rec-id'],
          userInit: userAuth.userInit,
        }
      );

      if (foInvoiceMView.availMbill === 'true') {
        const bookJournArtMBillMemberBody = {
          resno: foInvoiceMView.mbillResnr,
          billno: foInvoiceMView.mbillRechnr,
        };
        const bookJournArtMBillMember = await $api.frontOfficeCashier.bookJournArtMBillMember(
          bookJournArtMBillMemberBody
        );
        store.commit.focGuestFolio.SET_BOOK_JOURNAL_ART_M_BILL_MEMBER(
          bookJournArtMBillMember
        );
      }
      store.commit.focGuestFolio.SET_ICON_BILL_RECEIVER_ADDRESS(
        '/FOC/shapes/edit.svg'
      );
      store.commit.focGuestFolio.SET_ICON_RESERVATION_REMARK(
        '/FOC/shapes/edit.svg'
      );
      store.commit.focGuestFolio.SET_ICON_SEARCH('/FOC/shapes/search.svg');
      store.commit.focGuestFolio.SET_SELECTED_BILL(bill);
      store.commit.focGuestFolio.SET_BILL_LIST_FO_INVOICE(billListFOInvoice);
      store.commit.focGuestFolio.SET_FO_INVOICE_CHANGE_BILL_ADR(
        foInvoiceChangeBillAdr
      );
      state.isBillSelected = false;
      onSelectTable.value = [];
      state.selectedBill = {};
      store.commit.focGuestFolio.SET_DIALOG_GUEST_FOLIO(false);
    };

    const onClickCancel = () => {
      state.isBillSelected = false;
      onSelectTable.value = [];
      state.selectedBill = {};
      store.commit.focGuestFolio.SET_DIALOG_GUEST_FOLIO(false);
    };

    return {
      ResTableHeaders,
      getDialogGuestFolio,
      getSelectBill,
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
#dialogGuestFolioId {
  .remark {
    max-height: 100px;
  }
}
</style>

<style lang="scss" scoped>
.dialog-card {
  max-width: 1000px;
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
