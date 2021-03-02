<template>
  <STable
    v-bind="$attrs"
    row-key="key"
    :columns="reminderLetterListColumns"
    :data="data"
    virtual-scroll
    :selected.sync="selected"
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    fixed-header
    fixed-width
  >
    <template v-slot:body="props">
      <q-tr
        class="cursor-pointer"
        :props="props"
        @click.ctrl="toggleSelectedRow(props.row)"
        @click.exact="toggleSingleRow(props.row)"
      >
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>
  </STable>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { reminderLetterListColumns } from '../tables/reminder-letter.table';

export default defineComponent({
  props: {
    data: { type: Array, required: true },
  },
  setup() {
    const pagination = ref();
    const selected = ref([]);

    // With Ctrl key pressed - multiple selections
    function toggleSelectedRow(row) {
      if (selected.value.length > 0) {
        // We can add another row
        // But if clicking one already selected, we'll remove it instead

        const matched = selected.value.find((item) => {
          return item.key === row.key;
        });
        if (matched) {
          // debugger;
          // This row was already selected, so remove it
          selected.value = selected.value.filter((s) => s.key !== matched.key);
        } else {
          // Add to selection
          // debugger;
          selected.value = [...selected.value, row];
        }
      } else {
        // First selection - add it
        // debugger;
        selected.value = [...selected.value, row];
      }
    }

    // With no key pressed - single selection
    function toggleSingleRow(row) {
      selected.value = [];
      // debugger;
      selected.value = [...selected.value, row];
    }

    return {
      toggleSingleRow,
      toggleSelectedRow,
      reminderLetterListColumns,
      pagination,
      selected,
    };
  },
});
</script>
