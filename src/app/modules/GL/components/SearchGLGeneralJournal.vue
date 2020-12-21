<template>
  <section class="mt-7">
    <q-inner-loading v-if="isLoading" showing color="primary" />

    <template v-else>
      <div class="q-pa-md">
        <label class="block q-mb-sm">Display</label>
        <q-btn-toggle
          v-model="journalDisplay"
          spread
          no-caps
          dense
          toggle-color="primary"
          :options="displayOptions"
        />
      </div>

      <q-separator />

      <div class="q-pa-md">
        <q-form @submit="onSearch">
          <SDateRange :range.sync="range" />

          <SInput label-text="Voucher No" v-model="reference" />

          <q-btn
            dense
            type="submit"
            color="primary"
            icon="mdi-magnify"
            label="Search"
            class="q-mt-md full-width"
          />
        </q-form>
      </div>

      <q-separator class="q-my-md" />

      <div class="q-px-md">
        <SRemarkLeftDrawer
          right
          label="Debit"
          :value="formatThousands(credit)"
        />
        <SRemarkLeftDrawer
          right
          label="Credit"
          :value="formatThousands(debit)"
        />
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
} from '@vue/composition-api';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

interface State {
  date: {
    startDate: string;
    endDate: string;
  };
  reference: string;
}

const displayOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Closed', value: 'closed' },
];

export default defineComponent({
  props: {
    display: { type: String, required: true },
    credit: { type: String, required: true },
    debit: { type: String, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const isLoading = ref<boolean>(true);

    const searches = reactive<State>({
      date: {
        startDate: '',
        endDate: date.formatDate(new Date(), 'DD/MM/YYYY'),
      },
      reference: '',
    });

    (async () => {
      const resParam = await $api.common.getHTParam0({
        casetype: 2,
        inpParam: 558,
      });

      if (resParam) {
        const accountingPeriod = date.addToDate(
          date.extractDate(resParam.fdate, 'YYYY-MM-DD'),
          { days: 1 }
        );

        searches.date.startDate = date.formatDate(accountingPeriod, 'DD/MM/YYYY');
      }
      isLoading.value = false;
    })();

    const journalDisplay = computed({
      get() {
        return props.display;
      },
      set(val) {
        emit('update:display', val);
      },
    });

    const range = computed({
      get: () => {
        const { startDate, endDate } = searches.date;

        return {
          startDate,
          endDate,
          dateInput: `${startDate} - ${endDate}`,
        };
      },
      set: ({ startDate, endDate }) => {
        searches.date.startDate = startDate;
        searches.date.endDate = endDate;
      },
    });

    const onSearch = () => {
      emit('onSearch', { date: searches.date, reference: searches.reference });
    };

    return {
      ...toRefs(searches),
      isLoading,
      journalDisplay,
      formatThousands,
      displayOptions,
      onSearch,
      range,
    };
  },
});
</script>
