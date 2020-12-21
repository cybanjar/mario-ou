<template>
  <STable
    row-key="key"
    :loading="isFetching"
    :columns="reminderLetterListColumns"
    :data="reminderLetterList"
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    selection="multiple"
    @row-click="onRowClick"
  ></STable>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { reminderLetterListColumns } from '../tables/reminder-letter.table';

export default defineComponent({
  props: {
    reminderLetterList: { type: Array, required: true },
    isFetching: { type: Boolean, required: true },
  },
  setup() {
    return { reminderLetterListColumns };
  },
});
</script>
