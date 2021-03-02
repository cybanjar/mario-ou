<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchReminderLetter @search="search"></SearchReminderLetter>
    </q-drawer>
    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TableReminderLetter
        :data="tablePrep.result"
        :loading="tablePrep.data.isLoading"
      ></TableReminderLetter>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { getTableData } from './utils/getTableData';
import { ReminderLetterList } from './models/reminder-letter.model';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      searchParam: {
        fromArt: 1,
        toArt: 26,
      },
      isFetching: false,
      reminderLetterList: [] as ReminderLetterList[],
    });

    const tablePrep = usePrepare(
      false,
      () =>
        $api.accountReceivable.getRemainList({
          fromArt: state.searchParam.fromArt,
          toArt: state.searchParam.toArt,
        }),
      undefined,
      (tempData) => getTableData(tempData),
      []
    );

    function search(fromArt, toArt) {
      state.searchParam = { fromArt, toArt };
      tablePrep.refetch();
    }

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          tablePrep.refetch();
          break;
          break;
        default:
          break;
      }
    }

    return {
      ...toRefs(state),
      mapActions,
      search,
      tablePrep,
    };
  },
  components: {
    SearchReminderLetter: () => import('./components/SearchReminderLetter.vue'),
    TableReminderLetter: () => import('./components/TableReminderLetter.vue'),
        SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),

  },
});
</script>
