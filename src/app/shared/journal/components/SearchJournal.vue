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
          <SDateRange label-text="Date" v-model="date" />
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
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { formatToBL } from '~/app/helpers/formatterDate.helper';
export default defineComponent({
  props: {
    debit: { type: Number, required: false, default: 0 },
    credit: { type: Number, required: false, default: 0 },
  },
  setup(_, { emit, root: { $api, $q } }) {
    const filter = reactive({
      display: 0,
      date: {
        before: new Date(),
        after: new Date(),
      },
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
        const date = new Date(tempData?.fdate);
        date.setDate(date.getDate() + 1); // add 1 day
        filter.date.after = date;
        onSubmit(); // show result on first load
      }
    );
    function onSubmit() {
      const params = {
        sorttype: filter.display,
        fromRefno: filter.voucerNo || ' ',
        fromDate: formatToBL(filter.date.after),
        toDate: formatToBL(filter.date.before),
      };

      emit('search', params);
    }

    return {
      ...toRefs(filter),
      initPrep,
      onSubmit,
    };
  },
});
</script>
