<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchOutstandingAndBalance @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="getData">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <TableOutstandingAndBalance
        :ap-list="apList"
        :is-fetching="isFetching"
        :sort-type="sortType"
        :type="type"
        @viewStockItemList="showDialogStockItemList"
        @viewDisplayPayment="showDialogDisplayPayment"
      />

      <DialogStockItemList
        :show="dialogStockItemList.visible"
        :request-data="dialogStockItemList.requestData"
        @hide="hideDialogStockItemList"
      />

      <DialogDisplayPayment
        :show="dialogDisplayPayment.visible"
        :recid="dialogDisplayPayment.recid"
        @hide="hideDialogDisplayPayment"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { date } from 'quasar';
import {
  ReqAPList,
  SearchOutstandingAndBalance,
  APList,
  ReqStockItemList,
} from './models/outstanding-and-balance.model';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      apList: [] as APList[],
    });

    let requestData: ReqAPList;

    async function getData() {
      if (requestData) {
        state.isFetching = true;
        const data = await $api.accountsPayable.getAPList(requestData);
        state.apList = data
          .filter((item) => {
            // Item with zero amount need to be deleted from data
            // Usually item with zero amount is unnecessary item with "T O T A L" text in the last item
            return item.amount !== 0;
          })
          .map((item, index) => {
            // Add key with index for each item
            const itemWithKey: APList = {
              ...item,
              key: index,
            };
            return itemWithKey;
          });
        state.isFetching = false;
      }
    }

    const sortType = ref(1);
    const type = ref(2);

    function onSearch(data: SearchOutstandingAndBalance) {
      requestData = {
        lastname: data.supplierName ?? ' ',
        fromDate: date.formatDate(data.date.start, 'MM/DD/YY'),
        toDate: date.formatDate(data.date.end, 'MM/DD/YY'),
        sorttype: data.sortType,
        type1: data.type,
        priceDecimal: '',
      };

      sortType.value = data.sortType;
      type.value = data.type;

      getData();
    }

    // Start Dialog Stock Item List Config
    const dialogStockItemList = reactive({
      visible: false,
      requestData: null as ReqStockItemList | null,
    });
    function showDialogStockItemList(supplierName: string) {
      dialogStockItemList.visible = true;
      dialogStockItemList.requestData = {
        sname: supplierName,
        fdate: requestData.fromDate,
        tdate: requestData.toDate,
        showPrice: true,
        longDigit: true,
      };
    }
    function hideDialogStockItemList() {
      dialogStockItemList.visible = false;
      dialogStockItemList.requestData = null;
    }
    // End Dialog Stock Item List Config

    // Start Dialog Stock Item List Config
    const dialogDisplayPayment = reactive({
      visible: false,
      recid: null as number | null,
    });
    function showDialogDisplayPayment(recid: number) {
      dialogDisplayPayment.visible = true;
      dialogDisplayPayment.recid = recid;
    }
    function hideDialogDisplayPayment() {
      dialogDisplayPayment.visible = false;
      dialogDisplayPayment.recid = null;
    }
    // End Dialog Stock Item List Config

    return {
      ...toRefs(state),
      getData,
      onSearch,
      sortType,
      type,

      dialogStockItemList,
      showDialogStockItemList,
      hideDialogStockItemList,

      dialogDisplayPayment,
      showDialogDisplayPayment,
      hideDialogDisplayPayment,
    };
  },
  components: {
    SearchOutstandingAndBalance: () =>
      import('./components/SearchOutstandingAndBalance.vue'),
    TableOutstandingAndBalance: () =>
      import('./components/TableOutstandingAndBalance.vue'),
    DialogStockItemList: () => import('./components/DialogStockItemList.vue'),
    DialogDisplayPayment: () => import('./components/DialogDisplayPayment.vue'),
  },
});
</script>
