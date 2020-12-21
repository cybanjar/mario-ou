<template>
  <SModulePage @onActions="onActions">
    <template #filters>
      <SearchGLGeneralJournal
        :debit="debit"
        :credit="credit"
        :display.sync="display"
        @onSearch="onSearch"
      />
    </template>

    <template #table>
      <TableGLGeneralJournal
        :is-fetching="isFetching"
        :rows="tableRows"
        :filters="filters"
        :display="display"
      />
    </template>
  </SModulePage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { ResCommonJourList } from '~/app/common/models/responses/commonJourList.response';

interface State {
  isFetching: boolean;
  tableRows: ResCommonJourList[];
  filters: any;
  debit: string;
  credit: string;
  display: string;
  dialog: boolean;
}

export default defineComponent({
  // setup(_, { root: { $api } }) {
  setup() {
    const state = reactive<State>({
      isFetching: true,
      tableRows: [],
      filters: {},
      debit: '',
      credit: '',
      display: 'active',
      dialog: false,
    });

    // async function fetchRows() {
    //   const itu = await $api.common.commonJourList({
    //     caseType: '1',
    //     fromDate: '01/01/2019',
    //     fromRefno: ' ',
    //     inputUserkey: '6D83EFC6F6CA694FFC35FAA7D70AD308FB74A6CD',
    //     inputUsername: 'sindata',
    //     journaltype: 0,
    //     jtype1: 99,
    //     sorttype: '0',
    //     toDate: '06/22/2020',
    //   });
    // }

    function onSearch(filters) {
      console.log('onSearch -> filters', filters);
      state.filters = filters;
    }

    function onActions() {
      //
    }

    return {
      ...toRefs(state),
      onSearch,
      onActions,
    };
  },
  components: {
    SearchGLGeneralJournal: () =>
      import('./components/SearchGLGeneralJournal.vue'),
    TableGLGeneralJournal: () =>
      import('./components/TableGLGeneralJournal.vue'),
  },
});
</script>
