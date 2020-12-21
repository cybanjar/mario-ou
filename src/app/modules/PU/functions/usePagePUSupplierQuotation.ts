import { ApiEndpoints } from '~/plugins.types';
import { reactive, toRefs } from '@vue/composition-api';

export function usePagePUSupplierQuotation($api: ApiEndpoints) {
  const state = reactive({
    isFetching: true,
    suppliers: [],
  });

  async function fetchSuppliers() {
    const ini = await $api.common.getSupplierList();
    console.log('fetchSuppliers -> ini', ini);
    const itu = await $api.purchasing.quoteListPrepare();
  }

  fetchSuppliers();

  return {
    ...toRefs(state),
  };
}
