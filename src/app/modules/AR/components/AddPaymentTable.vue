<template>
  <STable
    row-key="key"
    :columns="columns"
    :data="data"
    :selected.sync="selected"
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    virtual-scroll
    fixed-header
    fixed-width
    v-on="$listeners"
    height="450px"
  >
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item
                @click="$emit('delete', { key: props.row.key })"
                clickable
                v-ripple
              >
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { paymentRecordListColumns } from '../tables/payment-record.table';

export default defineComponent({
  props: {
    data: { type: Array, required: false, default: () => [] },
  },
  setup() {
    const selected = ref([]);
    const pagination = ref();
    return {
      columns: paymentRecordListColumns,
      selected,
      pagination,
    };
  },
});
</script>
