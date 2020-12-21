<template>
  <q-dialog v-model="dialogReportTodayDepartedMaster" persistent>
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Show Master Bill
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="col-9">
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
            <template #header-cell-zinr="props">
              <q-th :props="props" class="fixed-col left">
                {{ props.col.label }}
              </q-th>
            </template>

            <template #body-cell-zinr="props">
              <q-td :props="props" class="fixed-col left">
                {{ props.row.zinr }}
              </q-td>
            </template>
          </STable>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
import { tableHeaders } from '../../tables/reportTodayDepartedGuestBill.table';
import { ResTodayDepartedGuestMasterList } from '../../models/report-today-departed-guest-master-list.model';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    masterBill: { type: Array },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
    });

    const getFormattedDate = (date) => {
      const getDate = new Date(date);
      const year = getDate.getFullYear();
      const month = (1 + getDate.getMonth()).toString().padStart(2, '0');
      const day = getDate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    onMounted(async () => {
      state.table.isFetching = false;
    });

    watch(
      () => props.masterBill,
      async (masterBill: any) => {
        masterBill.length > 0 ? (state.table.data = masterBill) : [];
      }
    );

    const selected = ref<ResTodayDepartedGuestMasterList[]>([]);

    const onRowClick = async (_, row: ResTodayDepartedGuestMasterList) => {
      const getRow: any = row;
      selected.value = [row];

      const getReadArticleBody = {
        artNo: getRow.artnr,
        dept: getRow.departement,
        aName: ' ',
      };

      const getReadArticle = await $api.frontOfficeCashier.getReadArticle(
        getReadArticleBody
      );

      if (getReadArticle['tArtikel']['t-artikel'][0]['artart'] === 1) {
        const billNo = row.bezeich.split('*')[1];

        const readHJournalBody = {
          caseType: 1,
          billNo: billNo,
          artNo: getRow.artnr,
          dept: getRow.departement,
          datum: getFormattedDate(getRow['bill-datum']),
          waehrungNo: getRow.waehrungsnr,
        };

        const readHJournal = await $api.frontOfficeCashier.readHJournal(
          readHJournalBody
        );

        readHJournal['tHJournal']['t-h-journal'].map((e, i) => {
          e.indexFoc = i;
        });

        const dialogBody = {
          dialog: false,
          payload: readHJournal['tHJournal']['t-h-journal'],
          status: 'show detail and hide master',
        };
        emit('onDialogReportTodayDepartedMaster', dialogBody);
      }
    };

    const onSubmit = () => {
      state.table.data = [];
      selected.value = [];
      const dialogBody = {
        dialog: false,
        payload: props.masterBill,
        status: 'hide master and show guest',
      };
      emit('onDialogReportTodayDepartedMaster', dialogBody);
    };

    const dialogReportTodayDepartedMaster = computed({
      get: () => props.dialog,
      set: (dialogBody) => {
        emit('onDialogReportTodayDepartedMaster', dialogBody);
      },
    });

    return {
      dialogReportTodayDepartedMaster,
      tableHeaders,
      onRowClick,
      onSubmit,
      selected,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.q-toolbar {
  background: $primary-grad;
}
.selected-row-foc {
  tbody tr.selected td {
    background: #2d00e2 !important;
    color: #fff;
  }
}
</style>
