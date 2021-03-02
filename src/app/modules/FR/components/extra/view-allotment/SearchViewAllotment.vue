<template>
  <q-drawer side="left" bordered :width="250" :value="true" persistent>
    <section class="mt-7 full-height">
      <q-circular-progress
        v-if="isPreparing"
        indeterminate
        size="32px"
        color="primary"
        class="q-mt-md full-width"
      />
      <template v-else>
        <q-form class="q-pa-md" @submit="onSearch">
          <SInput
            label-text="Company / Agent Name"
            class="input-with-button"
            v-model="formData.name"
            placeholder="All"
            readonly
          >
            <template v-if="formData.name" #append>
              <q-icon
                name="mdi-close-circle"
                @click.stop="formData.name = ''"
                class="cursor-pointer"
              />
            </template>

            <template #after>
              <q-btn
                icon="mdi-magnify"
                size="xs"
                unelevated
                color="primary"
                @click="dialogSelectGuest.open()"
              />
            </template>
          </SInput>
          <DateRangeInput
            label-text="Date"
            v-model="formData.date"
            position-fixed
            :error="!validateDateRange"
            error-message="Maximum possible interval = 31 days"
            hide-bottom-space
          />
          <div class="q-gutter-y-md q-mb-md">
            <q-checkbox
              label="Show Detail"
              v-model="formData.showDetail"
              dense
            />
            <q-checkbox
              label="Show In-house"
              v-model="formData.showInHouse"
              dense
            />
            <q-checkbox
              label="Show Reservation"
              v-model="formData.showReservation"
              dense
            />
            <q-checkbox
              label="Show Cancelled"
              v-model="formData.showCancelled"
              dense
            />
          </div>
          <SSelect
            label-text="Room Type"
            v-model="formData.roomType"
            :options="roomTypeOptions"
            emit-value
            map-options
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
      </template>
    </section>

    <DialogSelectGuest
      :show.sync="dialogSelectGuest.state.show"
      :key="dialogSelectGuest.state.key"
      :guest-profile-type="GuestProfileType.Company"
      @selectedGuest="(data) => (formData.name = data.name)"
    />
  </q-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api';
import { date } from 'quasar';
import { SelectItem } from '~/app/shared/models/select.model';
import { useDisposableDialog } from '../../../composables/disposableDialog';
import { GuestProfileType } from '../../../models/guest-profile/guestProfile.model';
import DateRangeInput, {
  DateRangeValue,
} from '../../common/DateRangeInput.vue';

export interface SearchViewAllotment {
  name: string;
  date: DateRangeValue;
  showDetail: boolean;
  showInHouse: boolean;
  showReservation: boolean;
  showCancelled: boolean;
  roomType: string;
}

export default defineComponent({
  components: {
    DateRangeInput,
    DialogSelectGuest: () => import('../../common/DialogSelectGuest.vue'),
  },
  setup(_, { emit, root: { $api, $route } }) {
    const isPreparing = ref(true);
    const formData = reactive<SearchViewAllotment>({
      name: '',
      date: {
        start: new Date(),
        end: date.addToDate(new Date(), { days: 30 }),
      },
      showDetail: true,
      showInHouse: true,
      showReservation: true,
      showCancelled: false,
      roomType: '-ALL-',
    });
    const roomTypeOptions = ref<SelectItem<string>[]>([]);

    const guestNumber = Number($route.params.id);

    (async () => {
      const [guest, roomType] = await Promise.all([
        $api.frontOfficeReception.readGuest(guestNumber),
        $api.frontOfficeReception.loadRoomType(),
      ]);
      isPreparing.value = false;
      formData.name = guest.name;

      roomTypeOptions.value = [
        { value: '-ALL-', label: '-ALL-' },
        ...roomType.map((item) => ({
          value: item.kurzbez,
          label: `${item.kurzbez} - ${item.bezeichnung}`,
        })),
      ];
    })();

    const validateDateRange = computed(() => {
      const diff = date.getDateDiff(
        formData.date.end,
        formData.date.start,
        'days'
      );
      return diff <= 30;
    });

    function onSearch() {
      if (!validateDateRange.value) return;
      emit('search', { ...formData });
    }

    return {
      isPreparing,
      formData,
      roomTypeOptions,
      validateDateRange,
      onSearch,
      dialogSelectGuest: useDisposableDialog(),
      GuestProfileType,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-with-button::v-deep {
  .q-field--outlined .q-field__control {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 0;

    &::before {
      border-right: none;
    }
  }

  .q-field__after {
    padding-left: 0;

    .q-btn {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 3px;
      border-top-left-radius: 0;
      border-top-right-radius: 3px;
      height: 26px;

      &__wrapper {
        padding: 0 8px;
      }
    }
  }
}
</style>
