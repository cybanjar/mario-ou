<template>
  <q-page class="q-pa-lg">
    <div class="row items-start">
      <SharedModuleActions />
      <div class="col-3 q-ml-xl">
        <q-form @submit="onSearch">
          <SInput v-model="roomNumber" label-text="Memo Room Number">
            <q-btn
              type="submit"
              flat
              padding="xs"
              size="12px"
              icon="mdi-magnify"
            />
          </SInput>
        </q-form>
      </div>
    </div>
    <TableMemoRoomNumber
      :is-fetching="isFetching"
      :rows="tableRows"
      :selected-row.sync="selectedRow"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import type { MemoRoomNumber } from './models/memo-room-number/memoRoomNumber.model';

export default defineComponent({
  components: {
    TableMemoRoomNumber: () =>
      import('./components/memo-room-number/TableMemoRoomNumber.vue'),
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
  },
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      tableRows: [] as MemoRoomNumber[],
      roomNumber: '',
      selectedRow: null as MemoRoomNumber | null,
    });

    async function onSearch() {
      state.isFetching = true;

      state.tableRows = await $api.frontOfficeReception.searchMemoRoomNumber({
        memoZinr: state.roomNumber || ' ',
      });

      state.isFetching = false;
    }

    onSearch();

    return {
      ...toRefs(state),
      onSearch,
    };
  },
});
</script>
