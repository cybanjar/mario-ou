<template>
  <SDialog
    v-bind="$attrs"
    v-on="$listeners"
    class="q-m-md"
    @show="initPrep.refetch"
  >
    <template #title>
      Chart Of Account
    </template>
    <template #body>
      <STable
        row-key="key"
        :data="tablePrep.result"
        :columns="resvColumns"
        :pagination="{ rowsPerPage: 10 }"
        :rows-per-page-options="[10]"
      />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { resvColumns } from '../tables/aging-balance.table';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformReservation } from '../utils/reformData';
export default defineComponent({
  inheritAttrs: true,
  props: {
    billNo: { type: [Number, String], required: true },
  },
  setup(props, { root: { $api } }) {
    const initPrep = usePrepare(
      false,
      () =>
        $api.accountReceivable.getReadBill({
          caseType: 1,
          billNo: props.billNo,
          resNo: '',
          reslinNo: '',
          actFlag: '',
        }),
      ([data]) => {
        tablePrep.refetch(data.resnr, data.reslinnr);
      }
    );

    const tablePrep = usePrepare(
      false,
      (resNo, reslinNo) =>
        $api.accountReceivable.getBillDetail({
          resNo,
          reslinNo,
        }),
      undefined,
      (tempData) => reformReservation(tempData),
      []
    );

    return { resvColumns, tablePrep, initPrep };
  },
});
</script>
