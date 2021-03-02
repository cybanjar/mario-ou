<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Guest Reservation List</span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-pa-lg">
          <STable
            :loading="isFetching"
            :columns="tableHeaderReservation"
            :data="rows"
            no-data-text="No Data"
          />
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn label="Ok" color="primary" v-close-popup />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { GuestReservationList } from '../../../models/extra/guest-profile-guest-history/guestReservationList.model';
import { tableHeaderReservation } from '../../../tables/extra/guest-profile-guest-history/dialogReservationList.table';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    selectedRow: {
      type: Object as PropType<GuestReservationList>,
      default: null,
    },
  },
  setup(props, { emit, root: { $api, $route } }) {
    const state = reactive({
      isFetching: true,
      rows: [] as GuestReservationList[],
    });
    const showDialog = useModelWrapper(props, emit, 'show');

    if (showDialog.value) {
      $api.frontOfficeReception
        .guestReservationList($route.params.id)
        .then((value) => {
          state.rows = value;
          state.isFetching = false;
        });
    }

    return {
      ...toRefs(state),
      showDialog,
      tableHeaderReservation,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 780px !important;

  &__body {
    max-height: 420px !important;
    overflow: auto;
  }
}
</style>
