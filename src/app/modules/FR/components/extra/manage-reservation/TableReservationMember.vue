<template>
  <div>
    <STable
      row-key="$_index"
      no-data-text="Please select one row from Reservation List table"
      :columns="tableHeaderManageReservationMember"
      :loading="isFetching"
      :data="rowsWithIndex"
      :selected.sync="selected"
      @row-click="onRowClick"
      no-pagination
      class="sticky-header"
      style="max-height: 500px"
    >
      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="row justify-between">
            <span class="col q-pr-xl">{{ props.value }}</span>
            <div class="q-ml-xl">
              <TooltipIcon
                v-if="props.row.resstatus === 11 || props.row.resstatus === 13"
                name="mdi-account-multiple"
                :tooltip-text="
                  props.row['l-zuord3'] === 0
                    ? 'Room Sharer Guest'
                    : 'Accompany Guest'
                "
              />
            </div>
          </div>
        </q-td>
      </template>
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
                  @click="
                    dialogGuestProfile.open({
                      type: props.row.karteityp,
                      guestNumber: props.row.gastnrmember,
                    })
                  "
                >
                  <q-item-section>View Guest Profile</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Modify Reservation</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Cancel Reservation</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Reservation Log</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>View Expected Revenue</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Make Room Sharer</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-td>
      </template>
    </STable>

    <DialogGuestProfile
      :show.sync="dialogGuestProfile.state.show"
      :key="dialogGuestProfile.state.key"
      :type="dialogGuestProfile.state.data.type"
      :guest-number="dialogGuestProfile.state.data.guestNumber"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { ReservationMemberData } from '../../../models/extra/manage-reservation/manageReservation.model';
import { useSelectedRow } from '../../../composables/selectedRow';
import { useDisposableDialog } from '../../../composables/disposableDialog';
import { tableHeaderManageReservationMember } from '../../../tables/extra/manage-reservation/manageReservationMember.table';
import TooltipIcon from '../../common/TooltipIcon.vue';
import { DialogGuestProfileProps } from '../../../models/common/dialogGuestProfile.model';
import { GuestProfileType } from '../../../models/guest-profile/guestProfile.model';

export default defineComponent({
  components: {
    TooltipIcon,
    DialogGuestProfile: () => import('../../common/DialogGuestProfile.vue'),
  },
  props: {
    rows: {
      type: Array as PropType<ReservationMemberData[]>,
      required: true,
    },
    selectedRow: {
      type: Object as PropType<ReservationMemberData>,
      default: null,
    },
    isFetching: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(
      props,
      emit,
      true
    );
    return {
      rowsWithIndex,
      selected,
      onRowClick,

      tableHeaderManageReservationMember,

      dialogGuestProfile: useDisposableDialog<DialogGuestProfileProps>({
        guestNumber: null,
        type: GuestProfileType.Individual,
      }),
    };
  },
});
</script>
