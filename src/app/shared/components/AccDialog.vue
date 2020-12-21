<template>
  <SDialog v-bind="$attrs" v-on="$listeners" class="q-m-md">
    <template #title>
      Chart Of Account
    </template>
    <template #body>
      <div class="row justify-center q-col-gutter-lg">
        <div class="col-3">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <SInput v-model="accNum" label-text="Account Number"></SInput>
            <SInput v-model="accName" label-text="Account Name"></SInput>
            <SSelect
              emit-value
              map-options
              v-model="deptNo"
              :options="deptOption"
              label-text="Account Departement"
            ></SSelect>
            <q-btn
              type="submit"
              color="primary"
              label="Select Account"
              class="full-width"
            />
          </q-form>
        </div>
        <div class="col-9 q-p-sm">
          <STable
            row-key="key"
            selection="single"
            :data="tableData"
            :columns="accountColumns"
            :pagination="{ rowsPerPage: 10 }"
            :rows-per-page-options="[10]"
            :selected.sync="selected"
          />
        </div>
      </div>
    </template>
  </SDialog>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  unref,
  watch,
} from '@vue/composition-api';
import { accountColumns } from '../ledger/tables/account.tables';
import { reformAccountData } from '../helpers/reformData.helper';
import { usePrepare } from '..//compositions/use-prepare.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { LedgerAccount } from '../helpers/reformData.helper';
import { SelectItem } from '../models/select.model';

export default defineComponent({
  inheritAttrs: true,
  setup(_, { root: { $api, $q }, emit }) {
    const searchFilter = reactive({
      accName: '',
      accNum: '',
      deptNo: null,
    });

    const selected = ref();

    watch(selected, ([row]) => {
      searchFilter.accName = row.accountName;
      searchFilter.accNum = row.accountNumber;
      searchFilter.deptNo = row.accountDepartment;
    });

    const tableData = ref<LedgerAccount[]>([]);
    const deptOption = ref<SelectItem[]>([]);
    const { data } = usePrepare(
      true,
      () => $api.common.selectAccount(),
      (dataAccount) => {
        let tempTable = dataAccount.glacctList['glacct-list'];
        let tempDept = dataAccount.glDepartList['gl-depart-list'];

        tableData.value = reformAccountData(tempTable, []);
        deptOption.value = mapWithBezeich(tempDept, 'nr');
      }
    );

    function onSubmit() {
      const rows = unref(selected);
      if (rows == false) {
        $q.notify({
          type: 'warning',
          message: 'pick a account',
        });
        return;
      }
      const baseAcc = rows[0];
      emit('onOk', {
        ...baseAcc,
        accountNumber: searchFilter.accNum,
        accountName: searchFilter.accName,
        accountDepartment: searchFilter.deptNo,
      });
    }

    return {
      ...toRefs(searchFilter),
      data,
      deptOption,
      tableData,
      accountColumns,
      onSubmit,
      selected,
    };
  },
});
</script>
