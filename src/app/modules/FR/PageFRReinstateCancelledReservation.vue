<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" :value="true" persistent>
      <SearchReinstateCancelledReservation
        @search="onSearch"
        :selected-row="selectedRow"
      />
    </q-drawer>

    <div class="q-pa-md">
      <SharedModuleActions />
      <TableReinstateCancelledReservation
        :is-fetching="isFetching"
        :rows="tableRows"
        :selected-row.sync="selectedRow"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { date } from 'quasar';
import { ReinstateCancelledReservation } from './models/reinstate-cancelled-reservation/reinstateCancelledReservation.model';
import type { SearchReinstateCancelledReservation } from './components/reinstate-cancelled-reservation/SearchReinstateCancelledReservation.vue';

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    SearchReinstateCancelledReservation: () =>
      import(
        './components/reinstate-cancelled-reservation/SearchReinstateCancelledReservation.vue'
      ),
    TableReinstateCancelledReservation: () =>
      import(
        './components/reinstate-cancelled-reservation/TableReinstateCancelledReservation.vue'
      ),
  },

  setup(_, { root: { $api } }) {
    /* Init Data */
    const state = reactive({
      isFetching: false,
      tableRows: [] as ReinstateCancelledReservation[],
      selectedRow: null as ReinstateCancelledReservation | null,
    });

    async function onSearch(searches: SearchReinstateCancelledReservation) {
      state.isFetching = true;
      state.tableRows = await $api.frontOfficeReception.searchReinstateCancelledReservation(
        {
          fname: searches.guestName || ' ',
          fdate: date.formatDate(searches.arrivalDate) || null,
          fresnr: searches.reservationNumber || 0,
        }
      );
      state.isFetching = false;
    }

    return {
      ...toRefs(state),
      onSearch,
    };
  },
});
</script>
