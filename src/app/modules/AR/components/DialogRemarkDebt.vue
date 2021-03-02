<template>
  <q-dialog v-bind="$attrs" v-on="$listeners">
    <div class="dialog">
      <q-form @submit="submit">
        <div class="dialog__header">
          <div class="dialog__title">A/R Payment Comment</div>
        </div>
        <div class="bg-white q-pa-md">
          <div class="q-px-sm">
            <SInput v-model="fieldComment" type="string"></SInput>
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
          <q-btn label="Ok" color="primary" type="submit" />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { ResPaymentDebtPayList } from '../models/payment.model';
export default defineComponent({
  inheritAttrs: true,
  props: {
    payment: {
      type: Array as () => Array<ResPaymentDebtPayList>,
      required: true,
    },
  },
  setup(props, { emit, listeners }) {
    const fieldComment = ref(props.payment[0].remark);

    function submit() {
      emit('submit', fieldComment.value);
      // listeners?.hide();
    }

    return {
      fieldComment,
      submit,
    };
  },
});
</script>
