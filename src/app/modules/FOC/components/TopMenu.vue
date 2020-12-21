<template>
  <section class="q-ma-md">
    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-SelectDepartment.svg')"
      @click="onClickSelectDepartment()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Select Department
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-BackDate.svg')"
      @click="onClickBackDate()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Back Date
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-NewFolio.svg')"
      @click="onClickNewFolio()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        New Folio
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-PrintFolio.svg')"
      @click="onClickPrintFolio()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Print Folio
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-Checkout.svg')"
      @click="onClickCheckOut()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Check Out
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-BillTransfer.svg')"
      @click="onClickBillTransfer()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Bill Transfer
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-AutoTransfer.svg')"
      @click="onClickAutoTransfer()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Auto Transfer
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-TransferHistory.svg')"
      @click="onClickTransferHistory()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Transfer History
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-PresetArticlePosting.svg')"
      @click="onClickPresetArticlePosting()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Preset Article Posting
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-CardInformation.svg')"
      @click="onClickCardInformation()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Card Information
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-PrintCallCharge.svg')"
      @click="onClickPrintCallCharge()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Print Call Charge
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-MasterFolio.svg')"
      @click="$router.push('/foc/master-folio')"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Master Folio
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-NonguestFolio.svg')"
      @click="$router.push('/foc/nonguest-folio')"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Nonguest Folio
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-ClosedFolio.svg')"
      @click="$router.push('/foc/closed-folio')"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Closed Folio
      </q-tooltip>
    </q-img>

    <q-img
      class="foc-icon"
      :src="require('~/app/icons/FOC/Icon-MasterFolioMember.svg')"
      @click="onClickMasterFolioMember()"
    >
      <q-tooltip
        anchor="top middle"
        self="center middle"
        content-class="bg-dark"
      >
        Master Folio Member
      </q-tooltip>
    </q-img>

    <DialogSelectDepartment
      :dialog="dialogSelectDepartment"
      :hotels="hotels"
      @onDialogSelectDepartment="onDialogSelectDepartment"
    />

    <DialogBackDate
      :dialog="dialogBackDate"
      @onDialogBackDate="onDialogBackDate"
    />

    <DialogNewFolio
      :dialog="dialogNewFolio"
      @onDialogNewFolio="onDialogNewFolio"
    />

    <DialogPrintFolio
      :dialog="dialogPrintFolio"
      @onDialogPrintFolio="onDialogPrintFolio"
    />

    <DialogCheckOut
      :dialog="dialogCheckOut"
      @onDialogCheckOut="onDialogCheckOut"
    />

    <DialogBillTransfer
      :dialog="dialogBillTransfer"
      @onDialogBillTransfer="onDialogBillTransfer"
    />

    <DialogAutoTransfer
      :dialog="dialogAutoTransfer"
      @onDialogAutoTransfer="onDialogAutoTransfer"
    />

    <DialogTransferHistory
      :dialog="dialogTransferHistory"
      @onDialogTransferHistory="onDialogTransferHistory"
    />

    <DialogPresetArticlePosting
      :dialog="dialogPresetArticlePosting"
      @onDialogPresetArticlePosting="onDialogPresetArticlePosting"
    />

    <DialogCardInformation
      :dialog="dialogCardInformation"
      :read-guest="readGuest"
      :credit-cards-def="creditCardsDef"
      @onDialogCardInformation="onDialogCardInformation"
    />

    <DialogPrintCallCharge
      :dialog="dialogPrintCallCharge"
      @onDialogPrintCallCharge="onDialogPrintCallCharge"
    />
    <DialogMasterFolioMember
      :dialog="dialogMasterFolioMember"
      :master-folio-member="masterFolioMember"
      @onDialogMasterFolioMember="onDialogMasterFolioMember"
    />
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { store } from '~/store';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      dialogSelectDepartment: false,
      dialogBackDate: false,
      dialogNewFolio: false,
      dialogPrintFolio: false,
      dialogCheckOut: false,
      dialogBillTransfer: false,
      dialogAutoTransfer: false,
      dialogTransferHistory: false,
      dialogPresetArticlePosting: false,
      dialogCardInformation: false,
      dialogPrintCallCharge: false,
      dialogMasterFolioMember: false,
      readGuest: [],
      creditCardsDef: '',
      hotels: [],
      masterFolioMember: {},
    });

    const getSelectedParentBills = computed({
      get: () => store.getters.foc.GET_SELECTED_PARENT_BILLS,
      set: (items) => {
        console.log('getSelectedParentBills', items);
      },
    });

    const getParentBillsInvoice = computed({
      get: () => store.getters.foc.GET_PARENT_BILLS_INVOICE,
      set: (items) => {
        console.log('getParentBillsInvoice', items);
      },
    });

    const onDialogSelectDepartment = (val) => {
      state.dialogSelectDepartment = val;
    };

    const onClickSelectDepartment = async () => {
      const hotels = await $api.frontOfficeCashier.loadHotelDepartment();
      hotels.map((e, i) => {
        e.indexFoc = i;
      });
      state.hotels = hotels;

      onDialogSelectDepartment(true);
    };

    const onDialogBackDate = (val) => {
      state.dialogBackDate = val;
    };

    const onClickBackDate = () => {
      onDialogBackDate(true);
    };

    const onDialogNewFolio = (val) => {
      state.dialogNewFolio = val;
    };

    const onClickNewFolio = () => {
      onDialogNewFolio(true);
    };

    const onDialogPrintFolio = (val) => {
      state.dialogPrintFolio = val;
    };

    const onClickPrintFolio = () => {
      onDialogPrintFolio(true);
    };

    const onDialogCheckOut = (val) => {
      state.dialogCheckOut = val;
    };

    const onClickCheckOut = () => {
      onDialogCheckOut(true);
    };

    const onDialogBillTransfer = (val) => {
      state.dialogBillTransfer = val;
    };

    const onClickBillTransfer = () => {
      onDialogBillTransfer(true);
    };

    const onDialogAutoTransfer = (val) => {
      state.dialogAutoTransfer = val;
    };

    const onClickAutoTransfer = async () => {
      const foInvoiceMiTransferBody = {
        caseType: 1,
        room: '',
        bilRecid: getSelectedParentBills.value['rec-id'],
        userInit: '01',
      };
      const foInvoiceMiTransfer = await $api.frontOfficeCashier.foInvoiceMiTransfer(
        foInvoiceMiTransferBody
      );

      if (
        getSelectedParentBills.value['rec-id'] &&
        foInvoiceMiTransfer.outputOkFlag === 'true'
      ) {
        onDialogAutoTransfer(true);
      }
    };

    const onDialogTransferHistory = (val) => {
      state.dialogTransferHistory = val;
    };

    const onClickTransferHistory = async () => {
      const foTransDetailPrepareBody = {
        billNo: 37101,
        billdate: 0,
        artNo: 0,
        amount: 0,
        systdate: 0,
        systtime: 0,
      };
      const foTransDetailPrepare = await $api.frontOfficeCashier.foTransDetailPrepare(
        foTransDetailPrepareBody
      );
      console.log(foTransDetailPrepare);
      onDialogTransferHistory(true);
    };

    const onDialogPresetArticlePosting = (val) => {
      state.dialogPresetArticlePosting = val;
    };

    const onClickPresetArticlePosting = () => {
      onDialogPresetArticlePosting(true);
    };

    const onDialogCardInformation = (val) => {
      state.dialogCardInformation = val;
    };

    const onClickCardInformation = async () => {
      const parentBillsInvoice: any = getParentBillsInvoice.value;
      if (parentBillsInvoice.tBill) {
        const readGuestBody = {
          caseType: 1,
          gastNo: parentBillsInvoice.tBill['t-bill'][0].gastnr,
          gname: ' ',
          fname: ' ',
        };
        const readGuest = await $api.frontOfficeCashier.readGuest(
          readGuestBody
        );
        state.readGuest = readGuest;
        let creditCards = readGuest[0]['ausweis-nr2'];
        if (creditCards) {
          creditCards = creditCards.replace(/\|\\\\/g, '');
          state.creditCardsDef = creditCards;
          creditCards = creditCards.replace(/\|/g, '\\');
          creditCards = creditCards.split('\\');
          creditCards.pop();
          store.commit.foc.SET_CREDIT_CARD(creditCards);
        } else {
          creditCards = [];
          store.commit.foc.SET_CREDIT_CARD(creditCards);
        }
        onDialogCardInformation(true);
      }
    };

    const onDialogPrintCallCharge = (val) => {
      state.dialogPrintCallCharge = val;
    };

    const onClickPrintCallCharge = () => {
      onDialogPrintCallCharge(true);
    };

    const onDialogMasterFolioMember = (val) => {
      state.dialogMasterFolioMember = val;
    };

    const onClickMasterFolioMember = async () => {
      const foInvoiceMViewBody = {
        bilRecid: getSelectedParentBills.value['rec-id'],
      };
      const foInvoiceMView = await $api.frontOfficeCashier.foInvoiceMView(
        foInvoiceMViewBody
      );

      if (foInvoiceMView.availMbill === 'true') {
        const bookJournArtMBillMemberBody = {
          resno: foInvoiceMView.mbillResnr,
          billno: foInvoiceMView.mbillRechnr,
        };

        const bookJournArtMBillMember = await $api.frontOfficeCashier.bookJournArtMBillMember(
          bookJournArtMBillMemberBody
        );

        state.masterFolioMember = bookJournArtMBillMember;

        onDialogMasterFolioMember(true);
      }
    };

    return {
      getSelectedParentBills,
      getParentBillsInvoice,
      onDialogSelectDepartment,
      onClickSelectDepartment,
      onDialogBackDate,
      onClickBackDate,
      onDialogNewFolio,
      onClickNewFolio,
      onDialogPrintFolio,
      onClickPrintFolio,
      onDialogCheckOut,
      onClickCheckOut,
      onDialogBillTransfer,
      onClickBillTransfer,
      onDialogAutoTransfer,
      onClickAutoTransfer,
      onDialogTransferHistory,
      onClickTransferHistory,
      onDialogPresetArticlePosting,
      onClickPresetArticlePosting,
      onDialogCardInformation,
      onClickCardInformation,
      onDialogPrintCallCharge,
      onClickPrintCallCharge,
      onDialogMasterFolioMember,
      onClickMasterFolioMember,
      ...toRefs(state),
    };
  },
  components: {
    DialogSelectDepartment: () => import('./Dialog/DialogSelectDepartment.vue'),
    DialogBackDate: () => import('./Dialog/DialogBackDate.vue'),
    DialogNewFolio: () => import('./Dialog/DialogNewFolio.vue'),
    DialogPrintFolio: () => import('./Dialog/DialogPrintFolio.vue'),
    DialogCheckOut: () => import('./Dialog/DialogCheckOut.vue'),
    DialogBillTransfer: () => import('./Dialog/DialogBillTransfer.vue'),
    DialogAutoTransfer: () => import('./Dialog/DialogAutoTransfer.vue'),
    DialogTransferHistory: () => import('./Dialog/DialogTransferHistory.vue'),
    DialogPresetArticlePosting: () =>
      import('./Dialog/DialogPresetArticlePosting.vue'),
    DialogCardInformation: () => import('./Dialog/DialogCardInformation.vue'),
    DialogPrintCallCharge: () => import('./Dialog/DialogPrintCallCharge.vue'),
    DialogMasterFolioMember: () =>
      import('./Dialog/DialogMasterFolioMember.vue'),
  },
});
</script>

<style lang="scss" scoped>
.foc-icon {
  width: 30px;
  height: 30px;
  margin-right: 30px;
  cursor: pointer;
}
</style>
