<template>
  <STable
    :loading="isFetching"
    :columns="newPOHeaders"
    :data="rows"
    hide-bottom
  >
    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">
        {{ props.col.label }}
      </q-th>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple @click="onDeleteItem(props.row.recId)">
                <q-item-section>Delete Item</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { newPOHeaders } from '../tables/purchaseOrder.table';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    rows: { type: Array, required: true },
  },
  setup(_, { emit }) {
    function onDeleteItem(recId) {
      emit('delete', recId);
    }

    return {
      newPOHeaders,
      onDeleteItem,

      pagination: { rowsPerPage: 10 },
    };
  },
});
</script>
