<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">View In Detail</span>
      </div>
      <div class="bg-white q-pa-lg">
        <div class="q-px-sm">
          <STable
            row-key="artnr"
            :loading="state.isFetching"
            :columns="purchaseOrderDetailColumns"
            :data="state.data"
            :virtual-scroll="true"
            :pagination="{ rowsPerPage: 0 }"
            :rows-per-page-options="[0]"
            :virtual-scroll-sticky-size-start="28"
            :class="state.data.length > 0 && 'purchase-order-detail-table'"
            class="virtual-scroll-sticky-header"
            :selected.sync="selected"
            @row-click="onRowClick"
          />

          <SRemarkLeftDrawer
            label="Remark"
            :value="state.remark.trim()"
            class="q-mt-md"
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
import { defineComponent, reactive, watch, ref } from '@vue/composition-api';
import { ResPurchaseOrderDetail } from '../models/purchase-order.model';
import { purchaseOrderDetailColumns } from '../tables/purchase-order-detail.table';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    documentNumber: { type: String, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const hide = () => emit('hide');

    const state = reactive({
      data: [] as ResPurchaseOrderDetail[],
      isFetching: false,
      remark: '',
    });

    watch(
      () => props.documentNumber,
      async (documentNumber) => {
        if (!documentNumber || documentNumber.length < 1) return;

        state.isFetching = true;
        state.data = await $api.accountsPayable.getPurchaseOrderDetail({
          userInit: '01',
          docuNr: documentNumber,
        });
        state.isFetching = false;
      }
    );

    const selected = ref<ResPurchaseOrderDetail[]>([]);

    function onRowClick(_, row: ResPurchaseOrderDetail) {
      selected.value = [row];
      state.remark = row.remark;
    }

    return {
      hide,
      selected,
      onRowClick,
      purchaseOrderDetailColumns,
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

.purchase-order-detail-table {
  max-height: 60vh;
}
</style>
