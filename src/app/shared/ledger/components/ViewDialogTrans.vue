<template>
  <SDialog v-bind="$attrs" v-on="$listeners" @show="refetch">
    <template #title> G/L Journal - RefNo {{ transaction.refno }} </template>
    <template #body>
      <DialogJournalTable :data="dataRef" :is-fixed="true"></DialogJournalTable>
    </template>
    <template #action-ok>
      <q-btn label="Close" color="primary" v-close-popup />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent, toRefs, ref, onMounted } from '@vue/composition-api';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { LedgerData } from '../helpers/reformData.helper';
import { reformTransaction } from '../../helpers/reformData.helper';
export default defineComponent({
  props: {
    transaction: { type: Object as () => LedgerData, required: true },
  },
  setup(props, { root: { $api } }) {
    const dataRef = ref([]);
    const { data, refetch } = usePrepare(
      true,
      () =>
        $api.common.getGLViewTransaction({
          jnr: props.transaction.jnr,
          refno: props.transaction.refno,
          srecid: props.transaction.recordId,
        }),
      (data) => {
        dataRef.value = reformTransaction(data, []);
      }
    );

    onMounted(() => refetch());

    return { ...toRefs(data), dataRef, refetch };
  },
  components: {
    DialogJournalTable: () => import('../../components/DialogJournalTable.vue'),
  },
});
</script>
