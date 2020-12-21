<template>
  <div>
    <div class="q-pa-md">
      <q-form @submit="onSearch">
        <SelectFilter
          label-text="Article Number"
          :options="articleOptions"
          option-value="value"
          option-label="label"
          v-model="formData.article"
          hide-bottom-space
          lazy-rules
          :rules="[(val) => val || 'Please select article']"
        />
        <SInput
          label-text="Billing Number"
          v-model="formData.billingNumber"
          hide-bottom-space
          :rules="[]"
        ></SInput>
        <SInput
          label-text="Balance"
          v-model="formData.balance"
          hide-bottom-space
          :rules="[]"
        ></SInput>
        <SInput
          label-text="By Date"
          hide-bottom-space
          v-model="formData.byDate"
          :rules="['date']"
        ></SInput>
        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
      </q-form>
    </div>
    <q-separator style="border-width: 1px;" class="q-mt-md" />
    <div class="q-pa-md">
      <q-btn
        block
        @click="onRemark"
        :disable="disableRemark"
        color="primary"
        max-height="28"
        label="Remark"
        class="q-mb-md full-width"
      />
      <SInput
        label-text="Bill Receiver Address"
        type="textarea"
        rows="5"
        :value="debtPayRemarks"
        disable
      />
      <SRemarkLeftDrawer label="Balance" :value="totalBalance" />
    </div>
  </div>
</template>
<script lang="ts">
import { date } from 'quasar';
import {
  defineComponent,
  reactive,
  computed,
  watch,
  toRaw,
} from '@vue/composition-api';
import { ResPaymentDebtPayList } from '../models/payment.model';
import { formatterMoney } from '../../../helpers/formatterMoney.helper';
import { loadArticleList } from '../shared/article-list.comp';
import { loadPayDate } from '../shared/pay-date.comp';

export default defineComponent({
  props: {
    selectedRemark: { type: String },
    selectedRow: {
      type: Array as () => Array<ResPaymentDebtPayList>,
      default: [],
    },
  },
  setup(props, { root: { $api }, emit }) {
    const { payDate, isPrefetch } = loadPayDate($api);
    const formData = reactive({
      article: null,
      preloadData: false,
      billingReceiver: '',
      billingNumber: '',
      balance: 0,
      byDate: '',
    });

    watch(isPrefetch, (prefetch) => {
      prefetch
        ? (formData.byDate = date.formatDate(toRaw(payDate).value, 'DD/MM/YYYY'))
        : undefined;
    });

    // Start setup form options
    const { articleOptions } = loadArticleList($api);

    const debtPayRemarks = computed(() =>
      disableRemark ? props.selectedRow[0]?.remarks : ''
    );
    const totalBalance = computed(() => {
      const sumBalance = (props.selectedRow as ResPaymentDebtPayList[]).reduce(
        (accumulator, currentValue) => accumulator + currentValue['tot-debt'],
        0
      );
      return formatterMoney(sumBalance);
    });

    const disableRemark = computed(() => props.selectedRow.length !== 1);
    // End setup form options

    function onSearch() {
      emit('onSearch', formData);
    }

    function onRemark() {
      emit('onRemark', true, debtPayRemarks.value);
    }

    return {
      formData,
      articleOptions,
      onSearch,
      debtPayRemarks,
      totalBalance,
      disableRemark,
      onRemark,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
