<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <q-form @submit="onSearch" class="q-mb-xl">
        <SInput label-text="Guest Name" v-model="formData.guestName" />

        <DateInput
          label-text="Arrival Date"
          v-model="formData.arrivalDate"
          position-fixed
        />

        <SInput
          label-text="Reservation Number"
          input-class="text-right"
          v-model.number="formData.reservationNumber"
        />

        <q-btn
          block
          color="primary"
          max-height="28"
          label="Search"
          class="q-mt-md full-width"
          type="submit"
        />
      </q-form>

      <RemarkContent label="Reservation Name & Address">
        <template v-if="selectedRow">
          <div class="q-mb-md">{{ selectedRow.rsvname }}</div>
          <div class="q-mb-md">{{ selectedRow.address }}</div>
          <div>{{ selectedRow.city }}</div>
        </template>
      </RemarkContent>

      <RemarkContent
        label="Reservation Remark"
        :value="selectedRow && selectedRow.bemerk"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from '@vue/composition-api';
import { ReinstateCancelledReservation } from '../../models/reinstate-cancelled-reservation/reinstateCancelledReservation.model';
import DateInput from '../common/DateInput.vue';

export interface SearchReinstateCancelledReservation {
  guestName: string | null;
  arrivalDate: Date | null;
  reservationNumber: number;
}

export default defineComponent({
  components: {
    RemarkContent: () => import('../common/RemarkContent.vue'),
    DateInput,
  },
  props: {
    selectedRow: {
      type: Object as PropType<ReinstateCancelledReservation>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const formData = reactive<SearchReinstateCancelledReservation>({
      reservationNumber: 0,
      arrivalDate: null,
      guestName: '',
    });

    function onSearch() {
      emit('search', { ...formData });
    }

    return {
      formData,
      onSearch,
    };
  },
});
</script>
