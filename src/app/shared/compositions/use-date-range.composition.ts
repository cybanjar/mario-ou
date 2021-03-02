import { Ref, computed } from '@vue/composition-api';

export function useDateRange(fromDate: Ref<string>, toDate: Ref<string>) {
  const dateRange = computed<any>({
    get() {
      return {
        startDate: fromDate.value,
        endDate: toDate.value,
        dateInput: `${fromDate.value} - ${toDate.value}`,
      };
    },
    set(val) {
      fromDate.value = val.startDate;
      toDate.value = val.endDate;
    },
  });
  return { dateRange };
}
