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
    <template #loading>
      <div style="z-index: 5">
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

    <template #no-data>
      <div class="full-width column flex-center text-grey q-pa-lg">
        <q-icon size="2em" name="mdi-alert-circle-outline" />
        <span>{{ noDataText }}</span>
      </div>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: false,
  setup(_, { refs }) {
    const tooltip = reactive({
      target: false,
      value: null,
    });

    function updateTooltip({ selector, text }) {
      tooltip.target = selector;
      tooltip.value = text;
      (refs.hint as any).show();
    }
    return { tooltip: toRefs(tooltip), updateTooltip };
  },
  props: {
    noPagination: { type: Boolean, default: false },
    fixedHeader: { type: Boolean, default: false },
    fixedWidth: { type: Boolean, default: false },
    height: { type: [String, Boolean], default: false },
    noDataText: {
      type: String,
      default: 'Set the filter value then press search',
    },
  },
});
</script>
<style lang="scss">
.s-table.fixed-width {
  .q-table {
    table-layout: fixed;
  }
}

// hover on tr but not if selected
.q-table tbody tr:not(.selected):not(.q-tr--no-hover):hover {
  td {
    color: white;
    background: #5fa4ff;
    &:before {
      background: #5fa4ff;
      /* create a new stacking context */
      position: absolute;
      z-index: -1; /* to be below the parent element */
    }

    &.fixed-col {
      background: #5fa4ff !important;
    }
  }
  &:not(.expanded):nth-of-type(even) .fixed-col.q-td {
    background: #5fa4ff !important;
  }
}

.my-sticky-dynamic {
  /* height or max-height is important */
  &.full .q-table__middle {
    height: calc(100vh - 150px);
  }

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #fff;
  }
  thead {
    position: relative;
  }
  thead tr th {
    position: sticky;
    z-index: 100;
  }
  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
  thead tr:first-child th {
    top: 0;
  }
}
</style>
