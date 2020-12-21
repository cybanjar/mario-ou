<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchJournalizing
        :debit="debit"
        :credit="credit"
        :no-save="tablePrep.data.raw.length === 0"
        @save="saveTransfer"
        @search="onSearch"
      />
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="fetchTableData">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>
      <TableJournalizing
        :loading="tablePrep.data.isLoading"
        :data="tablePrep.result"
      />
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformJournalsData } from './utils/reformData';
export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const debit = ref(0);
    const credit = ref(0);
    const remains = ref(0);
    const isBalance = ref(false);
    const searchParams = ref();

    const tablePrep = usePrepare(
      false,
      (params) => $api.accountReceivable.transferGLLoadData(params),
      (tempData) => {
        if (tempData.msgStr) {
          $q.notify({
            type: 'warning',
            message: tempData.msgStr,
          });
          return; // stop here
        }

        let totalDebit = 0;
        let totalCredit = 0;
        const gList: any[] = tempData?.gList?.['g-list'];

        gList.forEach((it) => {
          totalDebit += it.debit;
          totalCredit += it.credit;
        });

        debit.value = totalDebit;
        credit.value = totalCredit;
        remains.value = totalDebit - totalCredit;
        isBalance.value = totalDebit == totalCredit;
      },
      (tempData) => reformJournalsData(tempData?.gList?.['g-list'] || [], []),
      []
    );

    function getJournals(data) {
      console.log(data);
      let journals = data.map((it) => ({
        rechnr: it.rechnr,
        dept: it.dept,
        jnr: it.jnr,
        fibukonto: it.account_number_ori,
        debit: it.debit_ori,
        credit: it.credit_ori,
        bemerk: it.remark,
        userinit: it.user_id,
        sysdate: it.created_date_ori,
        zeit: it.time_ori,
        chginit: it.changed_id,
        chgdate: it.changed_date_ori,
        duplicate: it.duplicate,
        'add-info': it.additional_info,
        counter: it.counter,
        'acct-fibukonto': it.account_number,
        bezeich: it.description,
      }));
      return journals;
    }

    const savePrep = usePrepare(
      false,
      () => {
        const journals = getJournals(unref(tablePrep.result));
        const mSearchParam = unref(searchParams);
        const params = {
          pvILanguage: 1,
          remains: unref(remains),
          credits: unref(credit),
          debits: unref(debit),
          toDate: mSearchParam.toDate,
          cRefno: mSearchParam.refno,
          cBezeich: mSearchParam.description,
          datum: mSearchParam.toDate,
          gList: {
            'g-list': journals,
          },
        };
        return $api.accountReceivable.transferGLUpdate(params);
      },
      () => {
        $q.notify({
          type: 'positive',
          message: 'Successfuly save data',
        });
      }
    );

    function fetchTableData() {
      const params = unref(searchParams);
      if (params) {
        tablePrep.refetch(params);
      }
    }

    function onSearch(params) {
      searchParams.value = params;

      fetchTableData();
    }

    function saveTransfer() {
      if (unref(isBalance)) {
        savePrep.refetch();
      }
    }

    return {
      tablePrep,
      debit,
      credit,
      onSearch,
      saveTransfer,
      fetchTableData,
    };
  },
  components: {
    SearchJournalizing: () => import('./components/SearchJournalizing.vue'),
    TableJournalizing: () => import('./components/TableJournalizing.vue'),
  },
});
</script>
