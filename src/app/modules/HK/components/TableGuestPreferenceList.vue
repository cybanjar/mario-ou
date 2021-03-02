<template>
  <STable
    row-key="key"
    :columns="columns"
    :data="data"
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    selection="multiple"
    class="guest-pref-list virtual-scroll-sticky-header"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable>
                <q-item-section @click="clickEdit(props.row.key)"
                  >Edit</q-item-section
                >
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
import { mainColumns } from '../tables/mainGuestPrefList.table';

export default defineComponent({
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(_, { emit }) {
    const clickEdit = (id) => emit('edit', id);
    return { columns: mainColumns, clickEdit };
  },
});
</script>
<style>
.guest-pref-list tr th:first-child [role='checkbox'] {
  width: 100%;
}
</style>
