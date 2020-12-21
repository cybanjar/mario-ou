<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchSupplierProfile :remark="remark" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg" @click="getData">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
        <q-btn flat round @click="dialogPayVisible = true">
          <img :src="require('~/app/icons/Icon-Pay.svg')" height="30" />
        </q-btn>
      </div>

      <TableSupplierProfile
        :supplier-list="supplierList"
        :is-fetching="isFetching"
        @onRowClick="onRowClick"
      />

      <DialogPaySupplierProfile
        :show="dialogPayVisible"
        @hide="dialogPayVisible = false"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { ResSupplierList } from './models/supplier-profile.model';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let supplierListData: ResSupplierList[] = []; // Store all of supplier list data here to process later with state

    const state = reactive({
      isFetching: true,
      supplierList: [] as ResSupplierList[],
      remark: '',
      dialogPayVisible: false,
    });

    async function getData() {
      state.isFetching = true;

      const supplierList = await $api.accountsPayable.getSupplierList();
      supplierListData = supplierList.sort((a, b) =>
        a.firma.localeCompare(b.firma)
      );

      state.supplierList = supplierListData;
      state.isFetching = false;
    }
    getData();

    function onRowClick(remark: string) {
      state.remark = remark;
    }

    function onSearch(supplierName: string) {
      state.supplierList = supplierListData.filter((supplier) =>
        supplier.firma.toLowerCase().includes(supplierName.toLowerCase())
      );
    }

    return {
      ...toRefs(state),
      getData,
      onRowClick,
      onSearch,
    };
  },
  components: {
    SearchSupplierProfile: () =>
      import('./components/SearchSupplierProfile.vue'),
    TableSupplierProfile: () => import('./components/TableSupplierProfile.vue'),
    DialogPaySupplierProfile: () =>
      import('./components/DialogPaySupplierProfile.vue'),
  },
});
</script>
