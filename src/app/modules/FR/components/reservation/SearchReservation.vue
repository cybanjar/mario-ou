<template>
  <section class="mt-7 full-height">
    <q-circular-progress
      v-if="isPreparing"
      indeterminate
      size="32px"
      color="primary"
      class="q-mt-md full-width"
    />
    <q-form v-else @submit="onSearch" class="column full-height">
      <div class="q-pa-md">
        <SSelect
          label-text="Reservation Status"
          :options="reservationOptions"
          v-model="formData.reservationStatus"
          emit-value
          map-options
        />

        <q-checkbox
          dense
          v-model="earlyCheckin"
          label="Early Check-in"
          :disable="
            formData.reservationStatus !== ReservationStatus.Reservation
          "
        />
      </div>

      <q-separator />

      <div class="q-pa-md">
        <SSelect
          label-text="Search By"
          :options="searchByOptions"
          v-model="formData.searchBy"
          emit-value
          map-options
        />

        <SInput
          label-text="Guest Name"
          v-model="formData.guestName"
          v-if="
            formData.searchBy === SearchBy.GuestName ||
            (formData.reservationStatus ===
              ReservationStatus.ExpectedDeparture &&
              formData.searchBy === SearchBy.Date)
          "
        />

        <SInput
          label-text="Reservation Name"
          v-model="formData.reservationName"
          v-if="formData.searchBy === SearchBy.ReservationName"
        />

        <SInput
          label-text="Reservation Number"
          v-model.number="formData.reservationNumber"
          v-if="formData.searchBy === SearchBy.ReservationNumber"
        />

        <SInput
          label-text="Room Number"
          v-model="formData.roomNumber"
          v-if="
            formData.searchBy === SearchBy.RoomNumber ||
            ([
              ReservationStatus.InHouseGuest,
              ReservationStatus.ExpectedArrival,
              ReservationStatus.ExpectedDeparture,
            ].includes(formData.reservationStatus) &&
              [SearchBy.GuestName, SearchBy.ReservationName].includes(
                formData.searchBy
              )) ||
            (formData.reservationStatus ===
              ReservationStatus.ExpectedDeparture &&
              formData.searchBy === SearchBy.Date)
          "
        />

        <DateRangeInput
          v-if="
            [
              ReservationStatus.Reservation,
              ReservationStatus.OnlinePreCheckin,
            ].includes(formData.reservationStatus) &&
            [
              SearchBy.GuestName,
              SearchBy.ReservationName,
              SearchBy.Date,
            ].includes(formData.searchBy)
          "
          label-text="Arrival Date"
          :position-fixed="true"
          v-model="formData.arrivalDate"
        />

        <DateInput
          v-if="
            [
              ReservationStatus.InHouseGuest,
              ReservationStatus.ExpectedArrival,
            ].includes(formData.reservationStatus) &&
            formData.searchBy === SearchBy.Date
          "
          label-text="Arrival Date"
          v-model="formData.date"
          :disable="
            formData.reservationStatus === ReservationStatus.ExpectedArrival
          "
        />

        <DateInput
          v-if="
            formData.reservationStatus ===
              ReservationStatus.ExpectedDeparture &&
            [
              SearchBy.GuestName,
              SearchBy.ReservationName,
              SearchBy.Date,
            ].includes(formData.searchBy)
          "
          label-text="Departure Date"
          v-model="formData.date"
          :disable="true"
        />

        <q-checkbox
          v-model="formData.groupReservation"
          label="Group Reservation"
          class="q-mb-sm"
          dense
        />

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          class="q-mt-md full-width"
          type="submit"
        />
      </div>

      <q-separator />

      <q-scroll-area class="col-grow">
        <div class="q-pa-md">
          <div class="flex justify-between items-center q-mb-sm">
            <p class="q-mb-none">Reservation Remark</p>
            <q-btn
              v-if="selectedRow"
              flat
              round
              padding="none"
              @click="$emit('editReservationRemark')"
            >
              <q-icon name="mdi-pencil" size="20px" color="primary" />
            </q-btn>
          </div>
          <SInput
            type="textarea"
            readonly
            rows="3"
            :value="selectedRow && selectedRow.comments"
            input-style="white-space: pre-wrap"
          />

          <RemarkContent label="Main Reservation" class="q-mt-md">
            <template v-if="selectedRow">
              <div class="text-subtitle2 text-weight-bold text-black">
                {{ selectedRow['rsv-name'] }}
              </div>
              <div class="text-caption text-black">
                {{ selectedRow.address }}
              </div>
              <div class="text-caption text-black">{{ selectedRow.city }}</div>
            </template>

            <template #icon v-if="selectedRow">
              <q-btn flat round padding="none">
                <q-icon name="mdi-pencil" size="20px" color="primary" />
              </q-btn>
            </template>
          </RemarkContent>
        </div>
      </q-scroll-area>
    </q-form>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRefs,
  watch,
  ref,
  nextTick,
} from '@vue/composition-api';
import {
  PrepareReservation,
  Reservation,
  ReservationStatus,
  SearchBy,
  SearchByVoucherProps,
} from '../../models/reservation/reservation.model';
import DateRangeInput, { DateRangeValue } from '../common/DateRangeInput.vue';
import DateInput from '../common/DateInput.vue';
import RemarkContent from '../common/RemarkContent.vue';

export interface SearchReservation {
  reservationStatus: ReservationStatus;
  searchBy: SearchBy;
  guestName: string;
  reservationName: string;
  reservationNumber: number | string;
  roomNumber: string;
  arrivalDate: DateRangeValue;
  date: Date;
  groupReservation: boolean;
}

export default defineComponent({
  components: {
    DateRangeInput,
    DateInput,
    RemarkContent,
  },

  props: {
    isPreparing: { type: Boolean, default: false },
    prepareData: {
      type: Object as PropType<PrepareReservation>,
      default: null,
    },
    selectedRow: {
      type: Object as PropType<Reservation>,
      default: null,
    },
    searchByVoucher: {
      type: Object as PropType<SearchByVoucherProps>,
      default: null,
    },
  },

  setup(props, { emit }) {
    const formData = reactive<SearchReservation>({
      reservationStatus: ReservationStatus.Reservation,
      searchBy: SearchBy.GuestName,
      guestName: '',
      reservationName: '',
      reservationNumber: '',
      roomNumber: '',
      arrivalDate: { start: new Date(), end: new Date() },
      date: new Date(),
      groupReservation: false,
    });

    const { prepareData, searchByVoucher } = toRefs(props);

    watch(prepareData, (newValue) => {
      if (newValue) {
        formData.arrivalDate.start = new Date(newValue.fdate1);
        formData.arrivalDate.end = new Date(newValue.fdate2);
        formData.date = new Date(newValue.fdate1);
      }
    });

    watch(searchByVoucher, (newValue) => {
      if (newValue) {
        formData.reservationStatus = newValue.reservationStatus;
        formData.searchBy = SearchBy.ReservationNumber;
        nextTick(() => {
          // Use nextTick because we can't change reservationNumber directly while changing searchBy
          formData.reservationNumber = newValue.reservationNumber;
          onSearch();
        });
      }
    });

    /* Start setup form options */
    const reservationOptions = [
      { value: ReservationStatus.Reservation, label: 'Reservation' },
      {
        value: ReservationStatus.OnlinePreCheckin,
        label: 'Online Pre Check-in',
      },
      { value: ReservationStatus.InHouseGuest, label: 'In House Guest' },
      { value: ReservationStatus.ExpectedArrival, label: 'Expected Arrival' },
      {
        value: ReservationStatus.ExpectedDeparture,
        label: 'Expected Departure',
      },
    ];

    const searchByOptions = ref([
      { value: SearchBy.GuestName, label: 'Guest Name' },
      { value: SearchBy.ReservationName, label: 'Reservation Name' },
      { value: SearchBy.ReservationNumber, label: 'Reservation Number' },
      { value: SearchBy.Date, label: 'Arrival Date' },
      { value: SearchBy.RoomNumber, label: 'Room Number' },
    ]);
    /* End setup form options */

    const earlyCheckin = ref(false);
    watch(earlyCheckin, (newValue) => emit('changeCheckin', newValue));

    function resetFormData() {
      formData.guestName = '';
      formData.reservationName = '';
      formData.reservationNumber = null;
      formData.roomNumber = null;
      formData.arrivalDate.start = new Date(prepareData.value.fdate1);
      formData.arrivalDate.end = new Date(prepareData.value.fdate2);
      formData.date = new Date(prepareData.value.fdate1);
    }

    const { searchBy, reservationStatus } = toRefs(formData);
    watch(searchBy, () => resetFormData());
    watch(reservationStatus, (newValue) => {
      if (newValue === 4) searchByOptions.value[3].label = 'Departure Date';
      else searchByOptions.value[3].label = 'Arrival Date';

      resetFormData();
    });

    function onSearch() {
      emit('search', { ...formData });
    }

    return {
      formData,
      reservationOptions,
      searchByOptions,
      earlyCheckin,
      onSearch,
      ReservationStatus,
      SearchBy,
    };
  },
});
</script>
