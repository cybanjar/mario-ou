<template>
  <div id="GuestFolioLayoutId">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="mt-7">
        <div class="q-pa-md">
          <div>
            <p class="q-mb-xs">Select Outlet</p>
            <SSelect
              outlined
              class="q-mb-md"
              option-value="num"
              option-label="depart"
              map-options
              emit-value
              v-model="hotel"
              :options="getLoadHotelDepartment"
              :dense="true"
            />

            <q-btn
              block
              color="primary"
              max-height="28"
              icon="mdi-magnify"
              label="Select Folio"
              class="q-mb-md full-width"
              @click="openDialogNonguestFolio()"
              :disable="hotel !== '-- Please Select --' ? false : true"
            />

            <q-separator class="q-mt-md q-mb-xl" />

            <SRemarkLeftDrawer
              label="Bill Receiver Address"
              :icon="getIconBillReceiverAddress"
              :onClickIcon="onClickIconBillReceiverAddress"
              :value="getNsOpenBill.resname || 'None'"
            />

            <SRemarkLeftDrawer
              label="Folio Remark"
              :icon="getIconReservationRemark"
              :onClickIcon="onClickIconReservationRemark"
              :value="getNsOpenBill.rescomment || 'None'"
            />

            <SInput
              label-text="Total Folio"
              class="q-mt-xl"
              :value="
                getNsOpenBill.balance
                  ? formatThousands(getNsOpenBill.balance)
                  : ''
              "
              readonly
            />
          </div>
        </div>
      </div>
    </q-drawer>
    <NonguestFolioMenu />
    <slot />
    <DialogNonguestFolio />
    <DialogTransferHistory />
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
  watch,
} from '@vue/composition-api';
import { store } from '~/store';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { date } from 'quasar';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      hotel: '-- Please Select --',
    });

    // Getters
    const getLoadHotelDepartment: any = computed(() => {
      return store.getters.focNonguestFolio.GET_LOAD_HOTEL_DEPARTMENT;
    });

    const getSelectedBill: any = computed(() => {
      return store.getters.focGuestFolio.GET_SELECTED_BILL;
    });

    const getNsOpenBill: any = computed(() => {
      return store.getters.focNonguestFolio.GET_NS_OPEN_BILL;
    });

    // Main Functions
    watch(
      () => state.hotel,
      async (res: any) => {
        const getGetHtParam0: any =
          store.getters.focNonguestFolio.GET_GET_HT_PARAM_0;
        let nsMainLogic: any = await $api.frontOfficeCashier.nsMainLogic({
          bilFlag: 0,
          currDepartment: res,
        });

        const selectBill1 = await $api.frontOfficeCashier.selectBill1({
          bilFlag: 0,
          sorttype: 1,
          gastname: ' ',
          dept: res,
          baDept: getGetHtParam0.fint,
          rechnr: 0,
        });

        store.commit.focNonguestFolio.SET_NS_MAIN_LOGIC(nsMainLogic);
        store.commit.focNonguestFolio.SET_SELECT_BILL_1(selectBill1);
        store.commit.focNonguestFolio.SET_SELECTED_HOTEL(res);
      }
    );

    const openDialogNonguestFolio = () => {
      store.commit.focNonguestFolio.SET_DIALOG_NONGUEST_FOLIO(true);
    };

    const getIconBillReceiverAddress = computed(
      () => store.getters.focNonguestFolio.GET_ICON_BILL_RECEIVER_ADDRESS
    );

    const getIconReservationRemark = computed(
      () => store.getters.focNonguestFolio.GET_ICON_RESERVATION_REMARK
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
          text1: 'Sorry, No Access Right. Access Code 8,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onClickIconReservationRemark = async () => {
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
          text1: 'Sorry, No Access Right. Access Code 8,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    return {
      // Services
      formatThousands,
      // Getters
      getLoadHotelDepartment,
      getSelectedBill,
      getNsOpenBill,
      // Main Functions
      openDialogNonguestFolio,
      getIconBillReceiverAddress,
      getIconReservationRemark,
      onClickIconBillReceiverAddress,
      onClickIconReservationRemark,
      ...toRefs(state),
    };
  },
  components: {
    NonguestFolioMenu: () =>
      import('~/app/modules/FOC/components/Shared/NonguestFolioMenu.vue'),
    DialogNonguestFolio: () =>
      import(
        '~/app/modules/FOC/components/Dialog/NonGuestFolio/DialogNonguestFolio.vue'
      ),
    DialogTransferHistory: () =>
      import(
        '~/app/modules/FOC/components/Dialog/NonGuestFolio/DialogTransferHistory.vue'
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
#GuestFolioLayoutId {
  .remark {
    max-height: 100px;
  }
}
</style>
