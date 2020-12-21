<template>
  <q-dialog v-model="dialogNewFolioModel">
    <q-card style="max-width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          New Folio
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
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
          @click="$emit('onDialogNewFolio', false)"
        />
        <q-btn
          color="primary"
          label="OK"
          @click="$emit('onDialogNewFolio', false)"
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
          number: '1',
          department: 'Front Office 1',
        },
      ],
    });

    const dialogNewFolioModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialogNewFolio', val);
      },
    });

    const tableHeaders = [
      {
        label: 'Number',
        field: 'number',
        name: 'number',
        align: 'right',
        sortable: true,
      },
      {
        label: 'Department',
        field: 'department',
        name: 'department',
        align: 'left',
        sortable: true,
      },
    ];

    return {
      tableHeaders,
      dialogNewFolioModel,
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
