<template>
  <q-page>
    <div class="q-ma-md">
      <div class="q-mb-md">
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <div>
        <STable
          :loading="table.isFetching"
          :columns="tableHeaders"
          :data="table.data"
          :rows-per-page-options="[10, 13, 16]"
          :pagination.sync="table.pagination"
          row-key="indexFoc"
        >
        </STable>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
} from '@vue/composition-api';
import { tableHeaders } from './tables/reportDepartedUnbalanceGuest.table';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
    });

    onMounted(async () => {
      state.table.isFetching = true;

      const res = await $api.frontOfficeCashier.checkoutUnbalancedBills();

      res.map((e, i) => {
        e.indexFoc = i;
      });

      state.table.data = res;
      state.table.isFetching = false;
    });

    return {
      tableHeaders,
      ...toRefs(state),
    };
  },
});
</script>
