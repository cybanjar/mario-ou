<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <div>
          <q-checkbox
            v-model="inputParams.inclMaster"
            label="Including Master Bills"
          />
          <q-checkbox v-model="inputParams.byRoom" label="Sort By Room" />
        </div>

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-my-md full-width"
          @click="onSearch"
        />
      </div>
    </q-drawer>
    <div class="q-ma-md">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="onResets">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
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
          :row-key="(row) => `${row.rechnr}${row.artnr}${row.amount}`"
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
import { tableHeaders } from './tables/reportOverCreditLimit.table';

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
      inputParams: {
        inclMaster: false,
        byRoom: false,
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;

      // const getPrepared = await $api.frontOfficeCashier.cancelJournPrepare();
    });

    const onSearch = async () => {
      state.table.isFetching = true;

      const inputParam: any = state.inputParams;
      const resBody = {
        inclMaster: inputParam.inclMaster,
        byRoom: inputParam.byRoom,
      };

      const res = await $api.frontOfficeCashier.overCreditLimitList(resBody);

      state.table.data = res;
      state.table.isFetching = false;
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.byRoom = false;
      inputParam.inclMaster = false;

      state.table.data = [];
    };

    return {
      tableHeaders,
      onSearch,
      onResets,
      ...toRefs(state),
    };
  },
});
</script>
