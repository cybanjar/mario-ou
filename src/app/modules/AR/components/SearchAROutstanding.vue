<template>
  <section class="mt-7 q-pa-md">
    <div
      v-if="initPrep.data.isLoading && artPrep.data.isLoading"
      class="q-pa-md text-center"
    >
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <SDateRange :range.sync="dateRange" />
        <q-separator spaced inset dark />
        <SSelect
          emit-value
          map-options
          :options="artPrep.result"
          option-value="value"
          option-label="label"
          v-model="fromArt"
          label-text="From Article"
          hide-bottom-space
          lazy-rules
          :rules="[(val) => val || 'Please select article']"
        />
        <SSelect
          emit-value
          map-options
          v-model="toArt"
          :options="artPrep.result"
          option-value="value"
          option-label="label"
          label-text="To Article"
          hide-bottom-space
          lazy-rules
          :rules="[(val) => val || 'Please select article']"
        />
        <q-separator spaced inset dark />
        <SSelect
          :options="arTypeOptions"
          v-model="arType"
          label-text="AR Type"
          map-options
          emit-value
        />
        <q-separator spaced inset dark />
        <SInput v-model="billReceiver" label-text="Bill Receiver" />
        <q-separator spaced inset dark />
        <div class="search-option">
          <q-checkbox v-model="onlyOutstanding" label="Outstading Only" />
          <q-checkbox
            v-model="printAmount"
            label="Print Without Local Amount"
          />
          <q-checkbox v-model="totalPerBill" label="Total Per Bill Receiver" />
        </div>
        <div>
          <q-btn
            dense
            color="primary"
            icon="mdi-magnify"
            label="Search"
            class="q-mt-md full-width"
            type="submit"
          />
        </div>
      </q-form>
    </template>
  </section>
</template>
<script lang="ts">
import { defineComponent, reactive, toRef, toRefs } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { useDateRange } from '~/app/shared/compositions/use-date-range.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { dateFormatOB } from '~/app/helpers/formatterDate.helper';
import { date } from 'quasar';

/**
 * 0 - All AR, 2 - Front Office & Outlet AR; 1 - Manual AR;
 **/
enum ArType {
  ALL = 0, // 0 - All AR
  FO = 2, // 2 - Front Office & Outlet AR
  MA = 1, // 1 - Manual AR
}

export default defineComponent({
  setup(_, { emit, root: { $api } }) {
    const filter = reactive({
      fromDate: '14/01/19',
      toDate: date.formatDate('01/01/19', 'DD/MM/YY'),
      fromArt: 1,
      toArt: 26,
      fromArtTitle: ' ', // from name
      toArtTitle: 'zz', // to name
      arType: ArType.ALL,
      billReceiver: '',
      onlyOutstanding: true, // less_payment
      printAmount: false,
      totalPerBill: false, // tot_per_agent
    });

    const artPrep = usePrepare(
      true,
      () =>
        $api.accountReceivable.getLoadArticle({ caseType: '3', deptNo: '1' }),
      undefined,
      (tempData) => mapWithBezeich(tempData, 'artnr'),
      []
    );

    const initPrep = usePrepare(
      true,
      () => $api.accountReceivable.getPrepareARDebtlist(),
      (tempData) => {
        const toDate = date.extractDate(tempData.toDate, 'YYYY-MM-DD');
        const fromDate = date.extractDate(tempData.fromDate, 'YYYY-MM-DD');
        filter.toDate = date.formatDate(toDate, 'DD/MM/YY');
        filter.fromDate = date.formatDate(fromDate, 'DD/MM/YY');
        filter.fromArt = tempData.fromArt;
        filter.toArt = tempData.toArt;
        filter.fromArtTitle = tempData.fromBez;
        filter.toArtTitle = tempData.toBez;
      }
    );

    const arTypeOptions = [
      {
        label: 'All AR',
        value: ArType.ALL,
      },

      {
        label: 'Front Office & Outlet AR',
        value: ArType.FO,
      },

      {
        label: 'Manual AR',
        value: ArType.MA,
      },
    ];

    // return an request param object
    function onSubmit() {
      const toDate = date.extractDate(filter.toDate, 'DD/MM/YY');
      const fromDate = date.extractDate(filter.fromDate, 'DD/MM/YY');
      const searchFilter = {
        fromName: ' ',
        toName: 'zz',
        fromDate: date.formatDate(fromDate, dateFormatOB),
        toDate: date.formatDate(toDate, dateFormatOB),
        fromArt: filter.fromArt,
        toArt: filter.toArt,
        totFlag: filter.totalPerBill,
        lesspay: filter.onlyOutstanding,
        caseType: filter.arType, // 0 - All AR, 2 - Front Office & Outlet AR; 1 - Manual AR;
      };

      emit('search', searchFilter, filter.billReceiver);
    }

    return {
      ...toRefs(filter),
      ...useDateRange(toRef(filter, 'fromDate'), toRef(filter, 'toDate')),
      onSubmit,
      initPrep,
      artPrep,
      arTypeOptions,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
