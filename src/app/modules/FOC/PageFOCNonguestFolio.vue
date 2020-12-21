<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <p class="q-mb-xs">Room</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="roomStatusOptions"
          v-model="inputParams.roomStatus"
          :dense="true"
        />
        <SInput label-text="Room" v-model="inputParams.room" />
        <SInput label-text="Name" v-model="inputParams.name" />
        <q-separator class="q-mb-md" />
        <SInput label-text="Account Number" v-model="inputParams.accNumber" />
        <SInput label-text="Quantity" v-model="inputParams.quantity" />
        <SInput label-text="Description" v-model="inputParams.desc" />
        <SInput label-text="Unit Price" v-model="inputParams.unitPrice" />
        <q-separator class="q-mb-md" />
        <SRemarkLeftDrawer
          label="Comment"
          :value="inputParams.comment ? inputParams.comment : 'None'"
        />
      </div>
    </q-drawer>
    <div class="q-ma-md">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="onResets">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <div>
        <STable
          :loading="table.isFetching"
          :columns="tableHeaders"
          :data="table.data"
          :rows-per-page-options="[10, 13, 16]"
          :pagination.sync="table.pagination"
          row-key="indexFoc"
        >
        </STable>

        <div class="row q-mt-lg">
          <div class="col-4 q-pr-lg">
            <SInput label-text="Total" v-model="inputParams.total" />
          </div>
          <div class="col-4 q-px-lg">
            <SInput label-text="Grand Total" v-model="inputParams.grandTotal" />
          </div>
          <div class="col-4 q-pl-lg">
            <SInput label-text="Rate" v-model="inputParams.rate" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
} from '@vue/composition-api';
import { tableHeaders } from './tables/nonguestFolio.table';

export default defineComponent({
  setup() {
    const state = reactive({
      roomStatusOptions: [
        { label: 'Exclude Transfer', value: 0 },
        { label: 'Include Transfer', value: 1 },
        { label: 'Transfer Only', value: 2 },
      ],
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      inputParams: {
        roomStatus: '',
        room: '',
        name: '',
        accNumber: '',
        quantity: '',
        desc: '',
        unitPrice: '',
        comment: '',
        total: '',
        grandTotal: '',
        rate: '',
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;
    });

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.roomStatus = '';
      inputParam.room = '';
      inputParam.name = '';
      inputParam.accNumber = '';
      inputParam.quantity = '';
      inputParam.desc = '';
      inputParam.unitPrice = '';
      inputParam.comment = '';
      inputParam.total = '';
      inputParam.grandTotal = '';
      inputParam.rate = '';
      state.table.data = [];
    };

    return {
      tableHeaders,
      onResets,
      ...toRefs(state),
    };
  },
});
</script>
