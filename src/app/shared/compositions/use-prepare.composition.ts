import { onMounted, reactive, computed, UnwrapRef } from '@vue/composition-api';

export function usePrepare<T = any, K = any>(
  first: boolean,
  request: (...args) => Promise<T>,
  callback?: (data: UnwrapRef<T>) => void,
  transform?: (data: UnwrapRef<T>) => K,
  initResult?: T
) {
  const data = reactive({
    raw: initResult,
    isLoading: first,
    isError: false,
    errorMsg: '',
  });

  const result = computed(() =>
    transform && !(data.isLoading || data.isError)
      ? transform(data.raw)
      : data.raw
  );

  function requestIn(...args) {
    data.raw = initResult as UnwrapRef<T>;
    data.isLoading = true;
    request(...args)
      .then((response) => {
        data.isLoading = false;
        data.raw = response as UnwrapRef<T>;
        callback && callback(data.raw);
        data.isError = false;
      })
      .catch((e) => {
        console.log(e);
        data.isError = true;
        data.errorMsg = e;
      });
  }

  onMounted(() => first && requestIn());

  return {
    data,
    result,
    refetch: requestIn,
  };
}
