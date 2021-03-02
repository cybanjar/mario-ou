<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" persistent :value="true">
      <div class="q-pa-md">
        <RemarkContent
          label="Reservation From & Address"
          remark-style="min-height: 50px"
        >
          <template v-if="selectedRow">
            <div class="q-mb-md">{{ selectedRow.name }}</div>
            <div class="q-mb-md">{{ selectedRow['res-address'] }}</div>
            <div>{{ selectedRow['res-city'] }}</div>
          </template>
        </RemarkContent>
        <RemarkContent
          label="Reservation Remark"
          remark-style="min-height: 50px"
          :value="selectedRow && selectedRow['res-bemerk']"
        />
      </div>
    </q-drawer>

    <div class="q-pa-md">
      <SharedModuleActions />
      <TableGroupCheckIn
        :rows="tableRows"
        :is-fetching="isFetching"
        :selected-row.sync="selectedRow"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { date } from 'quasar';
import type { GroupCheckIn } from './models/group-check-in/groupCheckIn.model';

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    RemarkContent: () => import('./components/common/RemarkContent.vue'),
    TableGroupCheckIn: () =>
      import('./components/group-check-in/TableGroupCheckIn.vue'),
  },
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      tableRows: [] as GroupCheckIn[],
      selectedRow: null as GroupCheckIn | null,
    });

    async function getData() {
      state.isFetching = true;

      const { fdate } = await $api.frontOfficeReception.getHTParam0({
        casetype: 2,
        inpParam: 87,
      });

      state.tableRows = await $api.frontOfficeReception.getGroupCheckIn({
        languageCode: 1,
        ciDate: date.formatDate(fdate, 'MM/DD/YY'),
      });

      state.isFetching = false;
    }

    getData();

    return {
      ...toRefs(state),
    };
  },
});
</script>
