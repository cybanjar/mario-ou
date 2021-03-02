<template>
  <q-menu auto-close anchor="top left" self="top right">
    <q-list>
      <q-item clickable v-ripple @click="blockRoom">
        <q-item-section>Block Room</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="releaseBlockedRoom">
        <q-item-section>Release Blocked Room</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="addToQueueingRoom">
        <q-item-section>Add To Queueing Room</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="SHOW_DIALOG_QUEUEING_ROOMS">
        <q-item-section>View Queueing Room</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="incognito">
        <q-item-section>Incognito</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from '@vue/composition-api';
import {
  Reservation,
  reservationKey,
} from '../../models/reservation/reservation.model';

export default defineComponent({
  props: {
    row: { type: Object as PropType<Reservation>, required: true },
  },
  setup(props, { root: { $api, $q } }) {
    const { SET_RESERVATION_LIST, SHOW_DIALOG_QUEUEING_ROOMS } = inject(
      reservationKey
    );

    function dialogInformation(message: string) {
      $q.dialog({ title: 'Information', message });
    }

    function dialogConfirm(message: string) {
      return $q.dialog({
        title: 'Confirm',
        message,
        cancel: 'No',
        ok: 'Yes',
        persistent: true,
      });
    }

    function notifySuccess(message: string) {
      $q.notify({ type: 'positive', message });
    }

    function blockRoom() {
      if (
        props.row['active-flag'] >= 1 ||
        (props.row['active-flag'] === 0 && props.row.resstatus === 13)
      ) {
        dialogInformation(
          'Room Blocking is not possible for Inhouse Guest/Room Sharer/Checked Out Guest'
        );
      } else if (props.row.zinr.length < 1) {
        dialogInformation('Room Number not yet defined');
      } else {
        dialogConfirm('Do you really want to block this room?').onOk(() => {
          $q.dialog({
            title: 'Blocking Reason',
            prompt: {
              model: '',
              isValid: (val: string) => val.length > 0,
              type: 'text',
            },
            cancel: true,
            persistent: true,
          }).onOk(async (data: string) => {
            $q.loading.show();
            const message = await $api.frontOfficeReception.arlBlockRoom(
              props.row['recid-resline'],
              data
            );
            $q.loading.hide();
            if (message) dialogInformation(message);
            else notifySuccess('Room has already been blocked');
          });
        });
      }
    }

    function releaseBlockedRoom() {
      if (props.row.zinr.length < 1) {
        dialogInformation('Room Number not yet assigned');
      } else {
        dialogConfirm('Do you really want to release this room?').onOk(
          async () => {
            $q.loading.show();
            const error = await $api.frontOfficeReception.arlReleaseRoom(
              props.row['recid-resline']
            );
            $q.loading.hide();
            if (error === 2) notifySuccess('Room has already been released');
            else if (error === 1)
              dialogInformation('Room has not yet been blocked');
          }
        );
      }
    }

    function addToQueueingRoom() {
      if (props.row.zinr.length < 1) {
        dialogInformation('Room Number not yet assigned');
      } else if (props.row['zinr-bgcol'] === 6) {
        dialogInformation('The room is already in the queueing room list.');
      } else if (
        props.row['active-flag'] === 0 &&
        props.row['zinr-bgcol'] === 10
      ) {
        dialogConfirm(
          'Do you want to add a queue for this room to be cleaned?'
        ).onOk(async () => {
          $q.loading.show();
          await $api.frontOfficeReception.arlAddQueueRoom(props.row.zinr);
          $q.loading.hide();
          notifySuccess('Done and added to queueing rooms');
          SET_RESERVATION_LIST((data) => {
            const newData = data;
            const index = newData.findIndex(
              (item) => item['recid-resline'] === props.row['recid-resline']
            );
            newData[index]['zinr-bgcol'] = 6;

            return newData;
          });
        });
      }
    }

    function incognito() {
      if (props.row['active-flag'] === 2) {
        dialogInformation('This feature is not for departed guest.');
      } else if (props.row['l-zuordnung3'] === 0 && props.row.resstatus !== 8) {
        dialogConfirm(
          props.row.pseudofix
            ? 'Incognito Guest : Status ON. Switch it OFF ?'
            : 'Incognito Guest : Status OFF. Switch it ON ?'
        ).onOk(async () => {
          $q.loading.show();
          await $api.frontOfficeReception.incognitoGuest(
            props.row.resnr,
            props.row.reslinnr
          );
          $q.loading.hide();
          SET_RESERVATION_LIST((data) => {
            const newData = data;
            const index = newData.findIndex(
              (item) => item['recid-resline'] === props.row['recid-resline']
            );
            newData[index].pseudofix = !newData[index].pseudofix;

            return newData;
          });
        });
      }
    }

    return {
      blockRoom,
      releaseBlockedRoom,
      addToQueueingRoom,
      incognito,
      SHOW_DIALOG_QUEUEING_ROOMS,
    };
  },
});
</script>
