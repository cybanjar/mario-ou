<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchReminderLetter @search="search"></SearchReminderLetter>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="getData">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>
      <TableReminderLetter
        :reminder-letter-list="reminderLetterList"
        :is-fetching="isFetching"
      ></TableReminderLetter>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { getTableData } from './utils/getTableData';
import { ReminderLetterList } from './models/reminder-letter.model';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      searchParam: {
        fromArt: -1,
        toArt: -1,
      },
      isFetching: false,
      reminderLetterList: [] as ReminderLetterList[],
    });

    async function getData() {
      if (state.searchParam.toArt >= 0 && state.searchParam.fromArt >= 0) {
        state.isFetching = true;
        state.reminderLetterList = [];
        const responseData = await $api.accountReceivable.getRemainList({
          fromArt: state.searchParam.fromArt,
          toArt: state.searchParam.toArt,
        });
        state.reminderLetterList = getTableData(responseData);
        state.isFetching = false;
      }
    }

    function search(fromArt, toArt) {
      state.searchParam = { fromArt, toArt };
      getData();
    }

    return {
      ...toRefs(state),
      search,
      getData,
    };
  },
  components: {
    SearchReminderLetter: () => import('./components/SearchReminderLetter.vue'),
    TableReminderLetter: () => import('./components/TableReminderLetter.vue'),
  },
});
</script>
