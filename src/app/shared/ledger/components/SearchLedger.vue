<template>
  <section class="mt-7">
    <div v-if="loadingRef" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>

    <template v-else>
      <div class="q-pa-md">
        <SDateRange label-text="Date" v-model="form.date"></SDateRange>
        <SSelect
          emit-value
          map-options
          hide-bottom-space
          label-text="From"
          :options="actFromOptions"
          v-model="form.from"
          input-debounce="0"
          @filter="actFromFilter"
        />

        <SSelect
          emit-value
          map-options
          hide-bottom-space
          label-text="To"
          :options="actToOptions"
          v-model="form.to"
          use-input
          input-debounce="0"
          @filter="actToFilter"
        />
      </div>

      <q-separator class="q-my-sm" />

      <div class="q-pa-md">
        <SSelect
          emit-value
          map-options
          hide-bottom-space
          label-text="Display"
          :options="searches.display"
          v-model="form.display"
        />

        <SSelect
          emit-value
          map-options
          hide-bottom-space
          label-text="Dept"
          v-if="form.display === Display.Dept"
          :options="deptOptions"
          v-model="form.deptAccount"
          use-input
          input-debounce="0"
          @filter="deptFilter"
        />

        <SSelect
          emit-value
          map-options
          hide-bottom-space
          label-text="Main"
          v-if="form.display === Display.Main"
          :options="mainOptions"
          v-model="form.mainAccount"
          use-input
          input-debounce="0"
          @filter="mainFilter"
        />

        <SInput
          label-text="Number"
          v-if="form.display === Display.RN"
          v-model="form.number"
        />

        <q-btn-toggle
          v-model="tableSortType"
          spread
          no-caps
          dense
          toggle-color="primary"
          :options="[
            { label: 'Description', value: SortType.DESC },
            { label: 'Remark', value: SortType.REMARK },
          ]"
          class="q-mb-md"
        />

        <q-checkbox
          v-if="hasModuleName([ModuleAbbr.GL])"
          v-model="form.numberexcludeOther"
          label="Exclude Other Dept"
        />
        <q-checkbox
          v-if="hasModuleName([ModuleAbbr.AR, ModuleAbbr.AP])"
          v-model="form.includeOther"
          label="Include Other Dept"
        />
        <q-checkbox v-model="form.summaryPerDate" label="Summary Per Date" />

        <q-btn
          dense
          color="primary"
          icon="mdi-magnify"
          label="Search"
          class="q-mt-md full-width"
          @click="handleSearch"
        />
      </div>

      <q-separator class="q-my-sm" />

      <div class="q-px-md">
        <SRemarkLeftDrawer right label="Debit" :value="formatterMoney(debit)" />
        <SRemarkLeftDrawer
          right
          label="Credit"
          :value="formatterMoney(credit)"
        />
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  watch,
  toRaw,
  ref,
} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { ModuleAbbr } from '../../../constants/module.constant';
import {
  useLedgerParams,
  LedgerParamType,
} from '../compositions/use-ledger-params.composition';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { useOption } from '../../compositions/use-option.composition';
import { SortType } from '../tables/ledger.tables';
import { formatterMoney } from '../../../helpers/formatterMoney.helper';

enum Display {
  All = 2,
  Main = 1,
  Dept = 3,
  RN = 4,
}

export default defineComponent({
  props: {
    module: { type: String as () => ModuleAbbr, required: true },
    credit: { type: Number, required: true },
    debit: { type: Number, required: true },
  },

  setup(params, { root: { $api }, emit }) {
    const moduleName =
      params.module === ModuleAbbr.GL
        ? LedgerParamType.GL
        : LedgerParamType.NonGL;
    const {
      state,
      disableRef: loadingRef,
      enable,
      paramsRef,
    } = useLedgerParams(moduleName);
    const { options: mainOptions, filter: mainFilter } = useOption('code');
    const { options: deptOptions, filter: deptFilter } = useOption('nr');
    const { options: actFromOptions, filter: actFromFilter } = useOption(
      'fibukonto'
    );
    const { options: actToOptions, filter: actToFilter } = useOption(
      'fibukonto'
    );
    const tableSortType = ref(SortType.DESC);

    const mainAccount = usePrepare(
      false,
      () => $api.common.getGLMainAccount(),
      (data) => {
        mainOptions.value = data;
      }
    );
    const deptAccount = usePrepare(
      false,
      () => $api.common.getGLDeptAccount(),
      (data) => {
        deptOptions.value = data;
      }
    );

    watch(
      () => tableSortType.value,
      (value) => {
        emit('update:sort', value);
      }
    );

    usePrepare(
      true,
      () =>
        Promise.all([
          $api.common.getJournalist(),
          $api.accountReceivable.getPrepareSelectGLAcct(),
        ]),
      ([config, data]) => {
        actFromOptions.value = data;
        actToOptions.value = data;

        state.form.closeYear = config.closeYear;
        state.form.date.before = new Date(config.fromDate);
        state.form.date.after = new Date(config.toDate);
        state.form.currYr = config.currYr + '';

        enable();
      }
    );

    const searches = {
      display: [
        { label: 'All', value: Display.All },
        { label: 'Main Account', value: Display.Main },
        { label: 'Department', value: Display.Dept },
        { label: 'Reference Number', value: Display.RN },
      ],
    };

    watch(
      () => state.form.display,
      (value) => {
        if (value === Display.Main) {
          mainAccount.refetch();
        }
        if (value === Display.Dept) {
          deptAccount.refetch();
        }
      }
    );

    function handleSearch() {
      emit('search', toRaw(paramsRef.value));
    }

    function hasModuleName(modules: ModuleAbbr[]) {
      return modules.includes(params.module);
    }

    return {
      ...toRefs(state),
      formatThousands,
      searches,
      loadingRef,
      handleSearch,
      ModuleAbbr,
      hasModuleName,
      mainOptions,
      mainFilter,
      tableSortType,
      deptOptions,
      deptFilter,
      actFromOptions,
      actFromFilter,
      actToOptions,
      actToFilter,
      Display,
      SortType,
      formatterMoney,
    };
  },
  components: {
    SelectFilter: () =>
      import('../../../modules/AP/components/SelectFilter.vue'),
  },
});
</script>
