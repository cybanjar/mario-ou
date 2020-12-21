<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Stock Item List</span>
      </div>
      <div class="bg-white q-pa-lg">
        <div class="q-px-sm">
          <STable
            row-key="index"
            :loading="state.isFetching"
            :columns="stockItemListColumns"
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
import {
  ResStockItemList,
  ReqStockItemList,
} from '../models/outstanding-and-balance.model';
import { stockItemListColumns } from '../tables/stock-item-list.table';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    requestData: { type: Object, default: null },
  },
  setup(props, { emit, root: { $api } }) {
    const hide = () => emit('hide');

    const state = reactive({
      data: [] as ResStockItemList[],
      isFetching: false,
    });

    watch(
      () => props.requestData,
      async (requestData) => {
        if (!requestData) return;

        state.isFetching = true;
        state.data = await $api.accountsPayable.getStockItemList(
          requestData as ReqStockItemList
        );
        state.isFetching = false;
      }
    );

    return {
      hide,
      stockItemListColumns,
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
