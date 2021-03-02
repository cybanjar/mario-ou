<template>
  <section class="mt-7 q-pa-md">
    <div v-if="initPrep.data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <SDateRange :range.sync="dateRange" />
        <q-separator spaced inset dark />
        <SelectFilter
          :options="article"
          option-value="value"
          option-label="label"
          v-model="fromArt"
          label-text="From Article"
        />
        <SelectFilter
          v-model="toArt"
          :options="article"
          option-value="value"
          option-label="label"
          label-text="To Article"
        />
        <SInput v-model="remark" label-text="Remark" />
        <div class="search-option">
          <q-checkbox v-model="printRemark" label="Print Long Remark" />
          <q-checkbox v-model="showInvNr" label="Show Manual Invoice Number" />
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
import {
  defineComponent,
  reactive,
  ref,
  toRef,
  toRefs,
} from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { useDateRange } from '~/app/shared/compositions/use-date-range.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { dateFormatOB } from '~/app/helpers/formatterDate.helper';
import { date } from 'quasar';


export default defineComponent({
  setup(_, { emit, root: { $api } }) {
    const filter = reactive({
      fromDate: '14/01/19',
      toDate: date.formatDate('01/01/19', 'DD/MM/YY'),
      fromArt: 1,
      toArt: 26,
      remark: ' ',
      printRemark: false,
      showInvNr: false,
    });

    const article = ref([]);

    const initPrep = usePrepare(
      true,
      () => $api.accountReceivable.prepareARPaymentList(),
      (tempData) => {
        const toDate = date.extractDate(tempData.toDate, 'YYYY-MM-DD');

        filter.fromDate = date.formatDate(
          date.startOfDate(toDate, 'month'),
          'DD/MM/YY'
        );
        filter.toDate = date.formatDate(toDate, 'DD/MM/YY');

        article.value = mapWithBezeich(tempData.tArtikel['t-artikel'], 'artnr')
      }
    );

    // return an request param object
    function onSubmit() {
      const toDate = date.extractDate(filter.toDate, 'DD/MM/YY');
      const fromDate = date.extractDate(filter.fromDate, 'DD/MM/YY');
      const searchFilter = {
        pvILanguage: '1',
        comment: filter.remark,
        cledger: 'true',
        ccard: 'true',
        lastSort: '1',
        fromDate: date.formatDate(fromDate, dateFormatOB),
        toDate: date.formatDate(toDate, dateFormatOB),
        fromArt: filter.fromDate,
        toArt: filter.toArt,
        lPayment: 'false',
        lTransfer: 'false',
        showInv: filter.showInvNr,
      };

      emit('search', searchFilter, filter.printRemark);
    }

    return {
      ...toRefs(filter),
      ...useDateRange(toRef(filter, 'fromDate'), toRef(filter, 'toDate')),
      onSubmit,
      initPrep,
      article,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
