<template>
  <div>
    <MasterFolioLayout>
      <div class="q-ma-md">
        <div class="row">
          <div class="col-3 q-pr-md">
            <div>
              <div class="row">
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
                <SInput label-text="Amount" />

                <q-btn
                  block
                  color="primary"
                  max-height="28"
                  label="Add"
                  class="q-mt-xl full-width"
                  @click="onClickAdd"
                />
              </q-form>
            </div>
          </div>
          <div class="col-9">
            <section>
              <div id="tableLayoutId">
                <STable
                  v-if="getMbOpenBill.tBillLine"
                  :loading="isFetching"
                  :columns="ResTableHeaders"
                  :data="getMbOpenBill.tBillLine['t-bill-line']"
                  :selected.sync="onSelectTable"
                  row-key="indexFoc"
                  :class="
                    getMbOpenBill.tBillLine['t-bill-line'].length > 0 &&
                    'selected-table'
                  "
                  @row-click="onClickTable"
                  :noPagination="true"
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
                              <q-item-section>Void Item</q-item-section>
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
    </MasterFolioLayout>
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
import { ResTableLists } from '~/app/modules/FOC/models/MasterFolio/masterFolio.model';
import { ResTableHeaders } from '~/app/modules/FOC/tables/MasterFolio/masterFolio.table';
import { store } from '~/store';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      foInvoicePrepare: {},
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
    });

    // Services
    const formatDate = (dateInput) => date.formatDate(dateInput, 'DD/MM/YYYY');

    // Getters
    const getMbOpenBill: any = computed(() => {
      let res: any = store.getters.focMasterFolio.GET_MB_OPEN_BILL;
      if (res.tBillLine) {
        res.tBillLine['t-bill-line'].map((item, index) => {
          item.indexFoc = index;
          item.epreis = formatThousands(item.epreis);
          item.betrag = formatThousands(item.betrag);
          item['bill-datum'] = formatDate(item['bill-datum']);
          item.sysdate = formatDate(item.sysdate);
        });
      }
      return res;
    });

    // Main Functions
    const onLoad = async () => {
      const mbMainLogic = await $api.frontOfficeCashier.mbMainLogic({
        bilFlag: 1,
        currDepartment: 0,
      });

      const getHTParam0 = await $api.frontOfficeCashier.getHTParam0({
        casetype: 2,
        inpParam: 110,
      });

      const loadHotelDepartment = await $api.frontOfficeCashier.loadHotelDepartment();

      const selectBill2 = await $api.frontOfficeCashier.selectBill2({
        caseType: 1,
        resnr: 0,
        bilFlag: 1,
        masterFlag: false,
        sorttype: 1,
        gastname: '*',
        currGastnr: 0,
        billType: 2,
        ciDate: formatDate(getHTParam0.fdate),
      });

      state.fDate = formatDate(getHTParam0.fdate);
      state.hotels = loadHotelDepartment;
      store.commit.focMasterFolio.SET_MB_MAIN_LOGIC(mbMainLogic);
      store.commit.focMasterFolio.SET_GET_HT_PARAM_0(getHTParam0);
      store.commit.focMasterFolio.SET_LOAD_HOTEL_DEPARTMENT(
        loadHotelDepartment
      );
      store.commit.focMasterFolio.SET_SELECT_BILL_2(
        selectBill2.b1List['b1-list']
      );
    };

    watch(
      () => state.hotel,
      (payload) => {
        let res: any = store.getters.focMasterFolio.GET_MB_MAIN_LOGIC;
        if (res.artlist) {
          switch (true) {
            case state.articleType === 'Sales':
              const sales = res.artlist.artlist.filter(
                (x) =>
                  (x.artart === 0 || x.artart === 8 || x.artart === 9) &&
                  x.activeflag &&
                  x.departement === payload
              );

              state.articles = sales || [];
              break;

            default:
              const payment = res.artlist.artlist.filter(
                (x) =>
                  (x.artart === 2 || x.artart === 6 || x.artart === 7) &&
                  x.activeflag &&
                  x.departement === payload
              );

              state.articles = payment || [];
              break;
          }
        }
      }
    );

    watch(
      () => state.articleType,
      (payload) => {
        let res: any = store.getters.focMasterFolio.GET_MB_MAIN_LOGIC;
        if (res.artlist) {
          switch (true) {
            case payload === 'Sales':
              const sales = res.artlist.artlist.filter(
                (x) =>
                  (x.artart === 0 || x.artart === 8 || x.artart === 9) &&
                  x.activeflag &&
                  x.departement === state.hotel
              );

              state.articles = sales || [];
              break;

            default:
              const payment = res.artlist.artlist.filter(
                (x) =>
                  (x.artart === 2 || x.artart === 6 || x.artart === 7) &&
                  x.activeflag &&
                  x.departement === state.hotel
              );

              state.articles = payment || [];
              break;
          }
        }
      }
    );

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
    };

    const onClickAdd = () => {
      console.log('article', state.article);
    };

    const onClickBackDate = async () => {};

    onMounted(() => {
      onLoad();
    });

    return {
      // Services
      ResTableHeaders,
      formatDate,
      // Getters
      getMbOpenBill,
      // Main Functions
      onLoad,
      onSelectTable,
      onClickTable,
      onClickAdd,
      onClickBackDate,
      ...toRefs(state),
    };
  },
  components: {
    MasterFolioLayout: () =>
      import('~/app/modules/FOC/components/Layout/MasterFolioLayout.vue'),
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
