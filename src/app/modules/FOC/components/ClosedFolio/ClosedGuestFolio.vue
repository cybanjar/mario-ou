<template>
  <div>
    <ClosedGuestFolioLayout>
      <div class="q-ma-md">
        <div class="row">
          <div class="col-3 q-pr-md">
            <div>
              <div class="row">
                <div class="col-5">
                  <p>Departure Date <span class="float-right">:</span></p>
                </div>
                <div class="col-7">
                  <strong class="q-ml-sm">{{ depatureDate }}</strong>
                </div>
                <div class="col-5">
                  <p>Bill Date <span class="float-right">:</span></p>
                </div>
                <div class="col-7">
                  <p class="q-ml-sm">
                    <strong>{{ fDate }}</strong>
                    <span class="back-date" @click="onClickBackDate">
                      Back Date</span
                    >
                  </p>
                </div>
              </div>
              <q-form>
                <div class="col-8">
                  <p class="q-mb-xs">Outlet</p>
                  <SSelect
                    outlined
                    class="q-mb-md"
                    option-value="num"
                    option-label="depart"
                    map-options
                    emit-value
                    v-model="hotel"
                    :options="hotels"
                    :dense="true"
                  />
                </div>

                <div>
                  <p class="q-mb-xs">Article</p>
                  <q-btn-toggle
                    class="q-mb-md"
                    spread
                    no-caps
                    toggle-color="primary"
                    color="white"
                    text-color="black"
                    v-model="articleType"
                    :options="[
                      { label: 'Sales', value: 'Sales' },
                      { label: 'Payment', value: 'Payment' },
                    ]"
                  />
                </div>

                <div class="row">
                  <div class="col-8">
                    <p class="q-mb-xs">Article Name</p>
                    <SSelect
                      outlined
                      class="q-mb-md"
                      option-value="artnr"
                      option-label="bezeich"
                      map-options
                      emit-value
                      v-model="article"
                      :options="articles"
                      :dense="true"
                    />
                  </div>
                  <div class="col-4 q-pl-sm">
                    <SInput label-text="Quantity" mask="##" unmasked-value />
                  </div>
                </div>

                <SInput label-text="Voucher Number" />

                <SInput label-text="Description" readonly />

                <SInput label-text="Unit Price" />

                <q-btn
                  block
                  color="primary"
                  max-height="28"
                  label="Add"
                  class="q-mb-md full-width"
                  @click="onClickAdd"
                />
              </q-form>
            </div>
          </div>
          <div class="col-9">
            <section>
              <div class="row">
                <div class="col-3 q-pr-sm">
                  <SInput
                    label-text="Folio Number"
                    v-model="getBillListFoInvoice.rechnr"
                    disable
                  />
                </div>

                <div class="col-3 q-px-sm" v-show="isNumberOfFolios">
                  <p class="q-mb-xs">Number Of Folio</p>
                  <q-option-group
                    type="radio"
                    size="xs"
                    v-model="numberOfFolio"
                    :options="numberOfFolios"
                    @input="onChangeNumberOfFolio(numberOfFolio)"
                    inline
                    dense
                  />
                </div>

                <div class="col-3 q-px-sm">
                  <SInput
                    label-text="Master Folio"
                    :icon="getIconSearch"
                    :onClickIcon="onSearchMasterFolio"
                    v-model="getBillListFoInvoice.masterRechnr"
                    disable
                  />
                </div>

                <div class="col-3 q-pl-sm">
                  <SInput label-text="Room Rate" v-model="rmrate" disable />
                </div>
              </div>
              <div id="tableLayoutId">
                <STable
                  v-if="getBillListFoInvoice.tBillLine"
                  :loading="isFetching"
                  :columns="ResTableHeaders"
                  :data="getBillListFoInvoice.tBillLine['t-bill-line']"
                  :selected.sync="onSelectTable"
                  row-key="indexFoc"
                  :class="
                    getBillListFoInvoice.tBillLine['t-bill-line'].length > 0 &&
                    'selected-table'
                  "
                  @row-click="onClickTable"
                  :no-pagination="true"
                >
                  <template #header-cell-artnr="props">
                    <q-th :props="props" class="fixed-col left">
                      {{ props.col.label }}
                    </q-th>
                  </template>

                  <template #body-cell-artnr="props">
                    <q-td :props="props" class="fixed-col left">
                      {{ props.row.artnr }}
                    </q-td>
                  </template>

                  <template #header-cell-actions="props">
                    <q-th :props="props" class="fixed-col right">
                      {{ props.col.label }}
                    </q-th>
                  </template>

                  <template #body-cell-actions="props">
                    <q-td :props="props" class="fixed-col right">
                      <q-icon name="mdi-dots-vertical" size="16px">
                        <q-menu
                          auto-close
                          anchor="bottom right"
                          self="top right"
                        >
                          <q-list>
                            <q-item clickable v-ripple>
                              <q-item-section>Split Item</q-item-section>
                            </q-item>
                          </q-list>
                          <q-list>
                            <q-item clickable v-ripple>
                              <q-item-section @click="onClickVoidItem"
                                >Void Item</q-item-section
                              >
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-icon>
                    </q-td>
                  </template>
                </STable>
                <STable
                  v-else
                  :loading="isFetching"
                  :columns="ResTableHeaders"
                  :data="[]"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </ClosedGuestFolioLayout>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  computed,
  watch,
  ref,
} from '@vue/composition-api';
import { date } from 'quasar';
import { ResTableLists } from '../../models/GuestFolio/guestFolio.model';
import { ResTableHeaders } from '../../tables/GuestFolio/guestFolio.table';
import { store } from '~/store';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      foInvoicePrepare: {} as any,
      articleType: 'Sales',
      articles: [],
      article: null,
      hotels: [],
      hotel: null,
      depatureDate: '',
      fDate: '',
      rmrate: null,
      isNumberOfFolios: false,
      numberOfFolios: [],
      numberOfFolio: 0,
      erland: 0,
    });

    const onLoad = async () => {
      const foInvoicePrepare = await $api.frontOfficeCashier.foInvoicePrepare({
        bilFlag: 1,
      });
      state.foInvoicePrepare = foInvoicePrepare;
      state.articles = foInvoicePrepare.tArtikel['t-artikel'].filter(
        (item) =>
          item.artart === 0 ||
          item.artart === 8 ||
          item.artart === 9 ||
          (state.hotel && item.activeflag)
      );
      store.commit.focGuestFolio.SET_FO_INVOICE_PREPARE(foInvoicePrepare);

      const loadHotelDepartment = await $api.frontOfficeCashier.loadHotelDepartment();
      state.hotels = loadHotelDepartment;
      store.commit.focGuestFolio.SET_LOAD_HOTEL_DEPARTMENT(loadHotelDepartment);

      const getHTParam0 = await $api.frontOfficeCashier.getHTParam0();
      const formatDate = (dateInput) =>
        date.formatDate(dateInput, 'DD/MM/YYYY');
      state.fDate = formatDate(getHTParam0.fdate);
      store.commit.focGuestFolio.SET_GET_HT_Param_0(getHTParam0);

      const checkPermission = await $api.frontOfficeCashier.checkPermission();
      store.commit.focGuestFolio.SET_CHECK_PERMISSION(checkPermission);

      const selectBill = await $api.frontOfficeCashier.selectBill();
      store.commit.focGuestFolio.SET_SELECT_BILL(selectBill);
    };

    onMounted(() => {
      onLoad();
    });

    const getBillListFoInvoice = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_BILL_LIST_FO_INVOICE;
      if (res.tBillLine) {
        const formatDate = (dateInput) =>
          date.formatDate(dateInput, 'DD/MM/YYYY');
        res.tBillLine['t-bill-line'].map((e) => {
          e.sysdate = formatDate(e.sysdate);
          e['bill-datum'] = formatDate(e['bill-datum']);
          e.epreis = formatThousands(e.epreis);
          e.fremdwbetrag = formatThousands(e.fremdwbetrag);
          e.betrag = formatThousands(e.betrag);
        });

        if (res.billAnzahl === 4) {
          state.numberOfFolios = [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
          ];
        } else if (res.billAnzahl === 3) {
          state.numberOfFolios = [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
          ];
        } else if (res.billAnzahl === 2) {
          state.numberOfFolios = [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
          ];
        } else if (res.billAnzahl === 1) {
          state.numberOfFolios = [{ value: 1, label: '1' }];
        } else {
          state.numberOfFolios = [];
        }
        state.depatureDate = formatDate(res.abreise);
        state.rmrate = formatThousands(res.rmrate);
        state.isNumberOfFolios = true;
        state.erland = res.tBill['t-bill'][0].billnr;
      }
      return res;
    });

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
    };

    const getIconSearch = computed(
      () => store.getters.focGuestFolio.GET_ICON_SEARCH
    );

    watch(
      () => state.articleType,
      (payload) => {
        let filteredArticles: any;
        if (payload === 'Sales' || payload === 'onMounted') {
          filteredArticles = [
            ...state.foInvoicePrepare.tArtikel['t-artikel'],
          ].filter(
            (item) =>
              item.artart === 0 ||
              item.artart === 8 ||
              item.artart === 9 ||
              (state.hotel && item.activeflag)
          );
        } else {
          filteredArticles = [
            ...state.foInvoicePrepare.tArtikel['t-artikel'],
          ].filter(
            (item) =>
              item.artart === 2 ||
              item.artart === 6 ||
              (item.artart === 7 && item.activeflag)
          );
        }
        state.articles = filteredArticles;
      }
    );

    watch(
      () => state.erland,
      (payload) => {
        state.numberOfFolio = payload;
      }
    );

    const onChangeNumberOfFolio = async (folio: any) => {
      const getSelectedBill: any =
        store.getters.focGuestFolio.GET_SELECTED_BILL;
      const foInvoiceChangeBillnr1 = await $api.frontOfficeCashier.foInvoiceChangeBillnr1(
        {
          bilRecid: getSelectedBill['rec-id'],
          currBillnr: folio,
        }
      );
      const billListFOInvoice = await $api.frontOfficeCashier.billListFOInvoice(
        {
          bilFlag: 0,
          bilRecid: foInvoiceChangeBillnr1.bilRecid,
        }
      );

      const foInvoiceChangeBillnr2 = await $api.frontOfficeCashier.foInvoiceChangeBillnr2(
        {
          billGastnr: billListFOInvoice.tBill['t-bill'][0]['gastnr'],
        }
      );

      const foInvoiceChangeBillnr3 = await $api.frontOfficeCashier.foInvoiceChangeBillnr3(
        {
          billGastnr: billListFOInvoice.tBill['t-bill'][0]['gastnr'],
        }
      );

      switch (true) {
        case billListFOInvoice.balance >= foInvoiceChangeBillnr3.kreditlimit:
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'DialogNewFolio',
            title1: 'Message',
            text1: `Transaction goes over creditlimit of ${foInvoiceChangeBillnr3.kreditlimit}`,
            btnOk: 'Ok',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          break;

        case billListFOInvoice.dispWarning === 'true':
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'DialogNewFolio',
            title1: 'Message',
            text1: `CASH BASIS Billing Instruction: ${billListFOInvoice.queasyChar1}`,
            btnOk: 'Ok',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          break;

        case billListFOInvoice.flagReport === 'true':
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'DialogNewFolio',
            title1: 'Message',
            text1: `maka Munculkan UI (modal) untuk Flag Report yang dimaksud, Penjelasan detail ada di Comment yang berbeda.`,
            btnOk: 'Ok',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          break;

        default:
          break;
      }

      store.commit.focGuestFolio.SET_BILL_LIST_FO_INVOICE(billListFOInvoice);
    };

    const onSearchMasterFolio = async () => {
      if (getBillListFoInvoice.value.masterRechnr === '') {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'DialogNewFolio',
          title1: 'Question',
          text1: `Do you want to create the Master Folio`,
          btnOk: 'Yes',
          btnCancel: 'No',
          status: 'create-master-folio',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      } else {
        const foInvoiceMasterBill = await $api.frontOfficeCashier.foInvoiceMasterBill(
          {
            caseType: 1,
            billResnr: getBillListFoInvoice.value.tBill['t-bill'][0].resnr,
            billReslinnr:
              getBillListFoInvoice.value.tBill['t-bill'][0].reslinnr,
          }
        );

        store.commit.focGuestFolio.SET_FO_INVOICE_MASTER_BILL(
          foInvoiceMasterBill
        );

        const readMasterBill = await $api.frontOfficeCashier.readMasterBill({
          caseType: 1,
          resNo: foInvoiceMasterBill.mbillResnr,
          gastNo: foInvoiceMasterBill.mbillGastnr,
        });

        store.commit.focGuestFolio.SET_READ_MASTER_BILL(readMasterBill);

        const readGuest = await $api.frontOfficeCashier.readGuest({
          caseType: 1,
          gastNo: readMasterBill.tMaster['t-master'][0].gastnrpay,
          gname: ' ',
          fname: ' ',
        });

        store.commit.focGuestFolio.SET_READ_GUEST(readGuest);
        store.commit.focGuestFolio.SET_DIALOG_MASTER_BILL(true);
      }
    };

    const onClickVoidItem = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 67,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'void-item-option',
          title1: 'Information',
          text1: 'Sorry, No Access Right. Access Code 67,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onClickAdd = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 38,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'ClosedFolio',
          title1: 'Information',
          text1: 'Sorry, No Access Right. Access Code 38,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onClickBackDate = async () => {
      const userAuth: any = Cookies.get('userAuth');
      if (store.getters.focGuestFolio.GET_BIL_FLAG === 0) {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'BackDate',
          title1: 'Information',
          text1: 'Back Date for closed Folio Only.',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      } else if (store.getters.focGuestFolio.GET_BIL_FLAG === 1) {
        const checkPermissionBody = {
          arrayNr: 15,
          expectedNr: 1,
          userInit: userAuth.userInit,
        };
        const checkPermission = await $api.frontOfficeCashier.checkPermission(
          checkPermissionBody
        );
        if (checkPermission.zugriff === 'true') {
          const getHTParam0Body = {
            casetype: 1,
            inpParam: 219,
          };
          const getHTParam0 = await $api.frontOfficeCashier.getHTParam0(
            getHTParam0Body
          );
          if (getHTParam0.flogical === 'true') {
            store.commit.focGuestFolio.SET_DIALOG_BACK_DATE(true);
          } else {
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'BackDate',
              title1: 'Information',
              text1: 'Back date not possible, param 219',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          }
        } else {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'BackDate',
            title1: 'Information',
            text1: 'Sorry, No Access Right. Access Code 15,1',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        }
      }
    };

    return {
      ResTableHeaders,
      onLoad,
      getBillListFoInvoice,
      onSelectTable,
      onClickTable,
      getIconSearch,
      onChangeNumberOfFolio,
      onSearchMasterFolio,
      onClickVoidItem,
      onClickAdd,
      onClickBackDate,
      ...toRefs(state),
    };
  },
  components: {
    ClosedGuestFolioLayout: () =>
      import('../Layout/ClosedGuestFolioLayout.vue'),
  },
});
</script>

<style lang="scss" scoped>
#tableLayoutId {
  .selected-table {
    tbody tr.selected td {
      background: #1485cb !important;
      color: #fff;
    }
  }
  max-height: 550px !important;
  overflow: scroll;
}
.back-date {
  cursor: pointer;
  color: #1485cb;
  text-decoration: underline;
}
</style>
