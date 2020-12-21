import { ref, computed, unref } from '@vue/composition-api';

export function useMoney(init) {
  const accRef = ref(init);

  function add(amount: number) {
    accRef.value += amount;
  }

  const acc = computed<number>({
    get: () => unref(accRef),
    set: (value) => {
      accRef.value = value;
    },
  });

  return { acc, add };
}
