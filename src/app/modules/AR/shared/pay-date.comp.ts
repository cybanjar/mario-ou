import { ref, onMounted } from '@vue/composition-api';

export function loadPayDate($api, prefetch = false) {
  const payDate = ref<Date>();
  const isPrefetch = ref();

  onMounted(async () => {
    if (prefetch === false) {
      isPrefetch.value = false;
      const closePayDate = await $api.accountReceivable.getARClosePayDate();
      payDate.value = new Date(closePayDate.billDate);
      isPrefetch.value = true;
    }
  });

  return {
    payDate,
    isPrefetch,
  };
}
