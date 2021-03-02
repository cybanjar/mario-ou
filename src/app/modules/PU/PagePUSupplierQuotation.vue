<template>
  <SModulePage
    @onActions="onActions"
    :actions="[{ name: 'Add', position: 'prefix' }]"
  >
    <template #filters>
      <SearchPUSupplierQuotation
        :filters="filterOptions"
        :is-preparing="isPreparing"
        @search="onSearch"
      />
    </template>

    <template #table>
      <TablePUSupplierQuotation
        :is-searching="isSearching"
        :rows="tableRows"
        @modified="onModified"
        @delete="onDelete"
      />
    </template>

    <!-- <DialogPUSupplierQuotation
      :dialog="dialog"
    /> -->
  </SModulePage>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, ref } from '@vue/composition-api';
import { date } from 'quasar';

export default defineComponent({
  components: {
    SearchPUSupplierQuotation: () =>
      import('./components/SearchPUSupplierQuotation.vue'),
    TablePUSupplierQuotation: () =>
      import('./components/TablePUSupplierQuotation.vue'),
  },
  setup(_, { root: { $api } }) {
    function onActions(actions) {
      switch (actions) {
        case 'onAdd':
        // onAddNewPO();
        case 'onRefresh':
          fetchSQ();
          break;
        case 'onPrint':
          // TODO: put print logic here
          break;
        default:
          break;
      }
    }

    const state = reactive({
      isPreparing: true,
      isSearching: false,
      filterOptions: {
        suppliers: [],
        articles: [],
      },
      tableRows: [],
    });

    (async function () {
      const [resSupp, resArt] = await Promise.all([
        $api.common.selectSupplier(),
        $api.common.getAllArtikel(),
      ]);

      state.filterOptions.suppliers = [
        { value: 'all', label: 'All' },
        ...resSupp.map((supplier) => {
          return {
            label: supplier.firma,
            value: supplier['lief-nr'],
          };
        }),
      ];

      state.filterOptions.articles = resArt;

      state.isPreparing = false;
    })();

    const searches = ref<any>({});

    function onSearch(filters) {
      searches.value = filters;
      fetchSQ();
    }

    async function fetchSQ() {
      state.isSearching = true;

      const supplier = searches.value.supplier.value;

      const requestData = {
        artNo: searches.value.article.artnr,
        supNo: supplier === 'all' ? '' : supplier,
        docuNr: searches.value.docNum,
      };

      state.tableRows = await $api.purchasing.quoteListPrepare(requestData);

      state.isSearching = false;
    }

    function onModified({ item, selectedIdx }) {
      const newItem = {
        ...item,
        activeFlag: item.activeflag,
        ['from-date']: date.formatDate(
          date.extractDate(item['from-date'], 'YY/MM/DD'),
          'YYYY-MM-DD'
        ),
        ['to-Date']: date.formatDate(
          date.extractDate(item['to-date'], 'YY/MM/DD'),
          'YYYY-MM-DD'
        ),
      };
      state.tableRows.splice(selectedIdx, 1, {
        ...newItem,
      });
    }

    function onDelete(idx) {
      state.tableRows.splice(idx, 1);
    }

    return {
      ...toRefs(state),
      onActions,
      onSearch,
      onModified,
      onDelete,
    };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
