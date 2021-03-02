<template>
  <SDialog v-bind="$attrs" v-on="$listeners" @show="refetch">
    <template #title> G/L Journal - RefNo {{ refno }} </template>
    <template #body>
      <STable
        :data="data"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        fixed-header
        height="280px"
        :columns="viewTransColumns"
        :is-fixed="true"
        row-key="key"
      ></STable>
    </template>
    <template #action-ok>
      <q-btn label="Close" color="primary" v-close-popup />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { reformTransaction } from '../utils/reformData';
import { viewTransColumns } from '../tables/journal-view.tables';
export default defineComponent({
  props: {
    jnr: { type: Number, required: true },
    refno: { type: String, required: true },
    recordId: { type: Number, required: true },
  },
  setup(props, { root: { $api } }) {
    const pagination = ref();
    const { result: data, refetch } = usePrepare(
      true,
      () =>
        $api.common.getGLViewTransaction({
          jnr: props.jnr,
          refno: props.refno,
          srecid: props.recordId,
        }),
      undefined,
      (data) => reformTransaction(data),
      []
    );

    onMounted(() => refetch());

    return { data, refetch, viewTransColumns, pagination };
  },
});
</script>
