<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Select Guest Profile Type</span>
      </div>

      <div class="dialog__body">
        <q-form @submit="onSubmit">
          <div class="bg-white q-pa-md">
            <q-option-group
              :options="options"
              type="radio"
              v-model="guestProfileType"
            />
          </div>

          <div class="dialog__footer">
            <q-btn
              label="Cancel"
              color="primary"
              outline
              class="q-mr-sm"
              v-close-popup
            />
            <q-btn label="Ok" color="primary" type="submit" />
          </div>
        </q-form>
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, inject } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import {
  GuestProfile,
  guestProfileListKey,
  GuestProfileType,
} from '../../models/guest-profile/guestProfile.model';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    data: { type: Object as PropType<GuestProfile>, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const options = [
      { label: 'Individual', value: GuestProfileType.Individual },
      { label: 'Company', value: GuestProfileType.Company },
      { label: 'Travel Agent', value: GuestProfileType.TravelAgent },
    ];

    const guestProfileType = ref<GuestProfileType | null>(null);

    if (showDialog.value && props.data) {
      guestProfileType.value = props.data.karteityp;
    }

    const { GET_GUEST_PROFILE_LIST } = inject(guestProfileListKey);
    async function onSubmit() {
      if (props.data.karteityp === guestProfileType.value) {
        showDialog.value = false;
        return;
      }

      $q.dialog({
        title: 'Confirm',
        message: 'Confirm your changes of the Guest Type',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        $q.loading.show();
        $api.frontOfficeReception
          .changeGuestProfileType(props.data.gastnr, guestProfileType.value)
          .then((message) => {
            $q.loading.hide();
            $q.notify({ type: 'positive', message });
            showDialog.value = false;
            GET_GUEST_PROFILE_LIST();
          });
      });
    }

    return {
      showDialog,
      guestProfileType,
      options,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 288px !important;

  &__body {
    max-height: 328px !important;
    overflow: auto;
  }
}
</style>
