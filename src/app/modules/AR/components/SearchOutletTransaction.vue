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
        <q-separator spaced />
        <SSelect
          :options="artPrep.result"
          map-options
          emit-value
          v-model="fromArt"
          label-text="From Article"
        />
        <SSelect
          v-model="toArt"
          :options="artPrep.result"
          map-options
          emit-value
          label-text="To Article"
        />
        <q-separator spaced />
        <SSelect
          :options="outletOptions"
          map-options
          emit-value
          v-model="fromDept"
          label-text="From Outlet"
        />
        <SSelect
          v-model="toDept"
          :options="outletOptions"
          map-options
          emit-value
          label-text="To Outlet"
        />
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
        <q-separator spaced />
      </q-form>
    </template>
  </section>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRaw,
  toRef,
  toRefs,
} from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import {
  mapWithBezeich,
  mapWithField,
} from '~/app/helpers/mapSelectItems.helpers';
import { dateFormatOB, formatToOB } from '~/app/helpers/formatterDate.helper';
import { useDateRange } from '~/app/shared/compositions/use-date-range.composition';
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
      toDate: '14/01/19',
      fromArt: 9930,
      toArt: 9955,
      fromDept: 1,
      toDept: 20,
    });

    const artPrep = usePrepare(
      true,
      () => $api.common.loadHArtikel({ caseType: '2', dept: '1' }),
      undefined,
      (tempData) => mapWithBezeich(tempData, 'artnr'),
      []
    );

    const outletOptions = ref([]);

    const initPrep = usePrepare(
      true,
      () => $api.accountReceivable.getPrepareARHJournal(),
      (tempData) => {
        const baseDate = date.formatDate(tempData.fromDate, 'DD/MM/YY');
        filter.fromDate = baseDate;
        filter.toDate = baseDate;
        outletOptions.value = mapWithField(
          tempData.tHoteldpt['t-hoteldpt'],
          'num',
          'depart'
        );
      }
    );

    // return an request param object
    function onSubmit() {
      const toDate = date.extractDate(filter.toDate, 'DD/MM/YY');
      const fromDate = date.extractDate(filter.fromDate, 'DD/MM/YY');
      emit('search', {
        ...filter,
        toDate: date.formatDate(toDate, dateFormatOB),
        fromDate: date.formatDate(fromDate, dateFormatOB),
      });
    }

    return {
      ...toRefs(filter),
      ...useDateRange(toRef(filter, 'fromDate'), toRef(filter, 'toDate')),
      onSubmit,
      initPrep,
      artPrep,
      outletOptions,
    };
  },
});
</script>
