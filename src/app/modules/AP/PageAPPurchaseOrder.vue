<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchPurchaseOrder @onSearch="onSearch" />
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

      <TablePurchaseOrder
        :purchase-order-list="purchaseOrderList"
        :is-fetching="isFetching"
        @viewDetail="showDialogDetail"
      />

      <DialogPurchaseOrderDetail
        :show="dialog.visible"
        :document-number="dialog.documentNumber"
        @hide="hideDialogDetail"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { date } from 'quasar';
import {
  SearchPurchaseOrder,
  ReqPurchaseOrderList,
  ResPurchaseOrderList,
} from './models/purchase-order.model';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      purchaseOrderList: [] as ResPurchaseOrderList[],
    });

    let requestData: ReqPurchaseOrderList;

    async function getData() {
      if (requestData) {
        state.isFetching = true;
        state.purchaseOrderList = await $api.accountsPayable.getPurchaseOrderList(
          requestData
        );
        state.isFetching = false;
      }
    }

    function onSearch(data: SearchPurchaseOrder) {
      requestData = {
        stattype: data.status,
        fromDate: date.formatDate(data.date.start, 'MM/DD/YY'),
        toDate: date.formatDate(data.date.end, 'MM/DD/YY'),
        usrname: data.user ?? ' ',
        poNumber: data.documentNumber.length > 0 ? data.documentNumber : ' ',
        deptnr: data.department ?? -1,
        tLiefNo: data.supplier ?? '',
        allSupp: data.displayAllSupplier,
        billdate: data.billDate
          ? date.formatDate(data.billDate, 'MM/DD/YY')
          : '',
        dmlOnly: false,
        lastDocNr: ' ',
        sorttype: 1,
      };

      getData();
    }

    // Start dialog purchase order detail config
    const dialog = reactive({
      visible: false,
      documentNumber: '',
    });
    function showDialogDetail(documentNumber: string) {
      dialog.documentNumber = documentNumber;
      dialog.visible = true;
    }
    function hideDialogDetail() {
      dialog.documentNumber = '';
      dialog.visible = false;
    }
    // End dialog purchase order detail config

    return {
      ...toRefs(state),
      onSearch,
      getData,
      dialog,
      showDialogDetail,
      hideDialogDetail,
    };
  },
  components: {
    TablePurchaseOrder: () => import('./components/TablePurchaseOrder.vue'),
    SearchPurchaseOrder: () => import('./components/SearchPurchaseOrder.vue'),
    DialogPurchaseOrderDetail: () =>
      import('./components/DialogPurchaseOrderDetail.vue'),
  },
});
</script>
