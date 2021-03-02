<template>
  <STable
    row-key="$_index"
    :columns="tableHeaders"
    :data="rowsWithIndex"
    :loading="isFetching"
    :selected.sync="selected"
    @row-click="onRowClick"
    no-pagination
    class="sticky-header confirmation-letter"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <div class="row justify-between no-wrap">
          <span class="ellipsis">{{ props.value }}</span>
          <q-badge v-if="props.row.grpflag === true" class="q-ml-sm">
            G
            <q-tooltip anchor="top middle" self="center middle">
              Group Reservation
            </q-tooltip>
          </q-badge>
        </div>
      </q-td>
    </template>

    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right cursor-pointer">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Edit Main Reservation</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Print Confirmation Letter</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>

    <template #body-cell-rsv-name="props">
      <q-td :props="props">
        <div class="ellipsis">{{ props.value }}</div>
      </q-td>
    </template>
  </STable>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { ConfirmationLetter } from '../../models/confirmation-letter/confirmationLetter.model';
import { useSelectedRow } from '../../composables/selectedRow';
import { tableHeaders } from '../../tables/confirmation-letter/confirmationLetter.table';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    rows: {
      type: Array as PropType<ConfirmationLetter[]>,
      required: true,
    },
    selectedRow: {
      type: Object as PropType<ConfirmationLetter>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(props, emit);

    return {
      tableHeaders,
      selected,
      rowsWithIndex,
      onRowClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.confirmation-letter::v-deep {
  max-height: 484px;

  tr td:nth-child(2) > div {
    width: 140px;
  }
}
</style>
