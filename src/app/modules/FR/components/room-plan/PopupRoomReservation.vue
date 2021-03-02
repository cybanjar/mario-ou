<template>
  <q-card>
    <q-card-section>
      <div class="row">
        <RemarkContent
          label="Guest Info"
          :value="guestInfo"
          class="remark-content remark-content--guest-info"
        />
        <RemarkContent
          label="Reservation Remark"
          :value="reservationRemark"
          class="remark-content remark-content--reservation-remark"
        />
        <q-icon
          name="mdi-dots-vertical"
          class="cursor-pointer q-ml-sm"
          size="16px"
        >
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Edit Main Reservation</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Edit This Reservation</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Check-in the guest</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="showDialogRoomChange">
                <q-item-section>Room Change</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </div>
    </q-card-section>

    <q-inner-loading :showing="isFetching" color="primary" />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref } from '@vue/composition-api';
import { date } from 'quasar';
import {
  RoomColumn,
  roomPlanKey,
  RoomReservation,
} from '../../models/room-plan/roomPlan.model';
import RemarkContent from '../common/RemarkContent.vue';

export default defineComponent({
  components: {
    RemarkContent,
  },
  props: {
    room: { type: Object as PropType<RoomColumn>, required: true },
    roomNumber: { type: String, required: true },
    currentDate: { type: Date, required: true },
  },
  setup(props, { root: { $api, $q } }) {
    const guestInfo = ref('');
    const reservationRemark = ref('');
    const isFetching = ref(true);

    let reservation: RoomReservation['reservation'];
    let flagOutorder: boolean;

    $api.frontOfficeReception
      .roomReservation({
        pvILanguage: 1,
        currDate: date.formatDate(props.currentDate, 'MM/DD/YY'),
        i: props.room.startIndex + 1, // Index start from 1
        zinr: props.roomNumber,
        gstatus: props.room.status,
        recid1: props.room.reservationId,
      })
      .then((data) => {
        isFetching.value = false;
        guestInfo.value = data.nEdit;
        reservationRemark.value = data.cEdit;
        reservation = data.reservation;
        flagOutorder = data.flagOutorder;
      });

    const { SHOW_DIALOG_ROOM_CHANGE } = inject(roomPlanKey);
    function showDialogRoomChange() {
      if (!reservation) {
        $q.notify({
          type: 'negative',
          message: 'No reservation record available',
        });
      } else if (reservation.resstatus === 11 || reservation.resstatus === 13) {
        $q.notify({
          type: 'negative',
          message: 'Changes not for the Room Sharer.',
        });
      } else if (reservation['active-flag'] === 0 && flagOutorder) {
        $q.notify({
          type: 'negative',
          message: 'Off-Market room number can not be changed.',
        });
      } else {
        SHOW_DIALOG_ROOM_CHANGE(reservation);
      }
    }

    return {
      guestInfo,
      reservationRemark,
      isFetching,
      showDialogRoomChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.remark-content {
  &--guest-info {
    width: 212px;
  }

  &--reservation-remark {
    margin-left: 24px;
    width: 260px;
  }

  &::v-deep .remark {
    border-color: $primary;
    color: $grey-7;
    white-space: pre-wrap;
  }
}
</style>
