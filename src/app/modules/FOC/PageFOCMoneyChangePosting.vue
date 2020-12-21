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

        <SInput label-text="Buy" v-model="inputParams.buy" />
        <SInput label-text="Sell" v-model="inputParams.sell" />
        <SInput label-text="Execute" v-model="inputParams.execute" />

        <div class="row justify-between items-center">
          <SInput label-text="Room Number" v-model="inputParams.roomNumber" />
          <q-icon
            name="mdi-crosshairs-question"
            color="primary"
            class="q-mt-sm"
            style="font-size: 30px; cursor: pointer;"
            @click="onSelectRoom"
          />
        </div>

        <SInput label-text="Name" v-model="inputParams.name" />

        <div class="row">
          <div class="col-6">
            <SInput
              label-text="Number Of"
              class="q-pr-sm"
              v-model="inputParams.numberOf"
            />
          </div>
          <div class="col-6">
            <SInput label-text="ID" class="q-pl-sm" v-model="inputParams.id" />
          </div>
        </div>

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          class="q-my-md full-width"
          @click="onSearch"
        />

        <q-btn
          block
          color="white"
          text-color="black"
          max-height="28"
          icon="mdi-cancel"
          label="Cancle"
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
    <DialogMoneyChangePosting
      :dialog="dialogMoneyChangePosting"
      @onDialogMoneyChangePosting="onDialogMoneyChangePosting"
    />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
} from '@vue/composition-api';
import { tableHeaders } from './tables/moneyChangePosting.table';

export default defineComponent({
  setup() {
    const state = reactive({
      dialogMoneyChangePosting: false,
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
        buy: '',
        sell: '',
        execute: '',
        roomNumber: '',
        name: '',
        numberOf: '',
        id: '',
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;
    });

    const onDialogMoneyChangePosting = (dialogBody) => {
      state.dialogMoneyChangePosting = dialogBody.dialog;
    };

    const onSelectRoom = () => {
      const dialogBody = {
        dialog: true,
      };
      onDialogMoneyChangePosting(dialogBody);
    };

    const onSearch = () => {
      console.log(state.inputParams);
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.dept = '';
      inputParam.articleNumber = '';
      inputParam.buy = '';
      inputParam.sell = '';
      inputParam.execute = '';
      inputParam.roomNumber = '';
      inputParam.name = '';
      inputParam.numberOf = '';
      inputParam.id = '';
      state.table.data = [];
    };

    return {
      tableHeaders,
      onDialogMoneyChangePosting,
      onSelectRoom,
      onSearch,
      onResets,
      ...toRefs(state),
    };
  },
  components: {
    DialogMoneyChangePosting: () =>
      import('./components/Dialog/DialogMoneyChangePosting.vue'),
  },
});
</script>
