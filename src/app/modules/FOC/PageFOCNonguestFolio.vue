<template>
  <div>
    <NonGuestFolioLayout>
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
                      :options="getNsMainLogic"
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
                  v-if="getNsOpenBill.tBillLine"
                  :loading="isFetching"
                  :columns="ResTableHeaders"
                  :data="getNsOpenBill.tBillLine['t-bill-line']"
                  :selected.sync="onSelectTable"
                  row-key="indexFoc"
                  :class="
                    getNsOpenBill.tBillLine['t-bill-line'].length > 0 &&
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
    </NonGuestFolioLayout>
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
import { ResTableLists } from './models/NonGuestFolio/nonguestFolio.model';
import { ResTableHeaders } from './tables/NonGuestFolio/nonguestFolio.table';
import { store } from '~/store';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      foInvoicePrepare: {},
      articleType: 'Sales',
      articles: [],
      article: null,
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
    const getNsMainLogic = computed(() => {
      let res: any = store.getters.focNonguestFolio.GET_NS_MAIN_LOGIC;
      if (res.artlist) {
        switch (true) {
          case state.articleType === 'Sales':
            res.artlist.artlist.filter(
              (x) =>
                x.artart === 0 ||
                x.artart === 8 ||
                (x.artart === 9 && x.activeflag)
            );
            break;

          default:
            res.artlist.artlist.filter(
              (x) =>
                x.artart === 2 ||
                x.artart === 6 ||
                (x.artart === 7 && x.activeflag)
            );
            break;
        }
      }
      return res.artlist?.artlist || [];
    });

    const getNsOpenBill: any = computed(() => {
      const res: any = store.getters.focNonguestFolio.GET_NS_OPEN_BILL;

      res.tBillLine?.['t-bill-line'].map((item, index) => {
        item.indexFoc = index;
      });
      return res;
    });

    // Main Functions
    const onLoad = async () => {
      const getHTParam0 = await $api.frontOfficeCashier.getHTParam0({
        casetype: 4,
        inpParam: 900,
      });

      const loadHotelDepartment = await $api.frontOfficeCashier.loadHotelDepartment();

      const getFDate: any = await $api.frontOfficeCashier.getHTParam0({
        casetype: 2,
        inpParam: 110,
      });

      state.fDate = formatDate(getFDate.fdate);
      store.commit.focNonguestFolio.SET_GET_HT_PARAM_0(getHTParam0);
      store.commit.focNonguestFolio.SET_LOAD_HOTEL_DEPARTMENT(
        loadHotelDepartment
      );
    };

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
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

    const onClickAdd = () => {
      console.log('article', state.article);
    };

    const onClickBackDate = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 15,
        expectedNr: 1,
      });

      if (checkPermission.zugriff === 'true') {
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'back-date-nonguest',
          title1: 'Information',
          text1: 'Sorry, No Access Right. Access Code 15,1',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    onMounted(() => {
      onLoad();
    });

    useExtraMenu([
      {
        handler: async () => {
          const userAuth: any = Cookies.get('userAuth');
          const checkPermission = await $api.frontOfficeCashier.checkPermission(
            {
              userInit: userAuth.userInit,
              arrayNr: 8,
              expectedNr: 2,
            }
          );

          if (checkPermission.zugriff === 'true') {
            const quickPostPrepare = await $api.frontOfficeCashier.quickPostPrepare();
            const loadHotelDepartment = await $api.frontOfficeCashier.loadHotelDepartment();

            store.commit.focGuestFolio.SET_QUICK_POSTING_PREPARE(
              quickPostPrepare
            );
            store.commit.focGuestFolio.SET_LOAD_HOTEL_DEPARTMENT(
              loadHotelDepartment
            );
            store.commit.focGuestFolio.SET_DIALOG_QPTGF(true);
          } else {
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'QuickPostingToGuestFolio',
              title1: 'Information',
              text1: 'Sorry, No Access Right. Access Code 08,2',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          }
        },
        icon: 'FOC/Icon-QuickPostingToGuestFolio2',
      },
      {
        handler: async () => {
          const userAuth: any = Cookies.get('userAuth');
          const checkPermission = await $api.frontOfficeCashier.checkPermission(
            {
              userInit: userAuth.userInit,
              arrayNr: 8,
              expectedNr: 2,
            }
          );

          if (checkPermission.zugriff === 'true') {
            const moneyExchgPrepare = await $api.frontOfficeCashier.moneyExchgPrepare();
            const getReadArticle = await $api.frontOfficeCashier.getReadArticle(
              {
                artNo: 43,
                dept: 0,
                aName: ' ',
              }
            );
            if (moneyExchgPrepare.errCode === 1) {
              store.commit.focGuestFolio.SET_ERROR_MESSAGE({
                from: 'General',
                title1: 'Information',
                text1: 'Local Cash Article not defined! (Param 112 / Grp 5”',
                btnOk: 'OK',
              });
              store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            } else if (moneyExchgPrepare.errCode === 2) {
              store.commit.focGuestFolio.SET_ERROR_MESSAGE({
                from: 'General',
                title1: 'Information',
                text1: 'Local Currency not defined (Param 152/7)',
                btnOk: 'OK',
              });
              store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            } else {
              store.commit.focGuestFolio.SET_MONEY_EXCHG_PREPARE(
                moneyExchgPrepare
              );
              store.commit.focGuestFolio.SET_GET_READ_ARTICLE(getReadArticle);
              store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING(true);
            }
          } else {
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'QuickPostingToGuestFolio',
              title1: 'Information',
              text1: 'Sorry, No Access Right. Access Code 08,2',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          }
        },
        icon: 'FOC/Icon-MoneyChangePosting',
      },
    ]);

    return {
      // Services
      ResTableHeaders,
      formatDate,
      // Getters
      getNsMainLogic,
      getNsOpenBill,
      // Main Functions
      onLoad,
      onSelectTable,
      onClickTable,
      onClickVoidItem,
      onClickAdd,
      onClickBackDate,
      ...toRefs(state),
    };
  },
  components: {
    NonGuestFolioLayout: () =>
      import('./components/Layout/NonGuestFolioLayout.vue'),
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
