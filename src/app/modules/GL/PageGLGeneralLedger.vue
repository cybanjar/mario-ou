<template>
  <SModulePage @onActions="onActions">
    <template #filters>
      <SearchGLGeneralLedger
        :filters="filters"
        @onSearch="onSearch"
        @onMode="onMode"
      />
    </template>
  </SModulePage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { mapSelectItems } from '~/app/helpers/mapSelectItems.helpers';
import { Props } from './models/components/searchGLGeneralLedger.models';

interface State extends Props {
  prepare: {
    last2Yr: number | null;
    closeYear: string;
  };
}

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<State>({
      filters: {
        isPreparing: true,
        coaOptions: [],
        mainAccounts: [],
        departments: [],
        mode: 'remark',
        debit: '',
        credit: '',
      },
      prepare: {
        last2Yr: null,
        closeYear: '',
      },
    });

    // fetch options & rows
    (async function () {
      const [
        resCoa,
        resPrepare,
        resMainAccounts,
        resDepartments,
      ] = await Promise.all([
        $api.accountReceivable.getPrepareSelectGLAcct(),
        $api.common.prepareGLJoulist(),
        $api.common.getGLMainAccount(),
        $api.common.getGLDeptAccount(),
      ]);
      state.prepare.last2Yr = resPrepare.currYr - 2;
      state.prepare.closeYear = resPrepare.closeYear;
      state.filters.coaOptions = resCoa
        ? mapSelectItems(resCoa, 'fibukonto', 'bezeich')
        : [];
      state.filters.mainAccounts = resMainAccounts
        ? resMainAccounts.map(
            ({ bezeich, code, nr, 'type-code': typeCode }) => ({
              label: '',
              value: nr,
            })
          )
        : [];
      console.log('setup -> resMainAccounts', resMainAccounts);
      state.filters.departments = resDepartments || [];
      console.log('setup -> resDepartments', resDepartments);
      state.filters.isPreparing = false;
    })();

    function onActions() {
      //
    }

    function onSearch() {
      //
    }

    function onMode(val) {
      state.filters.mode = val;
    }

    return {
      ...toRefs(state),
      onActions,
      onSearch,
      onMode,
    };
  },
  components: {
    SearchGLGeneralLedger: () =>
      import('./components/SearchGLGeneralLedger.vue'),
  },
});
</script>
