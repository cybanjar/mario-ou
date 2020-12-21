<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <p class="q-mb-xs">Department</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="departmentOptions"
          v-model="inputParams.dept"
          :dense="true"
        />

        <p class="q-mb-xs">Article Number</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="articleNumberOptions"
          v-model="inputParams.articleNumber"
          :dense="true"
        />

        <p class="q-mb-xs">Room Number</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="roomNumberOptions"
          v-model="inputParams.roomNumber"
          :dense="true"
        />
        <SInput label-text="Quantity" v-model="inputParams.quantity" />
        <SInput label-text="Price" v-model="inputParams.price" />
        <SInput
          label-text="Voucher Number"
          v-model="inputParams.voucherNumber"
        />

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-my-md full-width"
          @click="onSearch"
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
import { tableHeaders } from './tables/quickPostingToGuestFolio.table';
// import { store } from '~/store';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      departmentOptions: [
        { label: 'Exclude Transfer', value: 0 },
        { label: 'Include Transfer', value: 1 },
        { label: 'Transfer Only', value: 2 },
      ],
      articleNumberOptions: [
        { label: 'Exclude Transfer', value: 0 },
        { label: 'Include Transfer', value: 1 },
        { label: 'Transfer Only', value: 2 },
      ],
      roomNumberOptions: [
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
        dept: '',
        articleNumber: '',
        roomNumber: '',
        quantity: '',
        price: '',
        voucherNumber: '',
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;
      const checkPermissionBody = {
        userInit: '42',
        arrayNr: 8,
        expectedNr: 2,
      };
      const checkPermission = await $api.frontOfficeCashier.checkPermission(
        checkPermissionBody
      );

      if (checkPermission.zugriff === 'true') {
        const quickPostPrepare = await $api.frontOfficeCashier.quickPostPrepare();
        console.log(quickPostPrepare);
      }
    });

    const onSearch = () => {
      console.log(state.inputParams);
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.dept = '';
      inputParam.articleNumber = '';
      inputParam.roomNumber = '';
      inputParam.quantity = '';
      inputParam.price = '';
      inputParam.voucherNumber = '';
      state.table.data = [];
    };

    return {
      tableHeaders,
      onSearch,
      onResets,
      ...toRefs(state),
    };
  },
});
</script>
