<template>
  <q-dialog v-model="dialogReportFoTransaction" persistent>
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Member of Master Bill - No {{ masterBill.billno }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <STable
          :columns="tableHeaders"
          :data="masterBillMember"
          :rows-per-page-options="[10, 13, 16]"
          :pagination.sync="table.pagination"
          row-key="indexFoc"
        >
        </STable>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="onClose"
        />
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
} from '@vue/composition-api';
import { tableHeaders } from '../../tables/reportFoTransactionDialog.table';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    masterBill: { type: Object, required: true },
    masterBillMember: { type: Array, required: true },
  },

  setup(props, { emit }) {
    const state = reactive({
      table: {
        data: [],
        pagination: {
          rowsPerPage: 10,
        },
      },
    });

    const onSubmit = async () => {
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogReportFoTransaction', dialogBody);
    };

    const onClose = () => {
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogReportFoTransaction', dialogBody);
    };

    const dialogReportFoTransaction = computed({
      get: () => props.dialog,
      set: (dialog) => {
        emit('onDialogReportFoTransaction', dialog);
      },
    });

    return {
      dialogReportFoTransaction,
      tableHeaders,
      onSubmit,
      onClose,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.q-toolbar {
  background: $primary-grad;
}
</style>
