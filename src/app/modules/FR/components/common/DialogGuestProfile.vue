<template>
  <div>
    <DialogGuestProfileIndividual
      :show.sync="dialog"
      :guest-number="guestNumber"
      v-if="type === GuestProfileType.Individual"
    />
    <DialogGuestProfileCompany
      :show.sync="dialog"
      :type="type"
      :guest-number="guestNumber"
      v-else
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { GuestProfileType } from '../../models/guest-profile/guestProfile.model';

export default defineComponent({
  components: {
    DialogGuestProfileIndividual: () =>
      import('./DialogGuestProfileIndividual.vue'),
    DialogGuestProfileCompany: () => import('./DialogGuestProfileCompany.vue'),
  },
  props: {
    show: { type: Boolean, required: true },
    type: { type: Number as PropType<GuestProfileType>, required: true },
    guestNumber: { type: Number, default: null },
  },
  setup(props, { emit }) {
    return {
      dialog: useModelWrapper(props, emit, 'show'),
      GuestProfileType,
    };
  },
});
</script>
