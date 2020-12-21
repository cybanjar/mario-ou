<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <p class="q-mb-xs">From Article</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.fromArt"
          :options="articles"
          :dense="true"
        />

        <p class="q-mb-xs">To Article</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.toArt"
          :options="articles"
          :dense="true"
        />

        <v-date-picker
          mode="range"
          v-model="inputParams.date"
          :masks="{ input: ['DD/MM/YYYY'] }"
          :columns="2"
          :popover="{ visibility: 'click' }"
        >
          <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="From - Until"
            readonly
            v-bind="inputProps"
            clearable
            @clear="date = null"
          >
            <template v-slot:append>
              <q-icon name="mdi-event" />
            </template>
          </SInput>
        </v-date-picker>

        <p class="q-mb-xs">From Department</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.fromDept"
          :options="departments"
          :dense="true"
        />

        <p class="q-mb-xs">To Department</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.toDept"
          :options="departments"
          :dense="true"
        />

        <div>
          <p class="q-mb-xs">Display</p>
          <q-option-group
            :options="displayOptions"
            type="radio"
            v-model="inputParams.sortType"
          />
          <q-checkbox
            v-model="inputParams.foreignFlag"
            label="In Foreign Amount"
          />
          <q-checkbox
            v-model="inputParams.excludeARTrans"
            label="Exclude A/R Transfer"
          />
        </div>

        <div class="q-py-md">
          <q-list bordered class="rounded-borders">
            <q-expansion-item>
              <template v-slot:header>
                <q-item-section>
                  Display Options
                </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  <q-option-group
                    :options="displayOptionsExtra"
                    type="radio"
                    v-model="inputParams.sortTypeOption"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />

            <q-expansion-item :disable="!isTransferOnly">
              <template v-slot:header>
                <q-item-section>
                  Search Date
                </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  <q-option-group
                    :options="searchDateOptions"
                    :disable="!isTransferOnly"
                    type="radio"
                    v-model="inputParams.miPost"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mb-md full-width"
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
          :selected.sync="selected"
          row-key="indexFoc"
          :class="table.data.length > 0 && 'selected-row-foc'"
          @row-click="onRowClick"
        >
        </STable>
      </div>
    </div>
    <DialogReportFoTransaction
      :dialog="dialogReportFoTransaction"
      :master-bill="masterBill"
      :master-bill-member="masterBillMember"
      @onDialogReportFoTransaction="onDialogReportFoTransaction"
    />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
import { tableHeaders } from './tables/reportFoTransaction.table';
import { ResReportFoTransactionList } from './models/report-fo-transaction-list.model';
import { setupCalendar, DatePicker } from 'v-calendar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      inits: {},
      articles: [],
      departments: [],
      displayOptions: [
        { label: 'Exclude Transfer', value: 0 },
        { label: 'Include Transfer', value: 1 },
        { label: 'Transfer Only', value: 2 },
      ],
      isTransferOnly: false,
      displayOptionsExtra: [
        { label: 'All Journal', value: 0 },
        { label: 'Exclude Outlet Journal', value: 1 },
        { label: 'Outlet Journal Only', value: 2 },
      ],
      searchDateOptions: [
        { label: 'By Posting Date', value: 0 },
        { label: 'By Transfer Date', value: 1 },
      ],
      dialogReportFoTransaction: false,
      masterBill: {},
      masterBillMember: [],
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      inputParams: {
        fromArt: {
          value: 1,
          label: '1 Visa',
        },
        toArt: {
          value: 1,
          label: '1 Visa',
        },
        date: {
          start: null,
          end: null,
        },
        fromDept: {
          value: 0,
          label: '0 Front Office',
        },
        toDept: {
          value: 0,
          label: '0 Front Office',
        },
        sortType: 0,
        foreignFlag: false,
        excludeARTrans: false,
        excljournal: false,
        onlyjournal: false,
        miPost: 0,
        sortTypeOption: 0,
        longDigit: false,
      },
    });

    watch(
      () => state.inputParams.sortType,
      async (status) => {
        if (status === 2) {
          state.isTransferOnly = true;
          state.inputParams.miPost = 0;
        } else {
          state.isTransferOnly = false;
          state.inputParams.miPost = 1;
        }
      }
    );

    onMounted(async () => {
      state.table.isFetching = false;

      const getInits = await $api.frontOfficeCashier.bookJournArtPrepare();
      state.inits = getInits;
      state.inputParams.longDigit = getInits.longDigit.toLowerCase() === 'true';
      state.departments = getInits.tHoteldpt['t-hoteldpt'].map((e) => {
        return {
          label: `${e.num} ${e.depart}`,
          value: e.num,
        };
      });

      const getArticles = await $api.frontOfficeCashier.loadArtikel();
      state.articles = getArticles.map((e) => {
        return {
          label: `${e.artnr} ${e.bezeich}`,
          value: e.artnr,
        };
      });
    });

    const onDialogReportFoTransaction = (dialogBody) => {
      state.dialogReportFoTransaction = dialogBody.dialog;
    };

    const selected = ref<ResReportFoTransactionList[]>([]);

    const onRowClick = async (_, row: ResReportFoTransactionList) => {
      if ([row][0]['c'] === 'M') {
        selected.value = [row];

        const masterBillBody = {
          rechnr: [row][0]['billno'],
        };

        const getMasterBill = await $api.frontOfficeCashier.bookJournArtViewMBill(
          masterBillBody
        );

        const masterBillMemberBody = {
          resno: getMasterBill.billResnr,
          billno: getMasterBill.billRechnr,
        };

        const getMasterBillMember = await $api.frontOfficeCashier.bookJournArtMBillMember(
          masterBillMemberBody
        );

        getMasterBillMember['b1List']['b1-list'].map((e, i) => {
          e.indexFoc = i;
        });

        state.masterBill = getMasterBillMember;
        state.masterBillMember = getMasterBillMember['b1List']['b1-list'];

        const dialogBody = {
          dialog: true,
        };
        onDialogReportFoTransaction(dialogBody);
      }
    };

    const onSearch = async () => {
      state.table.isFetching = true;

      const inputParam: any = state.inputParams;

      function getFormattedDate(date) {
        const year = date.getFullYear();
        const month = (1 + date.getMonth()).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return day + '/' + month + '/' + year;
      }

      if (inputParam.sortTypeOption === 1) {
        inputParam.onlyjournal = false;
        inputParam.excljournal = true;
      } else if (inputParam.sortTypeOption === 2) {
        inputParam.onlyjournal = true;
        inputParam.excljournal = false;
      } else {
        inputParam.onlyjournal = false;
        inputParam.excljournal = false;
      }

      const resBody = {
        fromArt: inputParam.fromArt.value ? inputParam.fromArt.value : 1,
        toArt: inputParam.toArt.value ? inputParam.toArt.value : 1,
        fromDate: getFormattedDate(inputParam.date.start),
        toDate: getFormattedDate(inputParam.date.end),
        fromDept: inputParam.fromDept.value ? inputParam.fromDept.value : 0,
        toDept: inputParam.toDept.value ? inputParam.toDept.value : 0,
        sorttype: parseInt(inputParam.sortType)
          ? parseInt(inputParam.sortType)
          : 0,
        foreignFlag: inputParam.foreignFlag,
        excludeARTrans: inputParam.excludeARTrans,
        excljournal: inputParam.excljournal,
        onlyjournal: inputParam.onlyjournal,
        miPost: inputParam.miPost === 0 ? true : false,
        longDigit: inputParam.longDigit,
      };

      const res = await $api.frontOfficeCashier.bookJournArtList(resBody);
      res.map((e, i) => {
        e.indexFoc = i;
      });
      state.table.data = res;
      // state.table.data = res.filter((e) => e.c === 'M');
      state.table.isFetching = false;
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.fromArt = {
        value: null,
        label: null,
      };
      inputParam.toArt = {
        value: null,
        label: null,
      };
      inputParam.date = {
        start: null,
        end: null,
      };
      inputParam.fromDept = {
        value: null,
        label: null,
      };
      inputParam.toDept = {
        value: null,
        label: null,
      };
      inputParam.sortType = null;
      inputParam.foreignFlag = false;
      inputParam.excludeARTrans = false;
      inputParam.sortTypeOption = null;
      inputParam.excljournal = false;
      inputParam.onlyjournal = false;
      inputParam.miPost = 0;
      state.table.data = [];
    };

    return {
      tableHeaders,
      selected,
      onRowClick,
      onSearch,
      onDialogReportFoTransaction,
      onResets,
      ...toRefs(state),
    };
  },
  components: {
    'v-date-picker': DatePicker,
    DialogReportFoTransaction: () =>
      import('./components/Dialog/DialogReportFoTransaction.vue'),
  },
});
</script>

<style lang="scss">
.selected-row-foc {
  tbody tr.selected td {
    background: #2d00e2 !important;
    color: #fff;
  }
}
</style>
