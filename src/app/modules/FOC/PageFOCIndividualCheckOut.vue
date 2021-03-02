<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <p class="q-mb-xs">Sort By</p>
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

        <div v-if="sortingBy === 1">
          <SInput label-text="Room Number" v-model="roomNumber">
            <template v-slot:append>
              <div class="btn-input-search">
                <q-icon
                  name="mdi-magnify"
                  class="cursor-pointer"
                  color="white"
                  size="16px"
                  @click="onSearch('roomNumber')"
                />
              </div>
              <!-- <q-btn round dense flat icon="mdi-magnify" /> -->
            </template>
          </SInput>
        </div>

        <div v-else-if="sortingBy === 2">
          <SInput label-text="Guest Name" v-model="guestName">
            <template v-slot:append>
              <div class="btn-input-search">
                <q-icon
                  name="mdi-magnify"
                  class="cursor-pointer"
                  color="white"
                  size="16px"
                  @click="onSearch('guestName')"
                />
              </div>
            </template>
          </SInput>
        </div>

        <div v-else>
          <SInput label-text="Group Name" v-model="groupName">
            <template v-slot:append>
              <div class="btn-input-search">
                <q-icon
                  name="mdi-magnify"
                  class="cursor-pointer"
                  color="white"
                  size="16px"
                  @click="onSearch('groupName')"
                />
              </div>
            </template>
          </SInput>
        </div>

        <SRemarkLeftDrawer
          label="Reservation From & Address"
          :value="
            resFromAndAddress.trim().length > 0 ? resFromAndAddress : 'None'
          "
        />
        <SRemarkLeftDrawer
          label="Reservation Remark"
          :value="resRemark.trim().length > 0 ? resRemark : 'None'"
        />
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

      <div class="row">
        <div id="tableLayoutId" class="col-12">
          <STable
            :loading="isFetching"
            :columns="ResTableHeaders"
            :data="table"
            :selected.sync="onSelectTable"
            row-key="indexFoc"
            :class="table.length > 0 && 'selected-table'"
            @row-click="onClickTable"
            :noPagination="true"
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
                      <q-item clickable v-ripple @click="onClickOpenFolio">
                        <q-item-section>Open Folio</q-item-section>
                      </q-item>
                      <q-item clickable v-ripple @click="onClickCheckout">
                        <q-item-section>Checkout</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-td>
            </template>
          </STable>
        </div>
      </div>
    </div>
    <DialogError />
    <DialogAutomaticCheckout />
    <DialogQuickPostingToGuestFolio />
    <DialogQuickPostingToGuestFolioRn />
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
} from '@vue/composition-api';
import { ResTableHeaders } from '~/app/modules/FOC/tables/individualCheckOut.table';
import { ResTableLists } from '~/app/modules/FOC/models/individualCheckout.model';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import { store } from '~/store';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api, $router } }) {
    const router: any = $router;
    const state = reactive({
      isFetching: false,
      table: [],
      selectedTable: {},
      roomNumber: '',
      guestName: '',
      groupName: '',
      resFromAndAddress: '',
      resRemark: '',
      sortingBy: 1,
      sortingByOptions: [
        {
          name: 'Room Number',
          value: 1,
        },
        {
          name: 'Guest Name',
          value: 2,
        },
        {
          name: 'Group Name',
          value: 3,
        },
      ],
    });

    const onSearch = async (filter: string) => {
      let body: any = {
        sorttype: state.sortingBy,
        inputResnr: router.history.current.query.inputResnr || 0,
      };

      switch (true) {
        case filter === 'prepare':
          body.lzinr = ' ';
          body.lname = ' ';
          body.gname = ' ';
          break;

        default:
          body.lzinr = filter === 'roomNumber' ? state.roomNumber : ' ';
          body.lname = filter === 'guestName' ? state.guestName : ' ';
          body.gname = filter === 'groupName' ? state.groupName : ' ';
          break;
      }

      let checkoutSave = await $api.frontOfficeCashier.checkoutSave(body);

      checkoutSave.checkOutList['check-out-list'].map(
        (item: any, index: any) => {
          item.indexFoc = index;
        }
      );

      state.table = checkoutSave.checkOutList['check-out-list'];
      store.commit.focIndividualCheckout.SET_CHECKOUT_SAVE(checkoutSave);
    };

    const onResets = () => {
      state.sortingBy = 1;
      state.roomNumber = '';
      state.guestName = '';
      state.groupName = '';
      state.resFromAndAddress = '';
      state.resRemark = '';
      onSearch('prepare');
    };

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
      state.selectedTable = [row][0];
      state.resFromAndAddress = `${[row][0]['reser-name']} ${
        [row][0]['res-address']
      } ${[row][0]['res-city']}`;
      state.resRemark = [row][0]['bemerk'];
    };

    const onClickOpenFolio = async () => {
      const router: any = $router;
      const selected: any = state.selectedTable;
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: router.history.current.query.inputResnr ? 8 : 5,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
        const arlListFOInvoice = await $api.frontOfficeCashier.arlListFOInvoice(
          {
            recidResline: selected['recid-resline'],
          }
        );

        const readBill1 = await $api.frontOfficeCashier.readBill1({
          caseType: 1,
          billNo: arlListFOInvoice.inpRechnr,
          resNo: 0,
          reslinNo: 0,
          actFlag: 0,
          roomNo: '',
          datum1: '',
          datum2: '',
          saldo1: 0,
          saldo2: 0,
        });

        const billListFOInvoice = await $api.frontOfficeCashier.billListFOInvoice(
          {
            bilFlag: 0,
            bilRecid: readBill1.tBill['t-bill'][0]['bl-recid'],
            room: readBill1.tBill['t-bill'][0].zinr,
            vipflag: false,
            fillCo: true,
            doubleCurrency: false,
            foreignRate: false,
          }
        );

        // start
        const foInvoiceMView = await $api.frontOfficeCashier.foInvoiceMView({
          bilRecid: readBill1.tBill['t-bill'][0]['bl-recid'],
        });

        const foInvoiceChangeBillAdr = await $api.frontOfficeCashier.foInvoiceChangeBillAdr(
          {
            gastpay: billListFOInvoice.tBill['t-bill'][0].gastnr,
            bilRecid: readBill1.tBill['t-bill']['bl-recid'],
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
        store.commit.focGuestFolio.SET_SELECTED_BILL(selected);
        store.commit.focGuestFolio.SET_BILL_LIST_FO_INVOICE(billListFOInvoice);
        store.commit.focGuestFolio.SET_FO_INVOICE_CHANGE_BILL_ADR(
          foInvoiceChangeBillAdr
        );
        store.commit.focIndividualCheckout.SET_READ_BILL_1(readBill1);
        $router.push('/foc/guest-folio');
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'IndividualCheckout',
          title1: 'Message',
          text1: 'Sorry, No Access Right. Access Code 05,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onClickCheckout = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 8,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
        const selected: any = state.selectedTable;
        const checkoutRes = await $api.frontOfficeCashier.checkoutRes({
          pvILanguage: 1,
          caseType: 1,
          resnr: selected.resnr,
          reslinnr: selected.reslinnr,
          silenzio: false,
          userInit: userAuth.userInit,
        });

        if (checkoutRes.coOk === 'false') {
          store.commit.focIndividualCheckout.SET_SELECTED_INDIVIDUAL_CHECKOUT(
            selected
          );
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'IndividualCheckout',
            title1: 'Message',
            text1: checkoutRes.msgStr,
            btnOk: 'Yes',
            btnCancel: 'No',
            status: 'individual-checkout-modal',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        } else {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'IndividualCheckout',
            title1: 'Information',
            text1: checkoutRes.msgStr,
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        }
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'IndividualCheckout',
          title1: 'Message',
          text1: 'Sorry, No Access Right. Access Code 08,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    onMounted(() => {
      onSearch('prepare');
    });

    useExtraMenu(
      router.history.current.query.inputResnr
        ? [
            {
              handler: async () => {
                const getSelectedGroupCheckout: any =
                  store.getters.focIndividualCheckout
                    .GET_SELECTED_GROUP_CHECKOUT;

                const autoCheckoutPrepare = await $api.frontOfficeCashier.autoCheckoutPrepare(
                  { resnr: getSelectedGroupCheckout.resnr }
                );

                store.commit.focIndividualCheckout.SET_AUTO_CHECKOUT_PREPARE(
                  autoCheckoutPrepare
                );
                store.commit.focIndividualCheckout.SET_DIALOG_AUTOMATIC_CHECKOUT(
                  true
                );
              },
              icon: 'FOC/Icon-AutoTransferTransaction',
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
          ]
        : [
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
                      text1:
                        'Local Cash Article not defined! (Param 112 / Grp 5”',
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
                    store.commit.focGuestFolio.SET_GET_READ_ARTICLE(
                      getReadArticle
                    );
                    store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING(
                      true
                    );
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
          ]
    );

    return {
      ResTableHeaders,
      onSearch,
      onResets,
      onSelectTable,
      onClickTable,
      onClickOpenFolio,
      onClickCheckout,
      ...toRefs(state),
    };
  },
  components: {
    DialogError: () =>
      import('~/app/modules/FOC/components/Dialog/Errors/DialogError.vue'),
    DialogAutomaticCheckout: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GroupCheckout/AutomaticCheckout.vue'
      ),
    DialogQuickPostingToGuestFolio: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogQuickPostingToGuestFolio.vue'
      ),
    DialogQuickPostingToGuestFolioRn: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogQuickPostingToGuestFolioRn.vue'
      ),
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

<style lang="scss">
.btn-input-search {
  background: #1485cb;
  margin-right: -12px;
  border-radius: 0 4px 4px 0;
  margin-left: 12px;
  padding-left: 6px;
  padding-right: 6px;
}
</style>

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
