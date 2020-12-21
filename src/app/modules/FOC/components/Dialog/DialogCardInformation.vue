<template>
  <q-dialog v-model="dialogCardInformationModel" persistent>
    <q-card style="width: 800px;">
      <q-toolbar v-if="readGuest.length > 0">
        <q-toolbar-title class="text-white text-weight-medium">
          {{
            `Credit Card Number - ${readGuest[0]['name']}, ${readGuest[0]['vorname1']}`
          }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div
            class="col-12 q-mb-lg"
            style="border: 1px solid rgba(0, 0, 0, 0.12);"
          >
            <div class="row">
              <div
                class="col-4 q-pl-sm"
                style="
                  border: 1px solid rgba(0, 0, 0, 0.12);
                  font-weight: bold;
                "
              >
                Credit Card Name
              </div>
              <div
                class="col-4 q-pl-sm"
                style="
                  border: 1px solid rgba(0, 0, 0, 0.12);
                  font-weight: bold;
                "
              >
                Number
              </div>
              <div
                class="col-4 q-pl-sm"
                style="
                  border: 1px solid rgba(0, 0, 0, 0.12);
                  font-weight: bold;
                "
              >
                Expired
              </div>
              <div
                class="col-4 q-pl-sm"
                v-for="(creditCard, i) in getCreditCard"
                :key="i"
                style="border: 1px solid rgba(0, 0, 0, 0.12);"
                v-show="getCreditCard.length > 0"
              >
                <p style="margin: 0;">
                  {{ creditCard }}
                </p>
              </div>
              <div
                v-show="getCreditCard.length === 0"
                class="col-12"
                style="border: 1px solid rgba(0, 0, 0, 0.12);"
              >
                <p style="margin: 0; text-align: center; padding: 5px 0;">
                  No Credit Card
                </p>
              </div>
            </div>
          </div>

          <div class="col-3 q-pr-sm">
            <SSelect
              outlined
              class="q-mb-md"
              v-model="inputParams.ccName"
              emit-value
              map-options
              option-value="bezeich"
              option-label="bezeich"
              :options="getArticles"
              :dense="true"
            />
          </div>
          <div class="col-4 q-pr-sm">
            <SInput
              placeholder="Number"
              v-model="inputParams.ccNumber"
              mask="####-####-####-####"
              @blur="checkCC"
              unmasked-value
            />
            <p v-if="checker">Invalid</p>
          </div>
          <div class="col-2 q-pr-sm">
            <SInput
              placeholder="Months"
              v-model="inputParams.expMonth"
              mask="##"
              unmasked-value
            />
          </div>
          <div class="col-2 q-pr-sm">
            <SInput
              placeholder="Years"
              v-model="inputParams.expYear"
              mask="####"
              unmasked-value
            />
          </div>
          <div class="col-1 text-center">
            <q-icon
              name="mdi-plus"
              style="font-size: 25px; cursor: pointer;"
              @click="addCC"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="$emit('onDialogCardInformation', false)"
        />
        <q-btn
          color="primary"
          label="OK"
          @click="$emit('onDialogCardInformation', false)"
        />
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
  props: {
    dialog: { type: Boolean, required: true },
    readGuest: { type: Array },
    creditCardsDef: { type: String },
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      checker: false,
      inputParams: {
        ccName: '',
        ccNumber: '',
        expMonth: '',
        expYear: '',
      },
    });

    const getArticles = computed({
      get: () => store.getters.foc.GET_ARTICLES_PAYMENT,
      set: (items) => {
        console.log('getArticles', items);
      },
    });

    const checkCC = async () => {
      const inputParam: any = state.inputParams;
      const ccVerificationBody = {
        strcc: inputParam.ccNumber,
      };

      const ccVerification = await $api.frontOfficeCashier.ccVerification(
        ccVerificationBody
      );

      ccVerification === 'true'
        ? (state.checker = false)
        : (state.checker = true);
    };

    const addCC = async () => {
      const inputParam: any = state.inputParams;
      const prop: any = props;

      const ccBtnExitBody = {
        gastnr: prop.readGuest[0]['gastnr'],
        ausweisNr2: `${prop.creditCardsDef}${inputParam.ccName}\\${inputParam.ccNumber}\\${inputParam.expMonth}${inputParam.expYear}|`,
      };
      const ccBtnExit = await $api.frontOfficeCashier.ccBtnExit(ccBtnExitBody);

      if (ccBtnExit.outputOkFlag === 'true') {
        const readGuestBody = {
          caseType: 1,
          gastNo: prop.readGuest[0]['gastnr'],
          gname: ' ',
          fname: ' ',
        };
        const readGuest = await $api.frontOfficeCashier.readGuest(
          readGuestBody
        );
        let creditCards = readGuest[0]['ausweis-nr2'];
        creditCards = creditCards.replace(/\|\\\\/g, '');
        creditCards = creditCards.replace(/\|/g, '\\');
        creditCards = creditCards.split('\\');
        creditCards.pop();
        onResets();
        store.commit.foc.SET_CREDIT_CARD(creditCards);
      }
    };

    const dialogCardInformationModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialogCardInformation', val);
      },
    });

    const getCreditCard = computed({
      get: () => store.getters.foc.GET_CREDIT_CARD,
      set: (items) => {
        console.log('getCreditCard', items);
      },
    });

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.ccName = '';
      inputParam.ccNumber = '';
      inputParam.expMonth = '';
      inputParam.expYear = '';
    };

    return {
      getArticles,
      checkCC,
      addCC,
      dialogCardInformationModel,
      getCreditCard,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
