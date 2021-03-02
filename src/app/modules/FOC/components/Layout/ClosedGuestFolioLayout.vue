<template>
  <div id="GuestFolioLayoutId">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="mt-7">
        <div class="q-pa-md">
          <div>
            <q-btn
              block
              color="primary"
              max-height="28"
              icon="mdi-magnify"
              label="Select Folio"
              class="q-mb-md full-width"
              @click="openDialogGuestFolio()"
            />

            <q-separator class="q-my-md" />

            <SInput
              label-text="Room Number"
              v-model="getSelectedBill.zinr"
              readonly
            />
            <SInput
              label-text="Guest Name"
              v-model="getSelectedBill.resname"
              readonly
            />
            <SRemarkLeftDrawer
              label="Bill Receiver Address"
              :icon="getIconBillReceiverAddress"
              :onClickIcon="onClickIconBillReceiverAddress"
              :value="
                getFoInvoiceChangeBillAdr.resname
                  ? getFoInvoiceChangeBillAdr.resname
                  : getBillListFoInvoice.name
                  ? getBillListFoInvoice.name
                  : 'None'
              "
            />
            <SRemarkLeftDrawer
              label="Reservation Remark"
              :icon="getIconReservationRemark"
              :onClickIcon="onClickIconReservationRemark"
              :value="
                getBillListFoInvoice.rescomment
                  ? getBillListFoInvoice.rescomment
                  : 'None'
              "
            />
            <SInput
              label-text="Active Folio Total"
              v-model="getBillListFoInvoice.balance"
              readonly
            />
            <SInput
              label-text="All Folio Total"
              v-model="getBillListFoInvoice.totBalance"
              readonly
            />
          </div>
        </div>
      </div>
    </q-drawer>
    <ClosedGuestFolioMenu />
    <slot />
    <DialogGuestFolio />
    <DialogCheckOut />
    <DialogTransferTransaction />
    <DialogAutoTransfer />
    <DialogTransferHistory />
    <DialogCreditCard />
    <DialogMasterFolioMember />
    <DialogBackDate />
    <DialogMasterBill />
    <DialogCreateMasterBill />
    <DialogPassword />
    <DialogError />
    <DialogRemark />
    <DialogQuickPostingToGuestFolio />
    <DialogQuickPostingToGuestFolioRn />
    <DialogMoneyChangePosting />
    <DialogMoneyChangePostingRn />
    <DialogForeignCurrencyExchangeRate />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { store } from '~/store';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { date } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({});

    const openDialogGuestFolio = () => {
      const getCheckPermission: any =
        store.getters.focGuestFolio.GET_CHECK_PERMISSION;
      if (getCheckPermission.zugriff || getCheckPermission.zugriff === 'true') {
        store.commit.focGuestFolio.SET_DIALOG_GUEST_FOLIO(true);
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'DialogGuestFolio',
          title1: 'Information',
          text1: 'Sorry, No Access Right. Access Code 08,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const getSelectedBill: any = computed(() => {
      return store.getters.focGuestFolio.GET_SELECTED_BILL;
    });

    const getFoInvoiceChangeBillAdr: any = computed(() => {
      return store.getters.focGuestFolio.GET_FO_INVOICE_CHANGE_BILL_ADR;
    });

    const getBillListFoInvoice = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_BILL_LIST_FO_INVOICE;
      res.balance = res.balance ? formatThousands(res.balance) : '';
      res.totBalance = res.totBalance ? formatThousands(res.totBalance) : '';
      return res;
    });

    const getIconBillReceiverAddress = computed(
      () => store.getters.focGuestFolio.GET_ICON_BILL_RECEIVER_ADDRESS
    );

    const getIconReservationRemark = computed(
      () => store.getters.focGuestFolio.GET_ICON_RESERVATION_REMARK
    );

    const onClickIconBillReceiverAddress = async () => {
      const selectedBill: any = store.getters.focGuestFolio.GET_SELECTED_BILL;
      const foInvoiceChangeCommentPrepare = await $api.frontOfficeCashier.foInvoiceChangeCommentPrepare(
        {
          billRecid: selectedBill['rec-id'],
        }
      );

      store.commit.focGuestFolio.SET_FO_INVOICE_CHANGE_COMMENT_PREPARE(
        foInvoiceChangeCommentPrepare
      );
      store.commit.focGuestFolio.SET_DIALOG_REMARK(true);
    };

    const onClickIconReservationRemark = async () => {
      const selectedBill: any = store.getters.focGuestFolio.GET_SELECTED_BILL;
      const foInvoiceChangeCommentPrepare = await $api.frontOfficeCashier.foInvoiceChangeCommentPrepare(
        {
          billRecid: selectedBill['rec-id'],
        }
      );

      store.commit.focGuestFolio.SET_FO_INVOICE_CHANGE_COMMENT_PREPARE(
        foInvoiceChangeCommentPrepare
      );
      store.commit.focGuestFolio.SET_DIALOG_REMARK(true);
    };

    return {
      openDialogGuestFolio,
      getSelectedBill,
      getFoInvoiceChangeBillAdr,
      getBillListFoInvoice,
      getIconBillReceiverAddress,
      getIconReservationRemark,
      onClickIconBillReceiverAddress,
      onClickIconReservationRemark,
      ...toRefs(state),
    };
  },

  components: {
    ClosedGuestFolioMenu: () =>
      import('~/app/modules/FOC/components/Shared/ClosedGuestFolioMenu.vue'),
    DialogGuestFolio: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogGuestFolio.vue'
      ),
    DialogCheckOut: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogCheckOut.vue'
      ),
    DialogTransferTransaction: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogTransferTransaction.vue'
      ),
    DialogAutoTransfer: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogAutoTransfer.vue'
      ),
    DialogTransferHistory: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogTransferHistory.vue'
      ),
    DialogCreditCard: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogCreditCard.vue'
      ),
    DialogMasterFolioMember: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogMasterFolioMember.vue'
      ),
    DialogBackDate: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogBackDate.vue'
      ),
    DialogMasterBill: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogMasterBill.vue'
      ),
    DialogCreateMasterBill: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogCreateMasterBill.vue'
      ),
    DialogPassword: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogPassword.vue'
      ),
    DialogError: () =>
      import('~/app/modules/FOC/components/Dialog/Errors/DialogError.vue'),
    DialogRemark: () =>
      import('~/app/modules/FOC/components/Dialog/GuestFolio/DialogRemark.vue'),
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
    DialogForeignCurrencyExchangeRate: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogForeignCurrencyExchangeRate.vue'
      ),
  },
});
</script>

<style lang="scss">
#GuestFolioLayoutId {
  .remark {
    max-height: 100px;
  }
}
</style>

<style lang="scss" scoped></style>
