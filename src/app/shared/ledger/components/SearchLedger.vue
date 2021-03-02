<template>
  <section class="mt-7">
    <div v-if="data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>

    <template v-else>
      <div class="q-pa-md">
        <SDateRange :range.sync="range" />
        <SelectFilter
          option-value="value"
          option-label="label"
          label-text="From"
          :options="actFromOptions"
          v-model="from"
        />

        <SelectFilter
          option-value="value"
          option-label="label"
          label-text="To"
          :options="actToOptions"
          v-model="to"
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
          v-model="display"
        />

        <SSelect
          emit-value
          map-options
          label-text="Dept"
          v-if="display === Display.Dept"
          :options="deptOptions"
          v-model="deptAccount"
        />

        <SSelect
          emit-value
          map-options
          label-text="Main"
          v-if="display === Display.Main"
          :options="mainOptions"
          v-model="mainAccount"
        />

        <SInput
          label-text="Number"
          placeholder="Enter Reference Number"
          v-if="display === Display.RN"
          v-model="number"
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
          v-model="excludeOther"
          label="Exclude Other Department"
        />
        <q-checkbox
          v-if="hasModuleName([ModuleAbbr.AR, ModuleAbbr.AP])"
          v-model="includeOther"
          label="Include Other Department"
        />
        <q-checkbox v-model="summaryPerDate" label="Summary Per Date" />

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
  ref,
  reactive,
  computed,
} from '@vue/composition-api';
import { ModuleAbbr } from '../../../constants/module.constant';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { SortType } from '../tables/ledger.tables';
import { formatterMoney } from '../../../helpers/formatterMoney.helper';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';

enum Display {
  All = 2,
  Main = 1,
  Dept = 3,
  RN = 4,
}

enum LedgerParamType {
  GL = 'gl',
  NonGL = 'non-gl',
}

type State = {
  date: {
    before?: Date;
    after?: Date;
  };
  from?: string;
  to?: string;
  display: number;
  excludeOther: boolean;
  includeOther: boolean;
  mainAccount?: number;
  deptAccount?: number;
  sortType: number;
  number?: number;
  closeYear: string;
  currYr: string;
  summaryPerDate: boolean;
};

export default defineComponent({
  props: {
    module: { type: String as () => ModuleAbbr, required: true },
    journalType: { type: Number, required: true },
    credit: { type: Number, required: true },
    debit: { type: Number, required: true },
  },

  setup(props, { root: { $api }, emit }) {
    const moduleName =
      props.module === ModuleAbbr.GL
        ? LedgerParamType.GL
        : LedgerParamType.NonGL;
    const filter = reactive<State>({
      date: {
        before: new Date(),
        after: new Date(),
      },
      display: 2,
      excludeOther: false,
      includeOther: false,
      sortType: 2,
      currYr: '',
      closeYear: '2017',
      summaryPerDate: false,
      from: undefined,
      to: undefined,
      mainAccount: undefined,
      deptAccount: undefined,
      number: undefined,
    });
    const actFromOptions = ref([]);
    const actToOptions = ref([]);
    const mainOptions = ref([]);
    const deptOptions = ref([]);
    const tableSortType = ref(SortType.REMARK);

    const mainAccount = usePrepare(
      false,
      () => $api.common.getGLMainAccount(),
      (data) => {
        mainOptions.value = mapWithBezeich(data, 'code');
      }
    );
    const deptAccount = usePrepare(
      false,
      () => $api.common.getGLDeptAccount(),
      (data) => {
        deptOptions.value = mapWithBezeich(data, 'nr');
      }
    );

    const range = computed({
      get: () => {
        const { before, after } = filter.date;
        const startDate = date.formatDate(before, 'DD/MM/YY');
        const endDate = date.formatDate(after, 'DD/MM/YY');
        return {
          startDate,
          endDate,
          dateInput: `${startDate} - ${endDate}`,
        };
      },
      set: ({ startDate, endDate }) => {
        filter.date.after = date.extractDate(startDate, 'DD/MM/YY');
        filter.date.before = date.extractDate(endDate, 'DD/MM/YY');
      },
    });

    watch(
      () => tableSortType.value,
      (value) => {
        emit('update:sort', value);
      },
      { immediate: false, flush: 'post' }
    );

    const { data } = usePrepare(
      true,
      () =>
        Promise.all([
          $api.common.getJournalist(),
          $api.accountReceivable.getPrepareSelectGLAcct(),
        ]),
      ([config, data]) => {
        const options = mapWithBezeich(data, 'fibukonto');
        actFromOptions.value = options;
        actToOptions.value = options;

        filter.closeYear = config.closeYear;
        filter.date.after = new Date('2019-01-14');
        filter.date.before = new Date(config.toDate);
        filter.currYr = config.currYr + '';
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
      () => filter.display,
      (value) => {
        if (value === Display.Main) {
          mainAccount.refetch();
        }
        if (value === Display.Dept) {
          deptAccount.refetch();
        }

        // reset on switch
        filter.mainAccount = undefined;
        filter.deptAccount = undefined;
        filter.number = undefined;
      }
    );

    function handleSearch() {
      const dateFormatToBL = 'MM/DD/YY';
      const dateFormatFromBL = 'YYYY-MM-DD';
      const closeYear = date.extractDate(filter.closeYear, dateFormatFromBL);
      const baseParams = {
        fromDate: date.formatDate(filter.date.after, dateFormatToBL),
        toDate: date.formatDate(filter.date.before, dateFormatToBL),
        last2Yr: parseInt(filter.currYr) - 2,
        closeYear: date.formatDate(closeYear, dateFormatToBL),
        journaltype: props.journalType,
        summDate: filter.summaryPerDate ? 'yes' : 'no',
        fromFibu:
          filter.from === undefined || filter.from === ''
            ? '00000000'
            : filter.from.replace(/-/g, ''),
        toFibu:
          filter.to === undefined || filter.to === ''
            ? '99999999'
            : filter.to.replace(/-/g, ''),
        sorttype: filter.sortType,
        fromDept: filter.deptAccount === undefined ? '' : filter.deptAccount,
        journaltype1: 99,
        cashflow: 'no',
      };
      // debugger;
      switch (moduleName) {
        case LedgerParamType.GL:
          emit('search', {
            ...baseParams,
            exclOther: filter.excludeOther ? 'yes' : 'no',
          });
        case LedgerParamType.NonGL:
          emit('search', {
            ...baseParams,
            otherDept: filter.includeOther ? 'yes' : 'no',
          });
      }
    }

    function hasModuleName(modules: ModuleAbbr[]) {
      return modules.includes(props.module);
    }

    return {
      ...toRefs(filter),
      searches,
      data,
      handleSearch,
      ModuleAbbr,
      hasModuleName,
      mainOptions,
      range,
      tableSortType,
      deptOptions,
      actFromOptions,
      actToOptions,
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
