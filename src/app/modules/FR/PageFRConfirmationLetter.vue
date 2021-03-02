<template>
  <q-page>
    <q-drawer ide="left" bordered :width="250" :value="true" persistent>
      <SearchConfirmationLetter @search="onSearch" />
    </q-drawer>

    <div class="q-pa-md">
      <SharedModuleActions />

      <TableConfirmLetter
        :is-fetching="isFetching"
        :rows="tableRows"
        :selected-row.sync="selectedRow"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { ConfirmationLetter } from './models/confirmation-letter/confirmationLetter.model';
import type { SearchConfirmationLetter } from './components/confirmation-letter/SearchConfirmationLetter.vue';
import { date } from 'quasar';

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    SearchConfirmationLetter: () =>
      import('./components/confirmation-letter/SearchConfirmationLetter.vue'),
    TableConfirmLetter: () =>
      import('./components/confirmation-letter/TableConfirmLetter.vue'),
  },

  setup(_, { root: { $api } }) {
    // init data
    const state = reactive({
      isFetching: false,
      tableRows: [] as ConfirmationLetter[],
      selectedRow: null as ConfirmationLetter | null,
    });

    async function onSearch(searches: SearchConfirmationLetter) {
      state.isFetching = true;
      state.tableRows = await $api.frontOfficeReception.searchConfirmationLetter(
        searches.guestName || ' ',
        date.formatDate(searches.date, 'MM/DD/YY')
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
