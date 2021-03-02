<template>
  <q-dialog v-bind="$attrs" v-on="$listeners" @show="tablePrep.refetch">
    <div class="dialog">
      <div class="dialog__header">
        <div class="dialog__title">View Bill</div>
      </div>
      <div class="bg-white q-pa-md">
        <STable
          :columns="detailBillColumns"
          :data="tablePrep.result"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          height="200px"
        />
      </div>
      <div class="dialog__footer q-pa-md row justify-center q-gutter-sm">
        <q-btn v-close-popup label="Ok" color="primary" type="submit" />
      </div>
    </div>
  </q-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, toRef } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformBillDetail } from '../utils/reformData';
import { detailBillColumns } from '../tables/detail-transaction-bill.table';
export default defineComponent({
  inheritAttrs: true,
  props: {
    billNumber: { type: Number, required: true },
    remark: { type: String },
  },
  setup(props, { root: { $api }, emit }) {
    const hide = () => emit('hide');
    const pagination = ref();
    const fieldComment = toRef(props, 'remark');

    const tablePrep = usePrepare(
      false,
      () => $api.accountReceivable.getARSubledgerDispFOBill(props.billNumber),
      undefined,
      (tempData) => reformBillDetail(tempData),
      []
    );

    function submit() {
      emit('submit', fieldComment.value);
    }

    return {
      fieldComment,
      submit,
      hide,
      pagination,
      tablePrep,
      detailBillColumns,
    };
  },
});
</script>
