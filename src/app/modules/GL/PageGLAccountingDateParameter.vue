<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <section class="mt-7">
        <div class="q-pa-md">
          General Parameter Setup
        </div>
      </section>
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="tableData"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        hide-bottom
        class="table-accounting-date"
      >
        <template #header="props">
          <q-tr>
            <q-th colspan="6">Accounting Parameter Date</q-th>
          </q-tr>

          <q-tr>
            <q-th
              v-for="th in groupHeaders(props.cols)"
              :key="th.name"
              :props="props"
            >
              {{ th.label }}
            </q-th>
            <q-th key="actions" />
          </q-tr>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="fixed-col right">
            <q-icon
              v-if="
                [1003, 1014, 269, 1035, 1123, 1118].includes(props.row.paramnr)
              "
              name="mdi-dots-vertical"
              size="16px"
            >
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple @click="onEdit(props.row)">
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
      </STable>

      <DialogAccountingDateParameter
        :dialog="dialog"
        :selected-param="selectedParam"
        @onDialog="onDialog"
        @onUpdate="onUpdate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
} from '@vue/composition-api';
import {
  tableHeaders,
  tableColumns,
} from './tables/accountingDateParameter.table';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<any>({
      isFetching: true,
      dialog: false,
      selectedParam: null,
      tableData: [],
    });

    onMounted(async () => {
      const res = await $api.generalLedger.getGLHtparam();
      state.tableData = tableColumns(res);
      state.isFetching = false;
    });

    const onDialog = (val) => {
      state.dialog = val;
    };

    const onEdit = (param) => {
      state.selectedParam = param;
      onDialog(true);
    };

    const onUpdate = (paramnr, paramInput) => {
      const dataIdx = state.tableData.findIndex(
        (data) => data.paramnr === paramnr
      );
      state.tableData[dataIdx].values = paramInput;
      onDialog(false);
    };

    const groupHeaders = (cols) => cols.filter((col) => col.name !== 'actions');
    const actionHeader = (cols) => cols.find((col) => col.name === 'actions');

    return {
      ...toRefs(state),
      tableHeaders,
      onEdit,
      onDialog,
      onUpdate,
      groupHeaders,
      actionHeader,
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },
  components: {
    SearchPosting: () => import('./components/SearchPosting.vue'),
    DialogAccountingDateParameter: () =>
      import('./components/DialogAccountingDateParameter.vue'),
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

    &:last-child th {
      top: 27px;
    }
  }
}
</style>
