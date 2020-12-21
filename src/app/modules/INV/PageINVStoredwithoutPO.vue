<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchStoredwithoutPO />
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="false"
        class="table-accounting-date"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
} from '@vue/composition-api';
import { tableHeaders } from './tables/StoredwithoutPO.table';
import { log } from 'util';
export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;
    const state = reactive({
      data: [],
      isFetching: false
    });

    const onRowClick = (val) => {
      console.log(val);
    };
    return {
      ...toRefs(state),
      onRowClick,
      tableHeaders,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchStoredwithoutPO: () =>
      import('./components/SearchStoredwithoutPO.vue'),
  },
});
</script>

<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
</style>
