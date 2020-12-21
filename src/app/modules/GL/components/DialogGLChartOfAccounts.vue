<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Account's
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <STable
          :loading="isLoading"
          :columns="tableHeaders"
          :data="columns"
          :rows-per-page-options="[0]"
          :pagination.sync="pagination"
          hide-bottom
        />

        <div class="total-budget flex q-mt-md">
          <span>Total Budget</span>
          <span>{{ totalBudget }}</span>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="$emit('onDialog', false)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

interface State {
  isLoading: boolean;
  totalBudget: number;
  columns: { month: string; actual: string; budget: string }[];
}

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    accountId: { type: String, default: null },
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      totalBudget: 0,
      columns: [],
    });

    const fetchViewValues = async (accountId) => {
      state.isLoading = true;
      state.columns = [];
      const [[, resBudget], resActual] = await Promise.all([
        $api.generalLedger.getViewBudgetValue(accountId),
        $api.generalLedger.getViewActualValue(accountId),
      ]);

      if (resBudget) {
        resBudget.bList['b-list'].forEach((budget, idx) => {
          state.columns.push({
            month: budget.monat,
            budget: formatThousands(budget.wert),
            actual: formatThousands(resActual[idx].wert),
          });
        });
        state.totalBudget = resBudget.totBudget;
      }
      state.isLoading = false;
    };

    watch(
      () => props.accountId,
      (accountId, prev) => {
        if (accountId && accountId !== prev) {
          fetchViewValues(accountId);
        }
      }
    );

    const dialogModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialog', val);
      },
    });

    const tableHeaders = [
      {
        label: 'Month',
        field: 'month',
        align: 'left',
      },
      {
        label: 'Actual Value',
        field: 'actual',
      },
      {
        label: 'Budget Value',
        field: 'budget',
      },
    ];

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.total-budget {
  border-radius: 4px;
  border: 1px solid $primary;

  span {
    display: inline-block;
    padding: 4px 11px;

    &:first-child {
      border-right: 1px solid $primary;
    }

    &:last-child {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
