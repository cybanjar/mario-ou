<template>
  <section class="mt-7 full-height">
    <q-circular-progress
      v-if="isPreparing"
      indeterminate
      size="32px"
      color="primary"
      class="q-mt-md full-width"
    />
    <div v-else class="q-pa-md">
      <q-form @submit="onSearch">
        <SSelect
          label-text="Search By"
          :options="searchByOptions"
          v-model="searchBy"
          class="q-mt-md"
          emit-value
          map-options
        />

        <DateRangeInput
          v-if="searchBy === SearchBy.Date"
          label-text="Date"
          v-model="formData.date"
        />

        <SInput
          v-if="searchBy === SearchBy.ReservationNumber"
          v-model.number="formData.reservationNumber"
          label-text="Reservation Number"
        />

        <q-btn
          block
          color="primary"
          max-height="28"
          label="Search"
          class="q-my-md full-width"
          type="submit"
        />
      </q-form>

      <div class="q-mt-lg">
        <RemarkContent label="Reservation Name & Address">
          <template v-if="selectedRow">
            <div class="q-mb-md">{{ selectedRow.name }}</div>
            <div class="q-mb-md">{{ selectedRow.address }}</div>
            <div>{{ selectedRow.city }}</div>
          </template>
        </RemarkContent>

        <RemarkContent
          label="Reservation Remark"
          :value="selectedRow && selectedRow.bemerk"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  PropType,
  watch,
} from '@vue/composition-api';
import {
  SearchBy,
  PrepareReservationByCreationDate,
  MainReservation,
} from '../../models/reservation-by-creation-date/reservationByCreationDate.model';
import DateRangeInput, { DateRangeValue } from '../common/DateRangeInput.vue';

export interface SearchReservationByCreationDate {
  date: DateRangeValue;
  reservationNumber: number;
}

export default defineComponent({
  components: {
    DateRangeInput,
    RemarkContent: () => import('../../components/common/RemarkContent.vue'),
  },

  props: {
    selectedRow: { type: Object as PropType<MainReservation>, default: null },
  },

  setup(_, { emit, root: { $api } }) {
    const searchByOptions = ref([
      { value: SearchBy.Date, label: 'Date' },
      { value: SearchBy.ReservationNumber, label: 'Reservation Number' },
    ]);
    const formData = reactive<SearchReservationByCreationDate>({
      date: { start: new Date(), end: new Date() },
      reservationNumber: 0,
    });
    const searchBy = ref(SearchBy.Date);
    const prepareData = ref<PrepareReservationByCreationDate | null>(null);
    const isPreparing = ref(true);

    $api.frontOfficeReception
      .prepareReservationByCreationDate()
      .then((value) => {
        prepareData.value = value;
        formData.date.start = new Date(value.ciDate);
        formData.date.end = new Date(value.ciDate);
        isPreparing.value = false;
      });

    function resetFormData() {
      formData.date = {
        start: new Date(prepareData.value.ciDate),
        end: new Date(prepareData.value.ciDate),
      };
      formData.reservationNumber = 0;
    }

    watch(searchBy, () => {
      resetFormData();
    });

    function onSearch() {
      emit('onSearch', { ...formData });
    }

    return {
      isPreparing,
      formData,
      searchByOptions,
      searchBy,
      SearchBy,
      onSearch,
    };
  },
});
</script>
