<template>
  <section class="mt-7 q-pa-md">
    <div v-if="initPrep.data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="q-px-sm q-py-md">
          <div class="input-field full-width q-mb-md">
            <label class="inline-block q-mb-xs">
              Display
            </label>
            <q-btn-toggle
              no-caps
              unelevated
              stretch
              v-model="display"
              toggle-color="primary"
              color="white"
              text-color="primary"
              label="Display"
              class="full-width"
              :options="[
                { label: 'Active', value: 0 },
                { label: 'Closed', value: 1 },
              ]"
            />
          </div>
          <q-separator spaced="xl" />
          <SDateRange :range.sync="dateRange" />
          <SInput label-text="Vouncer No." v-model="voucerNo" />
          <q-separator spaced="xl" />
          <q-btn
            icon="mdi-magnify"
            label="Search"
            type="submit"
            class="full-width"
            color="primary"
          />
          <q-separator spaced="lg" />
          <SRemarkLeftDrawer label="Debit" :value="debit | money" />
          <SRemarkLeftDrawer label="Credit" :value="credit | money" />
        </div>
      </q-form>
    </template>
  </section>
</template>
<script lang="ts">
import { defineComponent, reactive, toRef, toRefs } from '@vue/composition-api';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { dateFormatOB, formatToBL } from '~/app/helpers/formatterDate.helper';
import { useDateRange } from '../../compositions/use-date-range.composition';
import { date } from 'quasar';
export default defineComponent({
  props: {
    debit: { type: Number, required: false, default: 0 },
    credit: { type: Number, required: false, default: 0 },
  },
  setup(_, { emit, root: { $api, $q } }) {
    const filter = reactive({
      display: 0,
      fromDate: '14/01/19',
      toDate: date.formatDate('01/01/19', 'DD/MM/YY'),
      voucerNo: '',
    });
    usePrepare<any[]>(
      true,
      () => $api.common.getGLMainAccount(),
      (tempData) => {
        if (tempData.length > 0) {
          initPrep.refetch();
        } else {
          $q.notify({
            type: 'negative',
            message: 'Empty Main Account List',
          });
        }
      }
    );
    const initPrep = usePrepare(
      false,
      () => $api.common.getGeneralParam(2, 558),
      (tempData) => {
        const fromDate = new Date(tempData?.fdate);
        fromDate.setDate(fromDate.getDate() + 1); // add 1 day
        filter.fromDate = date.formatDate(fromDate, 'DD/MM/YY');
        onSubmit(); // show result on first load
      }
    );
    function onSubmit() {
      const toDate = date.extractDate(filter.toDate, 'DD/MM/YY');
      const fromDate = date.extractDate(filter.fromDate, 'DD/MM/YY');
      const params = {
        sorttype: filter.display,
        fromRefno: filter.voucerNo || ' ',
        fromDate: date.formatDate(fromDate, dateFormatOB),
        toDate: date.formatDate(toDate, dateFormatOB),
      };

      emit('search', params);
    }

    return {
      ...toRefs(filter),
      ...useDateRange(toRef(filter, 'fromDate'), toRef(filter, 'toDate')),
      initPrep,
      onSubmit,
    };
  },
});
</script>
