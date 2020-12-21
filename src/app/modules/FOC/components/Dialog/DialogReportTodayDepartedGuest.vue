<template>
  <q-dialog v-model="dialogReportTodayDepartedGuest" persistent>
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Show FO Guest Bill
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
            row-key="indexFoc"
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
        <q-btn
          v-if="isMasterBill"
          color="white"
          text-color="black"
          label="Master Bill"
          @click="onMasterBill"
        />
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
  watch,
} from '@vue/composition-api';
import { tableHeaders } from '../../tables/reportTodayDepartedGuestBill.table';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    guestBill: { type: Array },
    selectedData: { type: Object },
    isMasterBill: { type: Boolean },
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

    onMounted(async () => {
      state.table.isFetching = false;
    });

    watch(
      () => props.guestBill,
      async (guestBill: any) => {
        guestBill.length > 0 ? (state.table.data = guestBill) : [];
      }
    );

    const onMasterBill = async () => {
      const prop: any = props;
      const getReadBillBody = {
        caseType: 2,
        billNo: prop.selectedData.rechnr,
        resNo: prop.selectedData.resnr,
        reslinNo: 0,
        actFlag: 0,
      };

      const getReadBill = await $api.frontOfficeCashier.getReadBill(
        getReadBillBody
      );

      const readBillLineBody = {
        caseType: 2,
        rechNo: getReadBill['tBill']['t-bill'][0]['rechnr'],
        artNo: 0,
      };

      const readBillLine = await $api.frontOfficeCashier.readBillLine(
        readBillLineBody
      );

      readBillLine.tBillLine['t-bill-line'].map((e, i) => {
        e.indexFoc = i;
      });

      const dialogBody = {
        dialog: false,
        payload: readBillLine.tBillLine['t-bill-line'],
        status: 'hide guest and show master',
      };
      emit('onDialogReportTodayDepartedGuest', dialogBody);
    };

    const onSubmit = () => {
      state.table.data = [];
      const dialogBody = {
        dialog: false,
        payload: [],
        status: 'hide guest',
      };
      emit('onDialogReportTodayDepartedGuest', dialogBody);
    };

    const dialogReportTodayDepartedGuest = computed({
      get: () => props.dialog,
      set: (dialogBody) => {
        emit('onDialogReportTodayDepartedGuest', dialogBody);
      },
    });

    return {
      dialogReportTodayDepartedGuest,
      tableHeaders,
      onMasterBill,
      onSubmit,
      ...toRefs(state),
    };
  },
});
</script>
