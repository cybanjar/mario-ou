import { reactive, toRefs } from '@vue/composition-api';
import { store } from '~/store';

export function useSearchPUSupplierQuotation() {
  const searches = reactive({
    supplier: null,
    // main: null,
    // category: null,
    // department: null,
  });

  // const onSearch = () => {
  //   emit('onSearch', { ...searches });
  // };

  return {
    ...toRefs(searches),
    // onSearch,
    // placeholder: store.state.auth.user?.coaFormat || '',
    // mask: store.getters.auth.getCoaFormat,
  };
}
