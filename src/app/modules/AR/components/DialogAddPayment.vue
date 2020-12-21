<template>
  <q-dialog ref="dialogElRef" :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <div class="dialog__title">Payment Record</div>
      </div>
      <div class="bg-white q-pa-md">
        <div class="row q-col-gutter-sm">
          <div class="col-4">
            <q-form @submit="save">
              <SInput
                label-text="Payment Date"
                hide-bottom-space
                type="string"
                v-model="formData.payDate"
                :rules="['date']"
              ></SInput>
              <q-separator></q-separator>
              <SelectFilter
                label-text="Payment Article"
                :options="articleOptions"
                option-value="value"
                option-label="label"
                v-model="formData.article"
                hide-bottom-space
                lazy-rules
                :rules="[(val) => val || 'Please select article']"
              ></SelectFilter>
              <SInput
                label-text="In Percentage(%)"
                v-model="formData.perc"
                hide-bottom-space
                type="number"
              ></SInput>
              <SInput
                label-text="In Amount"
                @focus="calculateAmount"
                v-model="formData.amount"
                hide-bottom-space
                type="number"
              ></SInput>
              <SInput
                label-text="Payment Remark"
                hide-bottom-space
                v-model="formData.remark"
                type="string"
              ></SInput>
              <q-btn
                class="full-width"
                type="submit"
                :label="submitLabel"
                color="primary"
                inline
              />
              <q-separator></q-separator>
              <div class="q-my-md">
                <SRemarkLeftDrawer label="Total" :value="paymentTotal" />
                <SRemarkLeftDrawer label="Balance" :value="totalBalance" />
              </div>
            </q-form>
          </div>
          <div class="col">
            <STable
              row-key="key"
              selection="single"
              :columns="paymentRecordListColumns"
              :data="paymentList"
              :selected.sync="selected"
            ></STable>
          </div>
        </div>
      </div>
      <div class="dialog__footer q-pa-md q-gutter-sm">
        <q-btn
          label="Cancel"
          color="white"
          text-color="gray"
          outline
          v-close-popup
        />
        <q-btn label="Ok" color="primary" @click="insertPaymentDebt" />
      </div>
    </div>
  </q-dialog>
</template>
<script lang="ts">
import { date, QDialog } from 'quasar';
import {
  defineComponent,
  reactive,
  toRaw,
  ref,
  toRefs,
  computed,
  watch,
} from '@vue/composition-api';
import { paymentRecordListColumns } from '../tables/payment-record.table';
import { loadArticleList } from '../shared/article-list.comp';
import { loadPayDate } from '../shared/pay-date.comp';
import {
  PaymentRecord,
  ResPaymentDebtPayList,
  ReqSettlePaymentDebt,
} from '../../AR/models/payment.model';

type FormType = 'edit' | 'add';
type PayRow = PaymentRecord & { key: number };

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    selectDepts: {
      type: Array as () => Array<ResPaymentDebtPayList>,
      required: true,
    },
  },
  setup(props, { root: { $api, $q }, emit }) {
    const selected = ref([]);
    const { payDate, isPrefetch } = loadPayDate($api);
    const paymentList = ref<Array<PayRow>>([]);
    const formData = {
      payDate: '',
      article: 0,
      perc: 0,
      amount: 0,
      remark: '',
    };

    const state = reactive({
      formData,
      formType: 'add' as FormType,
      formTargetKey: -1,
    });

    const submitLabel = computed(() =>
      state.formType === 'edit' ? 'Edit Payment' : 'Add Payment'
    );

    watch(isPrefetch, (prefetch) => {
      prefetch
        ? (state.formData.payDate = date.formatDate(
            toRaw(payDate).value,
            'DD/MM/YYYY'
          ))
        : undefined;
    });

    const { articleOptions } = loadArticleList($api, '23');
    const totalBalance = computed<number>(() =>
      props.selectDepts.reduce<number>((a, b: any) => a + b['tot-debt'], 0)
    );

    const paymentTotal = computed<number>(() =>
      paymentList.value.reduce((total, payment) => total + payment.betrag, 0)
    );

    const dialogElRef = ref<QDialog>();
    const hide = () => emit('hide');

    function calculateAmount() {
      state.formData.amount = -totalBalance.value * (state.formData.perc / 100);
    }

    function addPayment() {
      const article = articleOptions.value.find(
        (option) => option.value === state.formData.article
      );

      const paymentData: PayRow = {
        key: paymentList.value.length,
        artnr: state.formData.article,
        bezeich: article?.label.split(' - ')[1] || '',
        proz: state.formData.perc,
        betrag: state.formData.amount,
        'f-amt': 0,
        currency: 0,
        'curr-str': 'Rp',
        bemerk: state.formData.remark,
        'remain-amt': totalBalance.value - state.formData.amount,
        'fremain-amt': 0,
      };
      paymentList.value = [...paymentList.value, paymentData];
      state.formData = formData; // reset
    }

    function applyEditPayment() {
      const article = articleOptions.value.find(
        (option) => option.value === state.formData.article
      );

      paymentList.value = paymentList.value.map((a) => {
        if (a.key === state.formTargetKey) {
          return {
            key: a.key,
            artnr: state.formData.article,
            bezeich: article?.label.split(' - ')[1] || '',
            proz: state.formData.perc,
            betrag: state.formData.amount,
            'f-amt': 0,
            currency: 0,
            'curr-str': 'Rp',
            bemerk: state.formData.remark,
            'remain-amt': totalBalance.value - state.formData.amount,
            'fremain-amt': 0,
          };
        } else {
          return a;
        }
      });
    }

    watch(selected, (val) => {
      if (val.length === 1) {
        const target: PayRow = val[0];
        state.formType = 'edit';
        state.formTargetKey = target.key;
        state.formData = {
          ...state.formData,
          article: target.artnr,
          perc: target.proz,
          remark: target.bemerk,
          amount: target.betrag,
        };
      } else {
        state.formType = 'add';
      }
    });

    function save() {
      if (state.formType === 'edit') {
        applyEditPayment();
        state.formType = 'add';
        state.formTargetKey = -1;
        selected.value = [];
      } else {
        addPayment();
      }
      state.formData = formData;
    }

    async function insertPaymentDebt() {
      const [day, mounth, year] = formData.payDate.split('/');

      const body: ReqSettlePaymentDebt = {
        balance: paymentTotal.value,
        currArt: 1,
        fbalance: 0,
        foutstand: 0,
        foutstand1: 0,
        outstand: totalBalance.value + paymentTotal.value,
        outstand1: totalBalance.value,
        payDate: [mounth, day, year].join('/'),
        pvILanguage: '1',
        rundung: 0,
        userInit: '01',
        payList: {
          'pay-list': [...paymentList.value],
        },
        ageList: {
          'age-list': [...props.selectDepts],
        },
      };

      const response = await $api.accountReceivable.getSettlePaymentDebtPay(
        body
      );

      if (response.fFlag === 0) {
        // close dialog and toast toast
        dialogElRef.value?.hide();
        $q.notify({
          type: 'warning',
          message: 'Payment has been submited',
          timeout: 2000,
        });
      } else {
        // keep modal show error toast
        $q.notify({
          type: 'negative',
          message: `Something goes wrong (${response.msgStr}), try again`,
          timeout: 2000,
        });
      }
    }

    return {
      ...toRefs(state),
      insertPaymentDebt,
      hide,
      save,
      paymentList,
      calculateAmount,
      articleOptions,
      totalBalance,
      paymentTotal,
      selected,
      dialogElRef,
      submitLabel,
      paymentRecordListColumns,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
<style lang="scss" scoped>
.dialog {
  max-width: 800px !important;
}
</style>
