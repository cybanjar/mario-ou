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
        <SDateRange :range.sync="dateRange" />
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
  toRef,
  toRefs,
} from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { dateFormatOB } from '~/app/helpers/formatterDate.helper';
import { useDateRange } from '~/app/shared/compositions/use-date-range.composition';
import { date } from 'quasar';

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
      () =>
        $api.accountReceivable.getLoadArticle1({
          caseType: 1,
          deptNo: 0,
        }),
      undefined,
      (tempData) => mapWithBezeich(tempData, 'artnr'),
      []
    );

    const outletOptions = ref([]);

    const initPrep = usePrepare(
      true,
      () => $api.accountReceivable.prepareARJournal(),
      (tempData) => {
        const fromDate = date.formatDate(tempData.fromDate, 'DD/MM/YY');
        const toDate = date.formatDate(tempData.toDate, 'DD/MM/YY');
        filter.fromDate = fromDate;
        filter.toDate = toDate;
        filter.fromArt = tempData.fromArt;
        filter.toArt = tempData.toArt;
        filter.fromDept = tempData.fromDept;
        filter.toDept = tempData.toDept;
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
