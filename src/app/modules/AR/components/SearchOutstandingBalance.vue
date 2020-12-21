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
        <SDateRange v-model="date" label-text="Date" />
        <q-separator spaced inset dark />
        <SelectFilter
          :options="artPrep.result"
          option-value="value"
          option-label="label"
          v-model="fromArt"
          label-text="From Article"
        />
        <SelectFilter
          v-model="toArt"
          :options="artPrep.result"
          option-value="value"
          option-label="label"
          label-text="To Article"
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
          <q-checkbox
            v-model="showInvoiceNr"
            label="Show Manual Invoince Number"
          />
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
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { formatToOB } from '~/app/helpers/formatterDate.helper';

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
      date: {
        before: new Date('01/01/19'),
        after: new Date('01/14/19'),
      },
      fromArt: 1,
      toArt: 26,
      fromArtTitle: ' ', // from name
      toArtTitle: 'zz', // to name
      arType: ArType.ALL,
      billReceiver: '',
      onlyOutstanding: true, // less_payment
      printAmount: false,
      totalPerBill: false, // tot_per_agent
      showInvoiceNr: false, // show_manual_inv_no
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
        filter.date.before = new Date(tempData.toDate);
        filter.date.after = new Date(tempData.fromDate);
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
      const searchFilter = {
        fromName: ' ',
        toName: 'zz',
        fromDate: formatToOB(filter.date.after),
        toDate: formatToOB(filter.date.before),
        fromArt: filter.fromArt,
        toArt: filter.toArt,
        totFlag: filter.totalPerBill,
        lesspay: filter.onlyOutstanding,
        showInv: filter.showInvoiceNr,
        caseType: filter.arType, // 0 - All AR, 2 - Front Office & Outlet AR; 1 - Manual AR;
      };

      emit('search', searchFilter, filter.billReceiver);
    }

    return {
      ...toRefs(filter),
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
