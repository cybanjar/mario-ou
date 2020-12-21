<template>
  <q-table
    separator="cell"
    dense
    v-bind="$attrs"
    v-on="$listeners"
    :hide-pagination="noPagination"
    :rows-per-page-options="$attrs['rows-per-page-options'] || [0]"
    :pagination="$attrs.pagination || { page: 1, rowsPerPage: 0 }"
    class="s-table"
  >
    <template v-slot:loading>
      <div style="z-index: 5;">
        <q-inner-loading showing color="primary" />
      </div>
    </template>

    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

    <template
      v-for="slot in Object.keys($scopedSlots)"
      :slot="slot"
      slot-scope="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>

    <template v-slot:no-data>
      <div class="full-width column flex-center text-grey q-pa-lg">
        <q-icon size="2em" name="mdi-alert-circle-outline" />
        <span>Set the filter value then press search</span>
      </div>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: false,
  props: {
    noPagination: { type: Boolean, default: false },
  },
});
</script>
