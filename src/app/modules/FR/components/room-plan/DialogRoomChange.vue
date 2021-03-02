<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-form @submit="onSave">
        <q-card-section>
          <SInput
            label-text="Room Number"
            v-model="roomNumber"
            input-classes="q-mb-none"
            hide-bottom-space
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" outline v-close-popup />
          <q-btn label="OK" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
import { date } from 'quasar';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { RoomReservation } from '../../models/room-plan/roomPlan.model';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    reservation: {
      type: Object as PropType<RoomReservation['reservation']>,
      default: null,
    },
    ciDate: { type: Date, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const roomNumber = ref(props.reservation?.zinr ?? '');

    async function onSave() {
      $q.loading.show();

      const check = await $api.frontOfficeReception.changeRoomCheck({
        pvILanguage: 1,
        recid1: props.reservation.recid1,
        movedRoom: roomNumber.value,
        ciDate: date.formatDate(props.ciDate, 'MM/DD/YY'),
      });
      if (!check) {
        await changeRoom();
        return;
      }

      $q.loading.hide();
      if (check.includes('&Q')) {
        $q.dialog({
          title: 'Question',
          message: check.replace('&Q', ''),
          cancel: 'No',
          ok: 'Yes',
          persistent: true,
        }).onOk(async () => {
          $q.loading.show();
          await changeRoom();
        });
      } else $q.notify({ type: 'negative', message: check });
    }

    async function changeRoom() {
      const change = await $api.frontOfficeReception.changeRoom({
        pvILanguage: 1,
        recid1: props.reservation.recid1,
        movedRoom: roomNumber.value,
        ciDate: date.formatDate(props.ciDate, 'MM/DD/YY'),
      });
      $q.loading.hide();
      if (change) $q.notify({ type: 'info', message: change });

      showDialog.value = false;
      emit('save');
    }

    return {
      showDialog,
      roomNumber,
      onSave,
    };
  },
});
</script>
