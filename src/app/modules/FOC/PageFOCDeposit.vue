<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <SInput label-text="Reservation Name" v-model="name" />
        <SInput label-text="Reservation Number" v-model="resNumber" />

        <v-date-picker
          v-model="fdate"
          :masks="{ input: ['DD/MM/YYYY'] }"
          :columns="2"
          :popover="{
            visibility: 'click',
          }"
        >
          <template #default="{ inputValue, inputEvents }">
            <SInput
              label-text="Date"
              readonly
              :value="inputValue"
              v-on="inputEvents"
            >
              <template #append>
                <q-icon name="mdi-calendar" />
              </template>
            </SInput>
          </template>
        </v-date-picker>

        <p class="q-mb-xs">Sorting By</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="sortingBy"
          :options="sortingByOptions"
          option-value="value"
          option-label="name"
          map-options
          emit-value
          :dense="true"
        />

        <p class="q-mb-xs">Type Of Transaction</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="typeOfTransaction"
          :options="typeOfTransactionOptions"
          option-value="value"
          option-label="name"
          map-options
          emit-value
          :dense="true"
        />

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-sm q-mb-xl full-width"
          @click="onSearch"
        />

        <SInput label-text="Total Balance" v-model="total" />
        <SInput label-text="Total Deposit Paid" v-model="totalPaid" />
      </div>
    </q-drawer>
    <div class="q-ma-md">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="onResets">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <div id="tableLayoutId">
        <STable
          :loading="isFetching"
          :columns="ResTableHeaders"
          :data="table"
          row-key="indexFoc"
          :noPagination="true"
          :selected.sync="onSelectTable"
          :class="table.length > 0 && 'selected-table'"
          @row-click="onClickTable"
        >
          <template #header-cell-artnr="props">
            <q-th :props="props" class="fixed-col left">
              {{ props.col.label }}
            </q-th>
          </template>

          <template #header-cell-actions="props">
            <q-th :props="props" class="fixed-col right">
              {{ props.col.label }}
            </q-th>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="fixed-col right">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu auto-close anchor="bottom right" self="top right">
                  <q-list>
                    <q-item
                      clickable
                      v-ripple
                      @click="onClickDepositPayment(props.row)"
                    >
                      <q-item-section>Deposit Payment</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="onClickDepositRefund(props.row)"
                    >
                      <q-item-section>Deposit Refund</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="onClickReprintDepositPayment(props.row)"
                    >
                      <q-item-section>Re-print Deposit Payment</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </template>
        </STable>
      </div>
    </div>
    <DialogError />
    <DialogQuickPostingToGuestFolio />
    <DialogQuickPostingToGuestFolioRn />
    <DialogDepositPayment />
    <DialogDepositRefund />
    <DialogMoneyChangePosting />
    <DialogMoneyChangePostingRn />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  computed,
  watch,
} from '@vue/composition-api';
import { ResTableHeaders } from '~/app/modules/FOC/tables/deposit.table';
import { ResTableLists } from '~/app/modules/FOC/models/deposit.model';
import { setupCalendar, DatePicker } from 'v-calendar';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import { store } from '~/store';
import { Cookies } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup(props, { root: { $api, $router } }) {
    const state = reactive({
      isFetching: true,
      table: [],
      name: ' ',
      resNumber: 0,
      fdate: '',
      total: '',
      totalPaid: '',
      sortingBy: 1,
      sortingByOptions: [
        {
          name: 'Reservation Name',
          value: 1,
        },
        {
          name: 'Reservation Number',
          value: 2,
        },
        {
          name: 'Arrival Date',
          value: 3,
        },
        {
          name: 'Due Date',
          value: 4,
        },
      ],
      typeOfTransaction: 1,
      typeOfTransactionOptions: [
        {
          name: 'Deposit Paymant',
          value: 1,
        },
        {
          name: 'Deposit Refund',
          value: 2,
        },
      ],
      depoForeign: '',
      billDate: '',
      depoCurr: '',
      selectedTable: {},
    });

    const userAuth: any = computed(() => {
      return Cookies.get('userAuth');
    });

    onMounted(async () => {
      state.isFetching = false;
      const depositAdminPrepare = await $api.frontOfficeCashier.depositAdminPrepare();
      store.commit.focGuestFolio.SET_DEPOSIT_ADMIN_PREPARE(depositAdminPrepare);
      state.fdate = depositAdminPrepare.fdate;
      state.depoForeign = depositAdminPrepare.depoForeign;
      state.billDate = depositAdminPrepare.billDate;
      state.depoCurr = depositAdminPrepare.depoCurr;
    });

    const onSearch = async () => {
      const depositAdmin1 = await $api.frontOfficeCashier.depositAdmin1({
        'case-type': 1,
        'depo-foreign': state.depoForeign === 'true' ? true : false,
        lname: state.name,
        deposittype: state.typeOfTransaction,
        sorttype: state.sortingBy,
        lresnr: state.resNumber,
        fdate: state.fdate,
        exrate: 1,
        'bill-date': state.billDate,
        'depo-curr': state.depoCurr,
      });
      depositAdmin1.b1Print['b1-print'].map((item: any, index: any) => {
        item.indexFoc = index;
        if (state.depoForeign == 'false') {
          item.balance = item.depositgef - item.depositbez - item.depositbez2;
        }
      });
      state.total = depositAdmin1.b1Print['b1-print'].reduce(
        (a: any, b: any) => a + (b['balance'] || 0),
        0
      );
      const depositPaid = depositAdmin1.b1Print['b1-print'].reduce(
        (a: any, b: any) => a + (b['depositbez'] || 0),
        0
      );
      const deposit2Paid = depositAdmin1.b1Print['b1-print'].reduce(
        (a: any, b: any) => a + (b['depositbez2'] || 0),
        0
      );
      state.totalPaid = depositPaid + deposit2Paid;
      depositAdmin1.depoList['depo-list'].map((item: any, index: any) => {
        item.indexFoc = index;
      });
      store.commit.focGuestFolio.SET_DEPOSIT_ADMIN1(depositAdmin1);
      if (state.depoForeign == 'true') {
        state.table = depositAdmin1.depoList['depo-list'];
      } else {
        state.table = depositAdmin1.b1Print['b1-print'];
      }
    };

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
      state.selectedTable = [row][0];
    };

    const onClickDepositPayment = async (item: any) => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 10,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
        const readResLine = await $api.frontOfficeCashier.readResLine({
          caseType: 78,
          resNo: item.resnr,
          reslinNo: 0,
          resstat: 8,
          actFlag: 1,
          rmNo: '',
          arrive: null,
          depart: null,
          gastNo: 0,
          kontigNo: 0,
          kontcode: '',
        });

        if (readResLine.length > 0) {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'general',
            title1: 'Message',
            text1:
              'Inhouse and/or Checkout guest found for this reservation.  Deposit payment no longer possible.',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        } else if (item.balance === 0) {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'general',
            title1: 'Message',
            text1: 'Deposit Balance = 0, payment not possible',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        } else if (item['rsv-status'] === 3) {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'general',
            title1: 'Message',
            text1: 'Reservation Status = Tentative, payment not possible',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        } else {
          const depositPayPrepare = await $api.frontOfficeCashier.depositPayPrepare(
            {
              pvILanguage: 1,
              inpResnr: item.resnr,
              depositgef: item.balance,
            }
          );
          store.commit.focGuestFolio.SET_DEPOSIT_PAY_PREPARE(depositPayPrepare);
          store.commit.focGuestFolio.SET_DIALOG_DEPOSIT_PAYMENT(true);
        }
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Message',
          text1: 'Sorry, No Access Right. Access Code 10,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };
    const onClickDepositRefund = async (item: any) => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 10,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
        const readResLine = await $api.frontOfficeCashier.readResLine({
          caseType: 78,
          resNo: item.resnr,
          reslinNo: 0,
          resstat: 8,
          actFlag: 1,
          rmNo: '',
          arrive: null,
          depart: null,
          gastNo: 0,
          kontigNo: 0,
          kontcode: '',
        });

        if (readResLine.length > 0) {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'general',
            title1: 'Message',
            text1:
              'Inhouse and/or Checkout guest found for this reservation. Deposit payment no longer possible.',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        } else {
          const depositRefundPrepare = await $api.frontOfficeCashier.depositRefundPrepare(
            {
              resnr: item.resnr,
            }
          );
          store.commit.focGuestFolio.SET_DEPOSIT_REFUND_PREPARE(
            depositRefundPrepare
          );
          store.commit.focGuestFolio.SET_DIALOG_DEPOSIT_REFUND(true);
        }
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Message',
          text1: 'Sorry, No Access Right. Access Code 10,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };
    const onClickReprintDepositPayment = async (item: any) => {
      const getHTParam0 = await $api.frontOfficeCashier.getHTParam0({
        casetype: 4,
        inpParam: 60,
      });
      if (getHTParam0.outputOkFlag == 'true') {
        let depositAdminPrintReceipt1 = await $api.frontOfficeCashier.depositAdminPrintReceipt1(
          {
            resnr: item.resnr,
            printerNr: 1,
          }
        );
        depositAdminPrintReceipt1.resnr = item.resnr;
        store.commit.focGuestFolio.SET_DEPOSIT_ADMIN_PRINT_RECEIPT1(
          depositAdminPrintReceipt1
        );
        $router.push({
          path: '/deposit-payment-receipt',
        });
      }
    };

    const onResets = () => {
      state.name = '';
      state.resNumber = 0;
      state.fdate = '';
      state.total = '';
      state.totalPaid = '';
      state.table = [];
    };

    watch(
      () => store.getters.focGuestFolio.GET_DIALOG_DEPOSIT_PAYMENT,
      async (payload) => {
        if (payload === false) {
          state.isFetching = false;
          const depositAdminPrepare = await $api.frontOfficeCashier.depositAdminPrepare();
          store.commit.focGuestFolio.SET_DEPOSIT_ADMIN_PREPARE(
            depositAdminPrepare
          );
          state.fdate = depositAdminPrepare.fdate;
          state.depoForeign = depositAdminPrepare.depoForeign;
          state.billDate = depositAdminPrepare.billDate;
          state.depoCurr = depositAdminPrepare.depoCurr;
        }
      }
    );

    watch(
      () => store.getters.focGuestFolio.GET_DIALOG_DEPOSIT_REFUND,
      async (payload) => {
        if (payload === false) {
          state.isFetching = false;
          const depositAdminPrepare = await $api.frontOfficeCashier.depositAdminPrepare();
          store.commit.focGuestFolio.SET_DEPOSIT_ADMIN_PREPARE(
            depositAdminPrepare
          );
          state.fdate = depositAdminPrepare.fdate;
          state.depoForeign = depositAdminPrepare.depoForeign;
          state.billDate = depositAdminPrepare.billDate;
          state.depoCurr = depositAdminPrepare.depoCurr;
        }
      }
    );

    useExtraMenu([
      {
        handler: async () => {
          const checkPermission = await $api.frontOfficeCashier.checkPermission(
            {
              userInit: '01',
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
      ResTableHeaders,
      userAuth,
      onSearch,
      onSelectTable,
      onClickTable,
      onClickDepositPayment,
      onClickDepositRefund,
      onClickReprintDepositPayment,
      onResets,
      ...toRefs(state),
    };
  },

  components: {
    'v-date-picker': DatePicker,
    DialogError: () =>
      import('~/app/modules/FOC/components/Dialog/Errors/DialogError.vue'),
    DialogQuickPostingToGuestFolio: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogQuickPostingToGuestFolio.vue'
      ),
    DialogQuickPostingToGuestFolioRn: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogQuickPostingToGuestFolioRn.vue'
      ),
    DialogDepositPayment: () =>
      import('~/app/modules/FOC/components/Dialog/DialogDepositPayment.vue'),
    DialogDepositRefund: () =>
      import('~/app/modules/FOC/components/Dialog/DialogDepositRefund.vue'),
    DialogMoneyChangePosting: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogMoneyChangePosting.vue'
      ),
    DialogMoneyChangePostingRn: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogMoneyChangePostingRn.vue'
      ),
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
  max-height: 450px !important;
  overflow: scroll;
}
</style>
