<template>
  <div class="q-ma-md">
    <div class="row">
      <div class="col-3 q-pr-md">
        <div class="icon-separator">
          <q-img
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-NewFolio.svg')"
            @click="onClickMenu('New Folio')"
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
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-PrintFolio.svg')"
            @click="onClickMenu('Print Folio')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Print Folio
            </q-tooltip>
          </q-img>
        </div>
      </div>

      <div class="col-9 row">
        <div class="icon-separator">
          <q-img
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-BillTransfer.svg')"
            @click="onClickMenu('Transfer Transaction')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Transfer Transaction
            </q-tooltip>
          </q-img>

          <q-img
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-AutoTransfer.svg')"
            @click="onClickMenu('Auto Transfer')"
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
            class="icon-guest-folio mr16"
            :src="require('~/app/icons/FOC/Icon-TransferHistory.svg')"
            @click="onClickMenu('Transfer History')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Transfer History
            </q-tooltip>
          </q-img>
        </div>
        <div>
          <q-img
            class="icon-guest-folio ml16"
            :src="require('~/app/icons/FOC/Icon-CardInformation.svg')"
            @click="onClickMenu('Credit Card')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Credit Card
            </q-tooltip>
          </q-img>

          <q-img
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-PrintCallCharge.svg')"
            @click="onClickMenu('Print Call Charge')"
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
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-ClosedFolio.svg')"
            @click="onClickMenu('Close Folio')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Close Folio
            </q-tooltip>
          </q-img>

          <q-img
            class="icon-guest-folio"
            :src="
              require('~/app/icons/FOC/Icon-ForeignCurrencyExchangeRate.svg')
            "
            @click="onClickMenu('Foreign Currency Exchange Rate')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Foreign Currency Exchange Rate
            </q-tooltip>
          </q-img>

          <q-img
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-MasterFolioMember.svg')"
            @click="onClickMenu('Master Folio Member')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Master Folio Member
            </q-tooltip>
          </q-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { store } from '~/store';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({});
    const onClickMenu = async (menu) => {
      const userAuth: any = Cookies.get('userAuth');
      const getBillListFoInvoice: any =
        store.getters.focGuestFolio.GET_BILL_LIST_FO_INVOICE;
      const getBookJournalArtMBillMember: any =
        store.getters.focGuestFolio.GET_BOOK_JOURNAL_ART_M_BILL_MEMBER;

      if (getBillListFoInvoice.tBillLine && menu === 'New Folio') {
        switch (true) {
          case getBillListFoInvoice.billAnzahl === 4:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'DialogNewFolio',
              title1: 'Information',
              text1: 'You can not create more than 4 bills.',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;

          case getBillListFoInvoice.billAnzahl < 4:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'DialogNewFolio',
              title1: 'Question',
              text1: 'Do you want to create a new bill?',
              btnOk: 'Yes',
              btnCancel: 'No',
              status: 'new folio',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;
          default:
            break;
        }
      } else if (getBillListFoInvoice.tBillLine && menu === 'Print Folio') {
        console.log('Print folio clicked');
      } else if (
        getBillListFoInvoice.tBillLine &&
        menu === 'Transfer Transaction'
      ) {
        const checkPermission = await $api.frontOfficeCashier.checkPermission({
          userInit: userAuth.userInit,
          arrayNr: 55,
          expectedNr: 2,
        });
        if (checkPermission.zugriff === 'true') {
          store.commit.focGuestFolio.SET_DIALOG_TRANSFER_TRANSACTION(true);
        } else {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'transfer-transaction-icon',
            title1: 'Information',
            text1: 'Sorry, No Access Right. Access Code 67,2',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        }
      } else if (getBillListFoInvoice.tBillLine && menu === 'Auto Transfer') {
        const getSelectedBill: any =
          store.getters.focGuestFolio.GET_SELECTED_BILL;
        const foInvoiceMiTransferBody = {
          caseType: 1,
          room: '',
          bilRecid: getSelectedBill['rec-id'],
          userInit: userAuth.userInit,
        };
        const foInvoiceMiTransfer = await $api.frontOfficeCashier.foInvoiceMiTransfer(
          foInvoiceMiTransferBody
        );

        if (
          getSelectedBill['rec-id'] &&
          foInvoiceMiTransfer.outputOkFlag === 'true'
        ) {
          store.commit.focGuestFolio.SET_FO_INVOICE_MI_TRANSFER(
            foInvoiceMiTransfer
          );
          store.commit.focGuestFolio.SET_DIALOG_AUTO_TRANSFER(true);
        }
      } else if (
        getBillListFoInvoice.tBillLine &&
        menu === 'Transfer History'
      ) {
        const foTransDetailPrepare = await $api.frontOfficeCashier.foTransDetailPrepare(
          {
            billNo: getBillListFoInvoice.rechnr,
            artNo: 0,
            amount: 0,
            systdate: null,
            systtime: 0,
          }
        );

        store.commit.focGuestFolio.SET_FO_TRANS_DETAIL_PREPARE(
          foTransDetailPrepare
        );
        store.commit.focGuestFolio.SET_DIALOG_TRANSFER_HISTORY(true);
      } else if (getBillListFoInvoice.tBillLine && menu === 'Credit Card') {
        if (getBillListFoInvoice.tBill) {
          const readGuest = await $api.frontOfficeCashier.readGuest({
            caseType: 1,
            gastNo: getBillListFoInvoice.tBill['t-bill'][0].gastnr,
            gname: ' ',
            fname: ' ',
          });

          let getCreditCard: any;
          if (readGuest[0]['ausweis-nr2']) {
            getCreditCard = readGuest[0]['ausweis-nr2'].replace(/\|\\\\/g, '');
            getCreditCard = getCreditCard.replace(/\|/g, '\\');
            getCreditCard = getCreditCard.split('\\');
            getCreditCard.pop();

            store.commit.focGuestFolio.SET_CREDIT_CARD(getCreditCard);
            store.commit.focGuestFolio.SET_READ_GUEST(readGuest);
          } else {
            getCreditCard = [];
            store.commit.focGuestFolio.SET_CREDIT_CARD(getCreditCard);
          }
          store.commit.focGuestFolio.SET_DIALOG_CREDIT_CARD(true);
        }
      } else if (
        getBillListFoInvoice.tBillLine &&
        menu === 'Print Call Charge'
      ) {
        console.log('Print call charge clicked');
      } else if (getBillListFoInvoice.tBillLine && menu === 'Close Folio') {
        console.log('Close Folio Clicked');
      } else if (
        getBillListFoInvoice.tBillLine &&
        menu === 'Foreign Currency Exchange Rate'
      ) {
        const readCurrency = await $api.frontOfficeCashier.readCurrency({
          caseType: 8,
          currencyNo: null,
          currBez: null,
        });
        store.commit.focGuestFolio.SET_READ_CURRENCY(readCurrency);
        store.commit.focGuestFolio.SET_DIALOG_FCER(true);
      } else if (
        getBillListFoInvoice.tBillLine &&
        menu === 'Master Folio Member' &&
        getBookJournalArtMBillMember.b1List
      ) {
        store.commit.focGuestFolio.SET_DIALOG_MASTER_FOLIO_MEMBER(true);
      }
    };

    return {
      onClickMenu,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.icon-guest-folio {
  width: 30px;
  height: 30px;
  margin-right: 30px;
  cursor: pointer;
}

.icon-separator {
  border-right: 0.5px solid #acacac;
}

.ml16 {
  margin-left: 16px;
}

.mr16 {
  margin-right: 16px;
}
</style>
