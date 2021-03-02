<template>
  <section class="mt-7 q-pa-md">
    <div v-if="loading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <q-form v-else @submit="onSave">
      <SDateInput label-text="Payment Date" v-model="data.payDate"></SDateInput>
      <q-separator></q-separator>
      <SelectFilter
        label-text="Payment Article"
        :options="articles"
        option-value="value"
        option-label="label"
        v-model="data.article"
      ></SelectFilter>
      <SInput
        label-text="In Percentage(%)"
        v-model.number="data.perc"
        type="number"
        :decimals="1"
        step="0.1"
        auto-complete="off"
        @blur="inferField('perc')"
        hide-bottom-space
      ></SInput>
      <SInputMoney
        label-text="In Amount"
        v-model.number="data.amount"
        hide-bottom-space
        @blur="inferField('amount')"
      ></SInputMoney>
      <SInput
        label-text="Payment Remark"
        hide-bottom-space
        v-model="data.remark"
        type="string"
      ></SInput>
      <q-btn
        class="full-width"
        type="submit"
        :label="label"
        color="primary"
        inline
      />
      <q-separator></q-separator>
      <slot></slot>
    </q-form>
  </section>
</template>
<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

export type FormState = {
  key?: number;
  isEdit?: boolean;
  isDelete?: boolean;
  payDate?: Date;
  article?: number;
  perc?: number;
  amount?: number;
  remark?: string;
  description?: string;
  fAmt?: string;
};

export const initState: FormState = {
  isEdit: false,
  isDelete: false,
  payDate: undefined,
  description: undefined,
  article: undefined,
  perc: undefined,
  amount: undefined,
  remark: undefined,
};
export default defineComponent<any>({
  model: {
    prop: 'data',
    event: 'on-update',
  },
  props: {
    data: { type: Object, required: true },
    totalBalance: { type: Number, required: true },
    label: { type: String, required: false, default: 'Submit' },
    articles: { type: Array, required: true },
    loading: { type: Boolean, required: true },
    billDate: { type: Date, required: false },
    transferDate: { type: Date, required: false },
  },
  setup(props, { root: { $q }, emit }) {
    function onSave() {
      if (
        typeof props.data.amount != 'undefined' &&
        typeof props.data.perc != 'undefined' &&
        typeof props.data.article != 'undefined' &&
        typeof props.data.payDate != 'undefined'
      ) {
        if (props.data.payDate > props.billDate) {
          $q.notify({
            type: 'warning',
            message: 'Wrong Payment Date as earlier than A/R billing date',
          });
        } else if (props.data.payDate <= props.transferDate) {
          $q.notify({
            type: 'warning',
            message:
              'Wrong Posting Date: Older than last Transfer Date to G\\L',
          });
        } else {
          const article = props.articles.find(
            (s) => s.value === props.data.article
          );
          emit('on-save', {
            ...props.data,
            description: article.article_name,
            fAmt: article.currency,
          });
        }
      } else {
        $q.notify({
          type: 'warning',
          message: 'Please fill all input to add Payment',
        });
      }
    }

    function inferField(name: string) {
      let in_percentage = 0;
      let in_amount = 0;
      if (name === 'amount') {
        const amount = props.data.amount || 0;
        in_percentage = parseFloat(
          ((amount / (props.totalBalance * -1)) * 100).toFixed(2)
        );
        in_percentage = Math.round(in_percentage * 100) / 100;
        emit('on-update', {
          ...props.data,
          perc: in_percentage,
        });
      }
      if (name === 'perc') {
        const perc = props.data.perc || 0;
        in_amount = props.totalBalance * (perc / 100);
        in_amount = Math.round(in_amount * 100) / 100;
        in_amount = in_amount * -1;
        emit('on-update', {
          ...props.data,
          amount: in_amount,
        });
      }
    }

    return {
      onSave,
      inferField,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
