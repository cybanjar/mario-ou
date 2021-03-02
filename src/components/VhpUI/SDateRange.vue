<template>
  <SInput
    label-text="Date"
    placeholder="From - Until"
    ref="inputDate"
    :value="range.dateInput"
    readonly
  >
    <template v-slot:append>
      <q-icon name="mdi-calendar" />
    </template>
  </SInput>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import Litepicker from 'litepicker';
import { date } from 'quasar';

interface Props {
  range: {
    startDate: string;
    endDate: string;
    dateInput: string;
  };
}

export default defineComponent<Props>({
  props: {
    range: { type: Object, default: null },
  },
  setup(props, { emit }) {
    const inputDate = ref<any>(null);

    onMounted(() => {
      const inputEl = inputDate.value.$refs.sInput.$refs.input;
      new Litepicker({
        element: inputEl,
        singleMode: false,
        numberOfMonths: 2,
        numberOfColumns: 2,
        format: 'DD/MM/YY',
        startDate: date.extractDate(props.range.startDate, 'DD/MM/YY'),
        endDate: date.extractDate(props.range.endDate, 'DD/MM/YY'),
        showTooltip: false,
        onSelect: function (sDate, eDate) {
          const startDate = date.formatDate(sDate, 'DD/MM/YY');
          const endDate = date.formatDate(eDate, 'DD/MM/YY');
          const dateInput = `${startDate} - ${endDate}`;
          emit('update:range', { startDate, endDate, dateInput });
        },
      });
    });

    return {
      inputDate,
    };
  },
});
</script>
