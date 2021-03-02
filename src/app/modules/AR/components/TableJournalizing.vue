<template>
  <STable
    row-key="key"
    :columns="journalizingColumns"
    :data="data"
    virtual-scroll
    :selected.sync="selected"
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    fixed-header
    fixed-width
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:body="props">
      <q-tr
        class="cursor-pointer"
        :props="props"
        @click="toggleSingleRow(props.row)"
      >
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon
                    class="inline"
                    name="mdi-account-outline"
                    color="gray"
                  />
                </q-item-section>

                <q-item-section @click="onView(props.row)">
                  View Bill</q-item-section
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
import { defineComponent, ref, watch } from '@vue/composition-api';
import { journalizingColumns } from '../tables/journalizing-main.table';

export default defineComponent({
  inheritAttrs: true,
  props: {
    loading: { type: Boolean, required: true },
    data: { type: Array, required: true },
  },
  setup(props) {
    const selected = ref([]);
    const pagination = ref();

    watch(
      () => props.loading,
      (value) => {
        if (value === true) {
          selected.value = [];
        }
      }
    );

    function onView() {
      console.log('view bill');
    }

    // With no key pressed - single selection
    function toggleSingleRow(row) {
      selected.value = [row];
    }

    return {
      journalizingColumns,
      selected,
      onView,
      pagination,
      toggleSingleRow,
    };
  },
});
</script>
