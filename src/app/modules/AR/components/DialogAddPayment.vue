<template>
  <SDialog v-bind="$attrs" v-on="$listeners">
    <template #title>Payment Record </template>
    <template #body>
      <div class="bg-white q-pa-md">
        <div class="row q-col-gutter-sm">
          <div class="col-4">
            <AddPaymentForm
              v-model="form"
              :total-balance="totalBalance"
              :label="submitLabel"
              :bill-date="billDate"
              :transfer-date="transferDate"
              :articles="articles"
              :loading="formPrep.data.isLoading"
              @on-save="addToRecord"
            >
              <div class="q-my-md">
                <SRemarkLeftDrawer
                  label="Total"
                  :value="paymentTotal | money"
                />
                <SRemarkLeftDrawer
                  label="Balance"
                  :value="totalBalance | money"
                />
              </div>
            </AddPaymentForm>
          </div>
          <div class="col">
            <AddPaymentTable
              :data="record"
              @row-click="setForm"
              @delete="delRecord"
            />
          </div>
        </div>
      </div>
    </template>
    <template #action-cancel>
      <q-btn
        label="Cancel"
        color="white"
        class="q-mr-md"
        text-color="gray"
        outline
        v-close-popup
      />
    </template>
    <template #action-ok>
      <q-btn label="Ok" color="primary" @click="savePayment" />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import { date } from 'quasar';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { ResPaymentDebtPayList } from '../models/payment.model';
import { paymentRecordListColumns } from '../tables/payment-record.table';
import { reformArticle, reformWarung } from '../utils/reformData';
import { FormState, initState } from './AddPaymentForm.vue';

export default defineComponent({
  inheritAttrs: true,
  props: {
    dataSelected: {
      type: Array as () => ResPaymentDebtPayList[],
      required: true,
    },
    debitArticle: { type: Number, required: false },
    totalBalance: { type: Number, required: false, default: 0 },
  },
  setup(props, { root: { $api, $q }, refs, listeners }) {
    const record = ref<FormState[]>([]);
    const articles = ref([]);
    const form = ref<FormState>({
      ...initState,
    });

    const submitLabel = computed(() =>
      form.value.isEdit ? 'Edit Payment' : 'Add Payment'
    );

    const paymentTotal = computed<number>(() =>
      record.value.reduce((total, payment) => total + payment.amount, 0)
    );

    function setForm(_, payment: any) {
      form.value = {
        ...payment,
        isEdit: true,
      };
      formPrep.refetch();
    }

    const billDate = ref();
    const transferDate = ref();

    const formPrep = usePrepare(
      true,
      () =>
        Promise.all([
          $api.accountReceivable.getARClosePayDate(),
          $api.accountReceivable.getReadArticleList({
            caseType: '23',
            dept: 0,
            actFlag: true,
          }),
          $api.common.getGeneralParam(2, 1014),
        ]),
      ([closeDate, accList, lastTransfer]) => {
        const billFromDate = date.extractDate(closeDate.billDate, 'YYYY-MM-DD');

        transferDate.value = date.extractDate(lastTransfer.fdate, 'YYYY-MM-DD');
        billDate.value = billFromDate;
        form.value.payDate = billFromDate;
        articles.value = reformArticle(accList, '23');
        console.log(lastTransfer);
      }
    );

    const savePrep = usePrepare(
      false,
      (param) => $api.accountReceivable.arPaymentSettlePaymentDebtPay(param),
      (responseSavePayment) => {
        if (
          responseSavePayment.fFlag === 0 &&
          responseSavePayment.msgStr === ''
        ) {
          record.value = [];
          doReset();
          $q.notify({
            type: 'positive',
            message: 'Successfully added',
          });
          listeners.hide && listeners.hide();
        } else {
          $q.notify({
            type: 'negative',
            message: responseSavePayment.message,
          });
        }
      }
    );

    const warungPrep = usePrepare(
      true,
      () =>
        $api.accountReceivable.arPaymentReadWaehrung({
          caseType: 1,
          currencyNo: 1,
          currBez: ' ',
        }),
      undefined,
      reformWarung
    );

    async function savePayment() {
      let ageList = [];
      console.log('x', props.dataSelected);
      const stateWarung = warungPrep.result.value;
      for (var i = 0; i < props.dataSelected.length; i++) {
        let ageListArr = props.dataSelected[i];
        // let al_selected = ageListArr.selected ? 'Yes' : 'No';
        let cidate = ageListArr.cidate ? ageListArr.cidate : ' ';
        let codate = ageListArr.codate ? ageListArr.codate : ' ';
        let prevdate = ageListArr.prevdate ? ageListArr.prevdate : ' ';

        ageList.push({
          selected: 'Yes',
          'ar-recid': ageListArr.recid,
          rechnr: ageListArr.billNumber,
          refno: ageListArr.referenceNumber,
          counter: ageListArr.counter,
          gastnr: ageListArr.gastnr,
          billname: ageListArr.billName,
          gastnrmember: ageListArr.gastnrmember,
          gastname: ageListArr.guestName,
          zinr: ageListArr.roomNumber,
          rgdatum: ageListArr.billDateOri,
          'user-init': ageListArr.id,
          debt: ageListArr.debt,
          'debt-foreign': ageListArr.foreignDebt,
          currency: ageListArr.currency,
          credit: ageListArr.creditOri,
          'tot-debt': ageListArr.balanceOri,
          'vouc-nr': ageListArr.voucherNumber,
          prevdate: prevdate,
          remarks: ageListArr.remark,
          'b-resname': ageListArr.bresname,
          'ci-date': cidate,
          'co-date': codate,
        });
      }

      let currency_str = stateWarung ? stateWarung[0].currency_short_code : '';
      let paymentList = [];
      let total_paid_amount = 0;

      for (var i = 0; i < record.value.length; i++) {
        let dataPayment = record.value[i];
        let currency = dataPayment.fAmt; //currency
        let paid_amount = dataPayment.amount;
        total_paid_amount += paid_amount;

        paymentList.push({
          artnr: dataPayment.article,
          bezeich: dataPayment.description,
          proz: dataPayment.perc,
          betrag: paid_amount, // paid amount yg dimasukan user
          'f-amt': 0,
          currency: currency,
          'curr-str': currency_str,
          bemerk: dataPayment.remark,
          'remain-amt': paid_amount,
          'fremain-amt': 0,
          //"payDate": dateToServer(dataPayment.payment_date), // "01/09/19"
          //"fbalance": dataPayment.foreign_amount, // Nilai yg sudah dibayar dalam foreign
        });
      }

      let initialApiSavePaymentParams = {
        pvILanguage: '1',
        outstand1: props.totalBalance, // Total yg diselect
        foutstand1: 0,
        outstand: props.totalBalance + total_paid_amount, // sama kayak balance
        currArt: props.debitArticle,
        rundung: 0,
        foutstand: 0, // Total yg diselect dalam foreign
        payDate: date.formatDate(formPrep.data.raw[0].billDate, 'MM/DD/YY'),
        balance: total_paid_amount, //total_balance + total_paid_amount,
        fbalance: 0,
        userInit: '01',
        ageList: {
          'age-list': ageList,
        },
        payList: {
          'pay-list': paymentList,
        },
      };

      if (total_paid_amount == 0 && record.value.length == 0) {
        $q.notify({
          type: 'warning',
          message: 'Submit Without Payment',
        });
      } else if (total_paid_amount * -1 > props.totalBalance) {
        $q.notify({
          type: 'warning',
          message: 'Over Balance',
        });
      } else {
        savePrep.refetch(initialApiSavePaymentParams);
      }
    }

    function doReset() {
      form.value = { ...initState };
      formPrep.refetch();
    }

    function delRecord({ key }) {
      record.value = record.value.filter((it) => it.key !== key);
      if (form.value.key === key) {
        doReset();
      }
    }

    function addToRecord(mForm: FormState) {
      const index = record.value.findIndex((it) => it.key === mForm.key);
      // console.log(mForm.key, index, record);
      if (!~index === false) {
        // has not record
        const data = [...record.value];
        const payment = {
          ...record.value[index],
          ...mForm,
        };
        record.value = [
          ...data.slice(0, index),
          payment,
          ...data.slice(index + 1),
        ];
      } else {
        const payment = {
          key: record.value.length,
          ...mForm,
        };
        record.value = [...record.value, payment];
      }

      doReset();
    }

    return {
      form,
      savePayment,
      record,
      delRecord,
      paymentTotal,
      submitLabel,
      formPrep,
      paymentRecordListColumns,
      setForm,
      addToRecord,
      articles,
      billDate,
      transferDate,
    };
  },
  components: {
    AddPaymentForm: () => import('./AddPaymentForm.vue'),
    AddPaymentTable: () => import('./AddPaymentTable.vue'),
  },
});
</script>
