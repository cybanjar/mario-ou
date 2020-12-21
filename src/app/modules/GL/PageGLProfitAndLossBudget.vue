<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <section class="mt-7">
        <div class="q-pa-md">
          <q-btn-toggle
            v-model="year"
            spread
            no-caps
            dense
            toggle-color="primary"
            :options="[
              { label: 'This Year', value: 'budget' },
              { label: 'Next Year', value: 'debit' },
            ]"
          />
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
        :data="tableData[year]"
        :rows-per-page-options="[20, 30, 40]"
        :pagination.sync="pagination"
        class="table-profit-loss"
      >
        <template #header-cell-actions="props">
          <q-th :props="props" class="fixed-col right">
            {{ props.col.label }}
          </q-th>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
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

      <DialogProfitLossBudget
        v-if="selectedBudget !== null"
        :dialog="dialog"
        :year="year"
        :budget="selectedBudget"
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
  mapMonthsFromString,
} from './tables/profiltLossBudget.table';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<any>({
      isFetching: true,
      year: 'budget',
      tableData: {
        budget: [],
        debit: [],
      },
      dialog: false,
      selectedBudget: null,
    });

    const mapTableData = (coa, monthKey) => ({
      ...coa,
      months: {
        ...mapMonthsFromString(coa[monthKey]),
      },
    });

    onMounted(async () => {
      const res = await $api.generalLedger.glCOABudgetCreateList();
      res.forEach((coa) => {
        state.tableData.budget.push(mapTableData(coa, 'budget'));
        state.tableData.debit.push(mapTableData(coa, 'debit'));
      });
      state.isFetching = false;
    });

    const onDialog = (val) => {
      state.dialog = val;
    };

    const onEdit = (budget) => {
      state.selectedBudget = budget;
      onDialog(true);
    };

    const onUpdate = (budget) => {
      const dataIdx = state.tableData[state.year].findIndex(
        (data) => data.fibukonto === budget.fibukonto
      );
      state.tableData[state.year].splice(
        dataIdx,
        1,
        mapTableData(budget, state.year)
      );
      onDialog(false);
    };

    return {
      tableHeaders,
      pagination: { rowsPerPage: 20 },
      onEdit,
      onDialog,
      onUpdate,
      ...toRefs(state),
    };
  },
  components: {
    SearchPosting: () => import('./components/SearchPosting.vue'),
    DialogProfitLossBudget: () =>
      import('./components/DialogProfitLossBudget.vue'),
  },
});
</script>

<style lang="scss" scoped>
::v-deep .table-profit-loss {
  max-height: 75vh;

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }
}
</style>
