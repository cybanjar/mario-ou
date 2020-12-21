<template>
  <q-dialog v-model="dialogReportTodayDepartedDetail" persistent>
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
import { tableHeaders } from '../../tables/reportTodayDepartedGuestDetail.table';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    detailBill: { type: Array },
    isMasterBill: { type: Boolean },
  },

  setup(props, { emit }) {
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
      () => props.detailBill,
      async (detailBill: any) => {
        detailBill.length > 0 ? (state.table.data = detailBill) : [];
      }
    );

    const onSubmit = () => {
      state.table.data = [];
      const dialogBody = {
        dialog: false,
        payload: [],
        status: 'hide detail and show master',
      };
      emit('onDialogReportTodayDepartedDetail', dialogBody);
    };

    const dialogReportTodayDepartedDetail = computed({
      get: () => props.dialog,
      set: (dialogBody) => {
        emit('onDialogReportTodayDepartedDetail', dialogBody);
      },
    });

    return {
      dialogReportTodayDepartedDetail,
      tableHeaders,
      onSubmit,
      ...toRefs(state),
    };
  },
});
</script>
