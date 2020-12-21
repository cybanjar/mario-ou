<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Display Payment</span>
      </div>
      <div class="bg-white q-pa-lg">
        <div class="q-px-sm">
          <STable
            :loading="state.isFetching"
            :columns="displayPaymentColumns"
            :data="state.data"
            :pagination="{ rowsPerPage: 0 }"
            :rows-per-page-options="[0]"
          />
        </div>
      </div>
      <div class="dialog__footer">
        <q-btn label="Close" color="primary" v-close-popup />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from '@vue/composition-api';
import { ResDisplayPayment } from '../models/outstanding-and-balance.model';
import { displayPaymentColumns } from '../tables/display-payment.table';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    recid: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api } }) {
    const hide = () => emit('hide');

    const state = reactive({
      data: [] as ResDisplayPayment[],
      isFetching: false,
    });

    watch(
      () => props.recid,
      async (recid) => {
        if (!recid) return;

        state.isFetching = true;
        state.data = await $api.accountsPayable.getDisplayPayment({
          apRecid: recid,
        });
        state.isFetching = false;
      }
    );

    return {
      hide,
      displayPaymentColumns,
      state,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  min-width: 80vw;
  width: 520px;
}
</style>
