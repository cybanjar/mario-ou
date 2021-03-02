<template>
  <q-dialog v-model="getDialogCreditCard" persistent>
    <q-card class="dialog-card">
      <q-toolbar v-if="getReadGuest.length > 0">
        <q-toolbar-title class="text-white text-weight-medium">
          {{
            `Credit Card Number - ${getReadGuest[0]['name']}, ${getReadGuest[0]['vorname1']}`
          }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-lg cc-table">
            <div class="row">
              <div class="col-4 q-pl-sm cc-head">Credit Card Name</div>
              <div class="col-4 q-pl-sm cc-head">Number</div>
              <div class="col-4 q-pl-sm cc-head">Expired</div>
              <div
                class="col-4 q-pl-sm cc-body"
                v-for="(creditCard, i) in getCreditCard"
                :key="i"
                v-show="getCreditCard.length > 0"
              >
                <p class="cc-credit-card">
                  {{ creditCard }}
                </p>
              </div>
              <div v-show="getCreditCard.length === 0" class="col-12 cc-body">
                <p class="cc-no-credit-card">No Credit Card</p>
              </div>
            </div>
          </div>

          <div class="col-4">
            <SSelect
              outlined
              class="q-mb-md"
              v-model="ccName"
              emit-value
              map-options
              option-value="bezeich"
              option-label="bezeich"
              :options="
                getFoInvoicePrepare.tArtikel
                  ? getFoInvoicePrepare.tArtikel['t-artikel']
                  : []
              "
              :dense="true"
            />
          </div>
          <div class="col-4">
            <SInput
              placeholder="Number"
              v-model="ccNumber"
              mask="####-####-####-####"
              @blur="checkCC"
              unmasked-value
            />
          </div>
          <div class="col-4 f-top">
            <SInput
              placeholder="Months"
              v-model="expMonth"
              mask="##"
              @blur="checkMonth"
              unmasked-value
            />

            <SInput
              placeholder="Years"
              v-model="expYear"
              mask="####"
              @blur="checkYear"
              unmasked-value
            />
            <q-icon name="mdi-plus" class="cc-add-credit-card" @click="addCC" />
          </div>
          <p v-if="checker">Invalid credit card</p>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
          @click="onClickCancle"
        />
        <q-btn color="primary" label="OK" @click="onClickOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      creditCards: [],
      checker: false,
      ccName: '',
      ccNumber: '',
      expMonth: '',
      expYear: '',
    });

    const getDialogCreditCard = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_DIALOG_CREDIT_CARD;
      return res;
    });

    const getFoInvoicePrepare = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_FO_INVOICE_PREPARE;
      if (res.tArtikel) {
        res.tArtikel['t-artikel'].filter(
          (item: any) => item.artart === 2 || item.artart === 7
        );
      }
      return res;
    });

    const getReadGuest = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_READ_GUEST;
      return res;
    });

    const getCreditCard = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_CREDIT_CARD;
      if (res.length > 0) {
        res.map((item: any, index: any) => {
          if (parseInt(item)) {
            res[index] = res[index].replace(
              /(\d{1})(\d{11})(\d{4})/,
              '$1XXXXXXXXXXX$3'
            );
          }

          if (parseInt(item) && item.length === 6) {
            console.log('masuk else if');
            res[index] = res[index].replace(/(\d{2})(\d{4})/, '$1/$2');
          }
        });
      }

      return res;
    });

    const checkCC = async () => {
      const ccVerificationBody = {
        strcc: state.ccNumber,
      };

      const ccVerification = await $api.frontOfficeCashier.ccVerification(
        ccVerificationBody
      );

      ccVerification === 'true'
        ? (state.checker = false)
        : (state.checker = true);
    };

    const checkMonth = async () => {
      const date = new Date();
      const currentMonth = date.getMonth() + 1;
      if (parseInt(state.expMonth) > 12) {
        if (currentMonth.toString().length === 1) {
          state.expMonth = `0${currentMonth.toString()}`;
        }
      } else {
        if (state.expMonth.length === 1) {
          state.expMonth = `0${state.expMonth}`;
        }
      }
    };

    const checkYear = async () => {
      const date = new Date();
      const currentYear = date.getFullYear();
      if (parseInt(state.expYear) < currentYear) {
        state.expYear = currentYear.toString();
      }
    };

    const addCC = async () => {
      if (
        state.checker === false &&
        state.ccName &&
        state.ccNumber &&
        state.expMonth &&
        state.expYear
      ) {
        const ccBtnExit = await $api.frontOfficeCashier.ccBtnExit({
          gastnr: getReadGuest.value[0]['gastnr'],
          ausweisNr2: `${getReadGuest.value[0]['ausweis-nr2']}${state.ccName}\\${state.ccNumber}\\${state.expMonth}${state.expYear}|`,
        });

        if (ccBtnExit.outputOkFlag === 'true') {
          const readGuest = await $api.frontOfficeCashier.readGuest({
            caseType: 1,
            gastNo: getReadGuest.value[0]['gastnr'],
            gname: ' ',
            fname: ' ',
          });
          let getCreditCard = readGuest[0]['ausweis-nr2'].replace(
            /\|\\\\/g,
            ''
          );
          getCreditCard = getCreditCard.replace(/\|/g, '\\');
          getCreditCard = getCreditCard.split('\\');
          getCreditCard.pop();
          onResets();
          store.commit.focGuestFolio.SET_CREDIT_CARD(getCreditCard);
          store.commit.focGuestFolio.SET_READ_GUEST(readGuest);
        }
      } else {
        alert('error');
      }
    };

    const onResets = () => {
      state.ccName = '';
      state.ccNumber = '';
      state.expMonth = '';
      state.expYear = '';
    };

    const onClickOk = () => {
      store.commit.focGuestFolio.SET_DIALOG_CREDIT_CARD(false);
      onResets();
    };

    const onClickCancle = () => {
      store.commit.focGuestFolio.SET_DIALOG_CREDIT_CARD(false);
      onResets();
    };

    return {
      getFoInvoicePrepare,
      checkCC,
      checkMonth,
      checkYear,
      addCC,
      getCreditCard,
      getReadGuest,
      getDialogCreditCard,
      onClickOk,
      onClickCancle,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 800px;
}

.q-toolbar {
  background: $primary-grad;
}

.f-top {
  display: flex;
  align-items: flex-start;
}

.cc-table {
  border: 1px solid rgba(0, 0, 0, 0.12);

  .cc-head {
    border: 1px solid rgba(0, 0, 0, 0.12);
    font-weight: bold;
  }

  .cc-body {
    border: 1px solid rgba(0, 0, 0, 0.12);

    .cc-credit-card {
      margin: 0;
    }

    .cc-no-credit-card {
      margin: 0;
      text-align: center;
      padding: 5px 0;
    }
  }
}

.cc-add-credit-card {
  font-size: 25px;
  margin: 0 0 16px 16px;
  cursor: pointer;
}
</style>
