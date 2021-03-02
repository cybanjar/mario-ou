<template>
  <div>
    <STable
      row-key="$_index"
      :loading="isFetching"
      :columns="tableHeaderHistory"
      :data="rowsWithIndex"
      :selected.sync="selected"
      @row-click="onRowClick"
      :rows-per-page-options="[10, 13, 16]"
      :pagination="{ rowsPerPage: 16 }"
    >
      <template #header-cell-actions="props">
        <q-th :props="props" class="fixed-col right">
          {{ props.col.label }}
        </q-th>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="fixed-col right cursor-pointer">
          <q-icon name="mdi-dots-vertical" size="16px">
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="dialogBillMember.open(props.row)"
                >
                  <q-item-section>Display Bill Member</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="$emit('openEditDialog', props.row)"
                >
                  <q-item-section>Modify</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-td>
      </template>
    </STable>

    <DialogBillMember
      :show.sync="dialogBillMember.state.show"
      :key="dialogBillMember.state.key"
      :guest-profile-history-data="dialogBillMember.state.data"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { useSelectedRow } from '../../../composables/selectedRow';
import { tableHeaderHistory } from '../../../tables/extra/guest-profile-guest-history/guestProfileGuestHistory.table';
import { GuestProfileHistory } from '../../../models/extra/guest-profile-guest-history/guestProfileGuestHistory.model';
import { useDisposableDialog } from '../../../composables/disposableDialog';

export default defineComponent({
  components: {
    DialogBillMember: () => import('./DialogBillMember.vue'),
  },
  props: {
    isFetching: { type: Boolean, default: false },
    rows: {
      type: Array as PropType<GuestProfileHistory[]>,
      required: true,
    },
    selectedRow: {
      type: Object as PropType<GuestProfileHistory>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(props, emit);

    return {
      tableHeaderHistory,
      rowsWithIndex,
      selected,
      onRowClick,
      dialogBillMember: useDisposableDialog<GuestProfileHistory>(null),
    };
  },
});
</script>
