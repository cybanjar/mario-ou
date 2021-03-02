import { onMounted, reactive, computed, UnwrapRef } from '@vue/composition-api';

export function usePrepare<T = any, K = any>(
  first: boolean,
  request: (...args) => Promise<T>,
  callback?: (data: UnwrapRef<T>) => void,
  transform?: (data: UnwrapRef<T>) => K,
  initResult?: K extends undefined ? T : K
) {
  const data = reactive({
    raw: initResult,
    isLoading: false,
    isFetch: false,
    isError: false,
    errorMsg: '',
  });

  const result = computed(() =>
    transform && !(data.isLoading || data.isError)
      ? transform(data.raw as UnwrapRef<T>)
      : data.raw
  );

  function requestIn(...args) {
    data.raw = initResult as UnwrapRef<K extends undefined ? T : K>;
    data.isLoading = true;
    return request(...args)
      .then((response) => {
        data.isLoading = false;
        data.raw = response as UnwrapRef<K extends undefined ? T : K>;
        callback && callback(data.raw as UnwrapRef<T>);
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
