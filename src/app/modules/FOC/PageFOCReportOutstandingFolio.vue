<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <p class="q-mb-xs">Display</p>
        <q-select
          :value="inputParams.display"
          :options="displayOptions"
          @input="displayChange"
          multiple
          outlined
          use-chips
        />

        <q-separator class="q-my-lg" />

        <SInput label-text="Room" v-model="inputParams.room" />
        <SInput label-text="Group Name" v-model="inputParams.groupName" />

        <div>
          <q-checkbox
            v-model="inputParams.checkOutTodayOnly"
            label="CheckOut Today Only"
          />
          <q-checkbox
            v-model="inputParams.includingZeroBalance"
            label="Including Zero Balance"
          />
          <q-checkbox v-model="inputParams.cashBasis" label="Cash Basis" />
        </div>

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
import { tableHeaders } from './tables/reportOutstandingFolio.table';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      displayOptions: [
        'All',
        'F/O Guest Bill',
        'N/S Guest Bill',
        'Master Bill',
      ],
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      inputParams: {
        display: ['All', 'F/O Guest Bill', 'N/S Guest Bill', 'Master Bill'],
        room: ' ',
        groupName: ' ',
        checkOutTodayOnly: false,
        includingZeroBalance: false,
        cashBasis: false,
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;
    });

    const onSearch = async () => {
      state.table.isFetching = true;

      const inputParam: any = state.inputParams;

      const resBody = {
        pvILanguage: 1,
        coToday: inputParam.checkOutTodayOnly,
        room: inputParam.room === ' ' ? ' ' : inputParam.room.trim(),
        zeroFlag: inputParam.includingZeroBalance,
        cashBasis: inputParam.cashBasis,
        gname: inputParam.groupName === ' ' ? ' ' : inputParam.groupName.trim(),
        menuNsbill: state.inputParams.display.includes('N/S Guest Bill'),
        menuMsbill: state.inputParams.display.includes('Master Bill'),
        menuFobill: state.inputParams.display.includes('F/O Guest Bill'),
      };

      const res = await $api.frontOfficeCashier.billOutstandRmNo(resBody);
      res.map((e, i) => {
        e.indexFoc = i;
      });

      state.table.data = res;
      state.table.isFetching = false;
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.display = [];
      inputParam.room = ' ';
      inputParam.groupName = ' ';
      inputParam.checkOutTodayOnly = false;
      inputParam.includingZeroBalance = false;
      inputParam.cashBasis = false;
      state.table.data = [];
    };

    const displayChange = (newVal) => {
      const inputParam: any = state.inputParams;
      if (newVal.find((item) => item === 'All')) {
        if (inputParam.display.includes('All')) {
          newVal.splice(newVal.indexOf('All'), 1);
          inputParam.display = newVal;
        } else {
          inputParam.display = [
            'All',
            'F/O Guest Bill',
            'N/S Guest Bill',
            'Master Bill',
          ];
        }
      } else {
        if (inputParam.display.includes('All')) {
          inputParam.display = [];
        } else {
          if (newVal.length === state.displayOptions.length - 1) {
            inputParam.display = [
              'All',
              'F/O Guest Bill',
              'N/S Guest Bill',
              'Master Bill',
            ];
          } else {
            inputParam.display = newVal;
          }
        }
      }
    };

    return {
      tableHeaders,
      onSearch,
      onResets,
      displayChange,
      ...toRefs(state),
    };
  },
});
</script>
