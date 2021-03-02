<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" :value="true" persistent>
      <SearchReservationByCreationDate
        :selected-row="selectedRow"
        @onSearch="onSearch"
      />
    </q-drawer>

    <div class="q-pa-md">
      <SharedModuleActions />
      <TableReservationByCreationDate
        :is-fetching-main-reservation="isFetchingMainReservation"
        :is-fetching-reservation-member="isFetchingReservationMember"
        :rows="mainReservationTableRows"
        :rows-reservation-member="reservationMemberTableRows"
        :selected-row.sync="selectedRow"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api';
import { date } from 'quasar';
import {
  ReservationMember,
  MainReservation,
  ReqReservationByCreationDate,
} from './models/reservation-by-creation-date/reservationByCreationDate.model';
import type { SearchReservationByCreationDate } from './components/reservation-by-creation-date/SearchReservationByCreationDate.vue';

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    SearchReservationByCreationDate: () =>
      import(
        './components/reservation-by-creation-date/SearchReservationByCreationDate.vue'
      ),
    TableReservationByCreationDate: () =>
      import(
        './components/reservation-by-creation-date/TableReservationByCreationDate.vue'
      ),
  },

  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetchingMainReservation: false,
      isFetchingReservationMember: false,
      mainReservationTableRows: [] as MainReservation[],
      reservationMemberTableRows: [] as ReservationMember[],
      selectedRow: null as MainReservation | null,
    });

    let latestSearches: SearchReservationByCreationDate = null;

    async function onSearch(searches: SearchReservationByCreationDate) {
      latestSearches = searches;

      state.isFetchingMainReservation = true;

      const requestData: ReqReservationByCreationDate = {
        caseType: 1,
        fromDate: date.formatDate(searches.date.start, 'MM/DD/YY'),
        toDate: date.formatDate(searches.date.end, 'MM/DD/YY'),
        resnr: 0,
        gastnr: 0,
        searchResno: searches.reservationNumber || 0,
      };

      state.mainReservationTableRows = await $api.frontOfficeReception.searchMainReservation(
        requestData
      );

      state.isFetchingMainReservation = false;
    }

    async function onSearchReservationMember(reservationNumber) {
      state.isFetchingReservationMember = true;

      const requestData: ReqReservationByCreationDate = {
        caseType: 2,
        fromDate: date.formatDate(latestSearches.date.start, 'MM/DD/YY'),
        toDate: date.formatDate(latestSearches.date.end, 'MM/DD/YY'),
        resnr: reservationNumber,
        gastnr: 0,
        searchResno: 0,
      };

      state.reservationMemberTableRows = await $api.frontOfficeReception.searchReservationMember(
        requestData
      );

      state.isFetchingReservationMember = false;
    }

    watch(
      () => state.selectedRow,
      (newValue) => {
        if (newValue) {
          onSearchReservationMember(newValue.resnr);
        }
      }
    );

    return {
      ...toRefs(state),
      onSearch,
    };
  },
});
</script>
