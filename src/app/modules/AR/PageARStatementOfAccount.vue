<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchStatementOfAccount
        :selected-guest="selectedGuest"
        @search="searchSoa"
        @selectGuest="showGuestDialog(true)"
      ></SearchStatementOfAccount>
    </q-drawer>
    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TableStatementOfAccount
        :is-fetching="tablePrep.data.isLoading"
        :soa-list="tablePrep.result"
      ></TableStatementOfAccount>
    </div>
    <DialogSelectGuest
      :show="isSelectGuest"
      :is-fetching="isFetching"
      @hide="showGuestDialog(false)"
      @save="setSelectedGuest"
    ></DialogSelectGuest>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { ResDispDebitor } from './models/debitor.model';
import { ReqSoaList, ResSoaList } from '~/app/modules/AR/models/soa-list.model';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      selectedGuest: {} as ResDispDebitor,
      selectType: 0,
      currDay: '',
      isFetching: false,
    });

    const isSelectGuest = ref(false);

    const tablePrep = usePrepare(
      false,
      () => {
        const requestData: ReqSoaList = {
          showType: state.selectType,
          guestno: state.selectedGuest.gastnr,
          currDay: state.currDay,
          paramAr: {
            paramType: '',
            paramNr: 0,
            paramName: '',
            paramVal: '',
          },
        };

        return $api.accountReceivable.getSoaList(requestData);
      },
      undefined,
      (tempData) =>
        tempData.map((item, index) => {
          const itemWithKey: ResSoaList & { key: number } = {
            key: index,
            ...item,
          };
          return itemWithKey;
        }),
      []
    );

    usePrepare(
      true,
      () => $api.accountReceivable.prepareSoaList(),
      (tempData) => {
        state.currDay = tempData.currDay;
      }
    );

    function showGuestDialog(status) {
      isSelectGuest.value = status;
    }

    function setSelectedGuest(guest) {
      state.selectedGuest = guest;
    }

    function searchSoa(locale) {
      state.selectType = locale;
      tablePrep.refetch();
    }

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          tablePrep.refetch();
          break;
        default:
          break;
      }
    }

    return {
      ...toRefs(state),
      isSelectGuest,
      searchSoa,
      tablePrep,
      setSelectedGuest,
      showGuestDialog,
      mapActions,
    };
  },
  components: {
    TableStatementOfAccount: () =>
      import('./components/TableStatementOfAccount.vue'),
    SearchStatementOfAccount: () =>
      import('./components/SearchStatementOfAccount.vue'),
    DialogSelectGuest: () => import('./components/DialogSelectGuest.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>

<style scoped></style>
