<template>
  <q-dialog v-model="dialogBillTransferModel">
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Bill Transfer
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-table
              dense
              :loading="isFetching"
              :columns="tableHeaders"
              :data="accounts"
              separator="cell"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="pagination"
            >
            </q-table>
          </div>
          <div class="col-6">
            <q-table
              dense
              :loading="isFetching"
              :columns="tableHeaders"
              :data="accounts"
              separator="cell"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="pagination"
            >
            </q-table>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="$emit('onDialogBillTransfer', false)"
        />
        <q-btn
          color="primary"
          label="OK"
          @click="$emit('onDialogBillTransfer', false)"
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
} from '@vue/composition-api';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
  },
  setup(props, { emit }) {
    const state = reactive({
      isFetching: false,
      pagination: {
        rowsPerPage: 10,
      },
      accounts: [
        {
          test: 'test',
        },
      ],
    });

    const dialogBillTransferModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialogBillTransfer', val);
      },
    });

    const tableHeaders = [
      {
        label: 'Test',
        field: 'test',
        name: 'test',
        align: 'right',
        sortable: true,
      },
    ];

    return {
      tableHeaders,
      dialogBillTransferModel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
