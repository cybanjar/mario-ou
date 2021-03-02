<template>
  <div id="LayoutId">
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

            <q-separator class="q-mt-md q-mb-xl" />

            <SRemarkLeftDrawer
              label="Bill Receiver Address"
              :icon="getIconBillReceiverAddress"
              :onClickIcon="onClickIconBillReceiverAddress"
              :value="getMbOpenBill.resname ? getMbOpenBill.resname : 'None'"
            />
            <SRemarkLeftDrawer
              label="Guest Remark"
              :value="
                getMbOpenBill.rescomment ? getMbOpenBill.rescomment : 'None'
              "
            />

            <q-separator class="q-mt-lg q-mb-md" />

            <SInput
              label-text="Total Folio"
              class="custom-right"
              :value="getMbOpenBill.balance ? getMbOpenBill.balance : ''"
              readonly
            />
          </div>
        </div>
      </div>
    </q-drawer>
    <MasterFolioMenu />
    <slot />
    <DialogMasterFolio />
    <DialogPassword />
    <DialogError />
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
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({});

    // Getters
    const getMbOpenBill: any = computed(() => {
      let res: any = store.getters.focMasterFolio.GET_MB_OPEN_BILL;
      res.balance = res.balance ? formatThousands(res.balance) : '';
      return res;
    });

    // Main Functions
    const openDialogGuestFolio = () => {
      // const getCheckPermission: any =
      //   store.getters.focGuestFolio.GET_CHECK_PERMISSION;
      // if (getCheckPermission.zugriff || getCheckPermission.zugriff === 'true') {
      //   store.commit.focGuestFolio.SET_DIALOG_GUEST_FOLIO(true);
      // } else {
      //   store.commit.focGuestFolio.SET_ERROR_MESSAGE({
      //     from: 'DialogGuestFolio',
      //     title1: 'Information',
      //     text1: 'Sorry, No Access Right. Access Code 08,2',
      //     btnOk: 'OK',
      //   });
      //   store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      // }
      store.commit.focMasterFolio.SET_DIALOG_MASTER_FOLIO(true);
    };

    const getIconBillReceiverAddress = computed(
      () => store.getters.focMasterFolio.GET_ICON_BILL_RECEIVER_ADDRESS
    );

    const onClickIconBillReceiverAddress = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 8,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Information',
          text1: 'Sorry, No Access Right. Access Code 08,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    return {
      getMbOpenBill,
      openDialogGuestFolio,
      getIconBillReceiverAddress,
      onClickIconBillReceiverAddress,
      ...toRefs(state),
    };
  },

  components: {
    MasterFolioMenu: () => import('../Shared/MasterFolioMenu.vue'),
    DialogMasterFolio: () =>
      import(
        '~/app/modules/FOC/components/Dialog/MasterFolio/DialogMasterFolio.vue'
      ),
    DialogError: () =>
      import('~/app/modules/FOC/components/Dialog/Errors/DialogError.vue'),
    DialogPassword: () =>
      import(
        '~/app/modules/FOC/components/Dialog/GuestFolio/DialogPassword.vue'
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
    DialogForeignCurrencyExchangeRate: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogForeignCurrencyExchangeRate.vue'
      ),
  },
});
</script>

<style lang="scss">
#LayoutId {
  .remark {
    max-height: 100px;
  }
}
</style>
